const User = require('../../models/User');
const { generateToken } = require('../../utils');

module.exports = {
  Query: {
    user: (root, { id }, { userLoader }) => userLoader.load(id),
    users: async (root, args, { userLoader }) => {
      const users = await User.find({}, { inbox: 0 });
      users.map(user => userLoader.prime(user._id, user));
      return users;
    },
    getUsersByIds: async (root, { userIds }, { userLoader }) => {
      const users = await userLoader.loadMany(userIds);
      console.log(users);
      return users;
    },
    getUserByUsername: async (root, { username }) => User.findOne({ username }),
    searchUsers: async (root, { userQuery }) => {
      const regEx = new RegExp(userQuery, 'i');
      return User.find({ username: regEx });
    },
  },
  Mutation: {
    relog: async (root, args, { userId, userLoader }) => {
      console.log('relogging');
      if (!userId) throw new Error('Unauthorized.');
      return userLoader.load(userId);
    },
    login: async (root, { email, password }, { userLoader }) => {
      const currentUser = await User.login(email, password);
      const token = generateToken(currentUser._id);

      const user = (await userLoader.load(currentUser._id)).toObject();

      console.log(user);

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
    toggleFollow: (root, { userId: userIdToFollow }, { userId }) => {
      if (!userId) throw new Error('Unauthorized.');
      return User.toggleFollow(userId, userIdToFollow);
    },
    sendFriendRequest: async (root, { userId: requstedUserId }, { userId }) => {
      if (!userId) throw new Error('Unauthorized.');

      const [isRequestExist, alreadyFriends] = await Promise.all([
        User.findOne(
          { _id: userId, 'sentFriendRequests.to': requstedUserId },
          { _id: 1, friends: 1 },
        ),
        User.findOne(
          { _id: userId, friends: { $elemMatch: { $eq: requstedUserId } } },
        ),
      ]);

      if (isRequestExist) throw new Error('Request already sent.');
      if (alreadyFriends) throw new Error('Already friends.');

      await Promise.all([
        User.findByIdAndUpdate(
          userId,
          { $push: { sentFriendRequests: { to: requstedUserId } } },
        ),
        User.findByIdAndUpdate(
          requstedUserId,
          { $push: { incomingFriendRequests: { from: userId } } },
        ),
      ]);
      return requstedUserId;
    },
    acceptFriendRequest: async (root, { userId: userIdToAccept }, { userId = '5cbfc0140389d842b895be4d' }) => {
      if (!userId) throw new Error('Unauthorized.');

      console.log(
        await User.findById(userId),
      );

      const isRequestExist = await User.findOne(
        { _id: userId, 'incomingFriendRequests.from': userIdToAccept },
        { friends: 1 },
      );

      console.log(isRequestExist);

      if (!isRequestExist) throw new Error('This request does not exist anymore.');

      if (isRequestExist.friends.some(f => f.toString() === userIdToAccept)) {
        throw new Error('Already friends.');
      }

      await Promise.all([
        User.findByIdAndUpdate(
          userIdToAccept,
          {
            $pull: { sentFriendRequests: { to: userId } },
            $push: { friends: userId },
          },
        ),
        User.findByIdAndUpdate(
          userId,
          {
            $pull: { incomingFriendRequests: { from: userIdToAccept } },
            $push: { friends: userIdToAccept },
          },
        ),
      ]);

      return userIdToAccept;
    },
    cancelFriendRequest: async (root, { userId: userIdToCancel }, { userId }) => {
      if (!userId) throw new Error('Unauthorized.');

      console.log(userId, userIdToCancel);

      await Promise.all([
        User.findByIdAndUpdate(
          userId,
          { $pull: { sentFriendRequests: { to: userIdToCancel } } },
        ),
        User.findByIdAndUpdate(
          userIdToCancel,
          { $pull: { incomingFriendRequests: { from: userId } } },
        ),
      ]);

      return true;
    },
    declineFriendRequest: async (root, { userId: userIdToDecline }, { userId = '5cbfc0140389d842b895be4d' }) => {
      if (!userId) throw new Error('Unauthorized.');

      await Promise.all([
        User.findByIdAndUpdate(
          userId,
          { $pull: { incomingFriendRequests: { from: userIdToDecline } } },
        ),
        User.findByIdAndUpdate(
          userIdToDecline,
          { $pull: { sentFriendRequests: { to: userId } } },
        ),
      ]);

      return true;
    },
    removeFriend: async (root, { userId: userIdToRemove }, { userId }) => {
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
};
