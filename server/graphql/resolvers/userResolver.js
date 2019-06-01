const { withFilter } = require('graphql-subscriptions');
const User = require('../../models/User');
const { generateToken } = require('../../utils');
const tags = require('../tags');

module.exports = {
  Query: {
    getUsersByIds: async (root, { userIds }, { userLoader }) => (
      userLoader.loadMany(userIds)
    ),
    getUserByUsername: async (root, { username }) => User.findOne({ username }),
    searchUsers: async (root, { userQuery }, { userId }) => (
      User.find({ _id: { $ne: userId }, username: new RegExp(userQuery, 'i') })
    ),
  },
  Mutation: {
    relog: async (root, args, { userId, userLoader }) => {
      if (!userId) throw new Error('Unauthorized.');
      return userLoader.load(userId);
    },
    login: async (root, { email, password }, { userLoader }) => {
      const { _id, username } = await User.login(email, password);
      const token = generateToken(_id, username);

      const user = (await userLoader.load(_id)).toObject();

      return { ...user, token };
    },
    signup: async (root, { userInput }) => {
      const currentUser = await User.createUser(userInput);
      const token = generateToken(currentUser._id, currentUser.username);
      return { ...currentUser._doc, token };
    },
    readNotification: async (root, { notificationId }, { userId }) => {
      if (!userId) throw new Error('Unauthorized.');
      return User.readNotification(notificationId, userId);
    },
    readAllNotifications: async (root, { unreadNotificationsIds }, { userId }) => {
      if (!userId) throw new Error('Unauthorized.');
      return User.readAllNotifications(unreadNotificationsIds, userId);
    },
    deleteNotification: async (root, { notificationId }, { userId }) => {
      if (!userId) throw new Error('Unauthorized.');
      return User.deleteNotification(notificationId, userId);
    },
    deleteAllNotifications: async (root, args, { userId }) => {
      if (!userId) throw new Error('Unauthorized.');
      return User.deleteAllNotifications(userId);
    },
    updateUserInfo: (root, { info }, { userId }) => {
      if (!userId) throw new Error('Unauthorized.');
      return User.updateInfo(userId, info);
    },
    toggleFollow: async (root, { userId: userIdToFollow }, { userId, pubsub }) => {
      if (!userId) throw new Error('Unauthorized.');
      const { follower, followee, isFollow } = await User.toggleFollow(userId, userIdToFollow);

      let notification = null;

      if (isFollow) {
        notification = await User.addNotification({ from: userId, body: 'followed you!' }, userIdToFollow);
      }

      pubsub.publish(
        tags.FOLLOWERS_UPDATES,
        {
          toUserId: userIdToFollow,
          followersUpdates: {
            follower,
            isFollow,
            notification,
          },
        },
      );

      return {
        followee,
        isFollow,
      };
    },
    sendFriendRequest: async (root, { userId: requestedUserId }, { userId = '5ce8e8d72560264b9021842e', pubsub }) => {
      if (!userId) throw new Error('Unauthorized.');

      const [senderRequestExist, senderAlreadyFriends] = await Promise.all([
        User.findOne(
          { _id: userId, sentFriendRequests: { $elemMatch: { $eq: requestedUserId } } },
          { _id: 1 },
        ),
        User.findOne(
          { _id: userId, friends: { $elemMatch: { $eq: requestedUserId } } },
          { _id: 1 },
        ),
      ]);

      if (senderRequestExist) throw new Error('Request already sent.');
      if (senderAlreadyFriends) throw new Error('Already friends.');

      const [,, notification] = await Promise.all([
        User.findByIdAndUpdate(
          userId,
          { $push: { sentFriendRequests: requestedUserId } },
        ),
        User.findByIdAndUpdate(
          requestedUserId,
          { $push: { incomingFriendRequests: userId } },
        ),
        User.addNotification({ from: userId, body: 'sent  you a friend request!' }, requestedUserId),
      ]);

      pubsub.publish(
        tags.NEW_FRIEND_REQUEST,
        {
          toUserId: requestedUserId,
          newFriendRequest: {
            user: userId,
            notification,
          },
        },
      );

      return requestedUserId;
    },
    acceptFriendRequest: async (root, { userId: userIdToAccept }, { userId = '5ce8e8d72560264b9021842e', pubsub }) => {
      if (!userId) throw new Error('Unauthorized.');

      const accepter = await User.findOne(
        { _id: userId, incomingFriendRequests: { $elemMatch: { $eq: userIdToAccept } } },
        { friends: 1, username: 1, avatar: 1 },
      );

      if (!accepter) throw new Error('This request does not exist anymore.');

      if (accepter.friends.some(f => f.toString() === userIdToAccept)) {
        throw new Error('already friends.');
      }

      const [notification] = await Promise.all([
        User.addNotification({ from: userId, body: 'accepted your friend request!' }, userIdToAccept),
        User.findByIdAndUpdate(
          userIdToAccept,
          {
            $pull: { sentFriendRequests: userId },
            $push: { friends: userId },
          },
        ),
        User.findByIdAndUpdate(
          userId,
          {
            $pull: { incomingFriendRequests: userIdToAccept },
            $push: { friends: userIdToAccept },
          },
        ),
      ]);

      pubsub.publish(
        tags.ACCEPTED_FRIEND_REQUEST,
        {
          toUserId: userIdToAccept,
          acceptedFriendRequest: {
            user: userId,
            notification,
          },
        },
      );

      return userIdToAccept;
    },
    cancelFriendRequest: async (root, { userId: userIdToCancel }, { userId, pubsub }) => {
      if (!userId) throw new Error('Unauthorized.');

      await Promise.all([
        User.findByIdAndUpdate(
          userId,
          { $pull: { sentFriendRequests: userIdToCancel } },
        ),
        User.findByIdAndUpdate(
          userIdToCancel,
          { $pull: { incomingFriendRequests: userId } },
        ),
      ]);

      pubsub.publish(
        tags.CANCELED_FRIEND_REQUEST,
        { toUserId: userIdToCancel, cancelerId: userId },
      );

      return true;
    },
    declineFriendRequest: async (root, { userId: userIdToDecline }, { userId = '5ce8e8d72560264b9021842e', pubsub }) => {
      if (!userId) throw new Error('Unauthorized.');

      await Promise.all([
        User.findByIdAndUpdate(
          userId,
          { $pull: { incomingFriendRequests: userIdToDecline } },
        ),
        User.findByIdAndUpdate(
          userIdToDecline,
          { $pull: { sentFriendRequests: userId } },
        ),
      ]);

      pubsub.publish(
        tags.DECLINED_FRIEND_REQUEST,
        { declinedUserId: userIdToDecline },
      );

      return true;
    },
    removeFriend: async (root, { userId: userIdToRemove }, { userId = '5ce8e8d72560264b9021842e', pubsub }) => {
      if (!userId) throw new Error('Unauthorized.');

      await Promise.all([
        User.findByIdAndUpdate(
          userId,
          { $pull: { friends: userIdToRemove } },
        ),
        User.findByIdAndUpdate(
          userIdToRemove,
          { $pull: { friends: userId } },
        ),
      ]);

      console.log('publishing');
      pubsub.publish(
        tags.DELETE_FRIEND,
        { deleterId: userId, toUserId: userIdToRemove },
      );

      return true;
    },
  },
  Subscription: {
    newFriendRequest: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(tags.NEW_FRIEND_REQUEST),
        (payload, variables, { currentUserId }) => payload.toUserId === currentUserId,
      ),
    },
    acceptedFriendRequest: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(tags.ACCEPTED_FRIEND_REQUEST),
        (payload, variables, { currentUserId }) => payload.toUserId === currentUserId,
      ),
    },
    declinedFriendRequest: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(tags.DECLINED_FRIEND_REQUEST),
        ({ declinedUserId }, variables, { currentUserId }) => declinedUserId === currentUserId,
      ),
      resolve: ({ declinedUserId }) => declinedUserId,
    },
    canceledFriendRequest: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(tags.CANCELED_FRIEND_REQUEST),
        ({ toUserId }, variables, { currentUserId }) => toUserId === currentUserId,
      ),
      resolve: ({ cancelerId }) => cancelerId,
    },
    deleteFriend: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(tags.DELETE_FRIEND),
        ({ toUserId }, variables, { currentUserId }) => toUserId === currentUserId,
      ),
      resolve: ({ deleterId }) => deleterId,
    },
    followersUpdates: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(tags.FOLLOWERS_UPDATES),
        ({ toUserId }, variables, { currentUserId }) => toUserId === currentUserId,
      ),
      // resolve: ({ followersUpdates }) => followersUpdates,
    },
  },
  Notification: {
    from: ({ from }, args, { userLoader }) => userLoader.load(from.toString()),
  },
  NewFriendRequest: {
    user: ({ user }, args, { userLoader }) => userLoader.load(user),
  },
  AcceptedFriendRequest: {
    user: ({ user }, args, { userLoader }) => userLoader.load(user),
  },
};
