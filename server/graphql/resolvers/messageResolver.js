const User = require('../../models/User');

module.exports = {
  Mutation: {
    sendMessage: async (root, { to, body }, { userId }) => {
      if (!userId) throw new Error('Unauthorized, Please Login to send a message.');
      const message = await User.sendMessage(userId, to, body);
      return message;
    },
    bookmarkMessage: async (root, { messageId }, { userId, userLoader }) => {
      const user = await userLoader.load(userId);

      const message = user.inbox.inbox.find(m => m._id.toString() === messageId)
        || user.inbox.sent.find(m => m._id.toString() === messageId);

      message.inBookmarks = !message.inBookmarks;
      message.inTrash = false;

      await user.save();
      return message;
    },
    moveMessageToTrash: async (root, { messageId }, { userId, userLoader }) => {
      const user = await userLoader.load(userId);

      const message = user.inbox.inbox.find(m => m._id.toString() === messageId)
        || user.inbox.sent.find(m => m._id.toString() === messageId);

      message.inTrash = !message.inTrash;
      message.inBookmarks = false;

      await user.save();
      return message;
    },
    deleteMessage: async (root, { messageId }, { userId, userLoader }) => {
      const user = await userLoader.load(userId);

      let message = user.inbox.inbox
        .splice(user.inbox.inbox
          .findIndex(m => m._id.toString() === messageId), 1);

      if (!message.length) {
        message = user.inbox.sent
          .splice(user.inbox.sent
            .findIndex(m => m._id.toString() === messageId), 1);
      }

      await user.save();
      return message[0]._id;
    },
  },
  Message: {
    from: ({ from }, args, { userLoader }) => userLoader.load(from.toString()),
    to: ({ to }, args, { userLoader }) => userLoader.load(to.toString()),
  },
};
