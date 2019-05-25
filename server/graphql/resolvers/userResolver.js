const { withFilter } = require('graphql-subscriptions');
const User = require('../../models/User');
const { generateToken } = require('../../utils');
const tags = require('../tags');

module.exports = {
  Query: {
    users: async (root, args, { userLoader }) => {
      const users = await User.find({}, { inbox: 0 });
      users.map(user => userLoader.prime(user._id, user));
      return users;
    },
    getUsersByIds: async (root, { userIds }, { userLoader }) => (
      userLoader.loadMany(userIds)
    ),
    getUserByUsername: async (root, { username }) => User.findOne({ username }),
    searchUsers: async (root, { userQuery }) => (
      User.find({ username: new RegExp(userQuery, 'i') })
    ),
  },
  Mutation: {
    relog: async (root, args, { userId, userLoader }) => {
      if (!userId) throw new Error('Unauthorized.');
      return userLoader.load(userId);
    },
    login: async (root, { email, password }, { userLoader }) => {
      const currentUser = await User.login(email, password);
      const token = generateToken(currentUser._id);

      const user = (await userLoader.load(currentUser._id)).toObject();

      return { ...user, token };
    },
    signup: async (root, { userInput }) => {
      const currentUser = await User.createUser(userInput);
      const token = generateToken(currentUser._id);
      return { ...currentUser._doc, token };
    },
    updateUserInfo: (root, { info }, { userId }) => {
      if (!userId) throw new Error('Unauthorized.');
      return User.updateInfo(userId, info);
    },
    toggleFollow: async (root, { userId: userIdToFollow }, { userId, pubsub }) => {
      if (!userId) throw new Error('Unauthorized.');
      const { follower, followee, isFollow } = await User.toggleFollow(userId, userIdToFollow);

      pubsub.publish(
        tags.FOLLOWERS_UPDATES,
        {
          followersUpdates: {
            follower,
            isFollow,
          },
          toUserId: userIdToFollow,
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

      const [sender] = await Promise.all([
        User.findByIdAndUpdate(
          userId,
          { $push: { sentFriendRequests: requestedUserId } },
        ),
        User.findByIdAndUpdate(
          requestedUserId,
          { $push: { incomingFriendRequests: userId } },
        ),
      ]);

      pubsub.publish(
        tags.NEW_FRIEND_REQUEST,
        { user: sender, toUserId: requestedUserId },
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

      await Promise.all([
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
        { user: accepter, toUserId: userIdToAccept },
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
        userIdToDecline,
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
      resolve: ({ user }) => user,
    },
    acceptedFriendRequest: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(tags.ACCEPTED_FRIEND_REQUEST),
        (payload, variables, { currentUserId }) => payload.toUserId === currentUserId,
      ),
      resolve: ({ user }) => user,
    },
    declinedFriendRequest: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(tags.DECLINED_FRIEND_REQUEST),
        (payload, variables, { currentUserId }) => payload === currentUserId,
      ),
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
        (payload, variables, { currentUserId }) => payload.toUserId === currentUserId,
      ),
      resolve: ({ followersUpdates }) => followersUpdates,
    },
  },
};
