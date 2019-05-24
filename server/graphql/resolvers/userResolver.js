const { withFilter } = require('graphql-subscriptions');
const User = require('../../models/User');
const { generateToken } = require('../../utils');
const { NEW_FRIEND_REQUEST, FOLLOWERS_UPDATES, ACCEPTED_FRIEND_REQUEST } = require('../tags');

module.exports = {
  Query: {
    user: (root, { id }, { userLoader }) => userLoader.load(id),
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
        FOLLOWERS_UPDATES,
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
    sendFriendRequest: async (root, { userId: requestedUserId }, { userId = '5cd60ece73783b225425ecbf', pubsub }) => {
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

      pubsub.publish(NEW_FRIEND_REQUEST, { user: sender, toUserId: requestedUserId });

      return requestedUserId;
    },
    acceptFriendRequest: async (root, { userId: userIdToAccept }, { userId = '5cd60ece73783b225425ecbf', pubsub }) => {
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
        ACCEPTED_FRIEND_REQUEST,
        { user: accepter, toUserId: userIdToAccept },
      );
      return userIdToAccept;
    },
    cancelFriendRequest: async (root, { userId: userIdToCancel }, { userId }) => {
      console.log(userId);
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

      return true;
    },
    declineFriendRequest: async (root, { userId: userIdToDecline }, { userId = '5cd60ece73783b225425ecbf' }) => {
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

      return true;
    },
    removeFriend: async (root, { userId: userIdToRemove }, { userId = '5cd60ece73783b225425ecbf' }) => {
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

      return true;
    },
  },
  Subscription: {
    newFriendRequest: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(NEW_FRIEND_REQUEST),
        (payload, variables, { currentUserId }) => payload.toUserId === currentUserId,
      ),
      resolve: ({ user }) => user,
    },
    acceptedFriendRequest: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(ACCEPTED_FRIEND_REQUEST),
        (payload, variables, { currentUserId }) => payload.toUserId === currentUserId,
      ),
      resolve: ({ user }) => user,
    },
    followersUpdates: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(FOLLOWERS_UPDATES),
        (payload, variables, { currentUserId }) => payload.toUserId === currentUserId,
      ),
      resolve: ({ followersUpdates }) => followersUpdates,
    },
  },
};
