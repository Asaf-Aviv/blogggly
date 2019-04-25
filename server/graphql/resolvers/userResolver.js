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
      if (!userId) throw new Error('Unauthorized');
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
      if (!userId) throw new Error('Unauthorized, Please Login to update your info.');
      return User.updateInfo(userId, info);
    },
    toggleFollow: (root, { userId: userIdToFollow }, { userId }) => {
      if (!userId) throw new Error('Unauthorized, Please Login to follow this author.');
      return User.toggleFollow(userId, userIdToFollow);
    },
  },
};
