const { withFilter } = require('graphql-subscriptions');
const User = require('../../models/User');
const tags = require('../tags');

module.exports = {
  Mutation: {
    sendMessage: async (root, { to, body }, { userId, pubsub }) => {
      if (!userId) throw new Error('Unauthorized.');
      const newMessage = await User.sendMessage(userId, to, body);

      pubsub.publish(
        tags.NEW_MESSAGE,
        { newMessage },
      );

      return newMessage;
    },
    bookmarkMessage: async (root, { messageId, inInbox }, { userId }) => {
      if (!userId) throw new Error('Unauthorized.');
      return User.bookmarkMessage(messageId, inInbox, userId);
    },
    moveMessageToTrash: (root, { messageId, inInbox }, { userId }) => {
      if (!userId) throw new Error('Unauthorized.');
      return User.moveMessageToTrash(messageId, inInbox, userId);
    },
    deleteMessage: (root, { messageId, inInbox }, { userId }) => {
      if (!userId) throw new Error('Unauthorized.');
      return User.deleteMessage(messageId, inInbox, userId);
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(tags.NEW_MESSAGE),
        ({ newMessage }, variables, { currentUserId }) => (
          newMessage.to._id.toString() === currentUserId
        ),
      ),
    },
  },
  Message: {
    from: ({ from }, args, { userLoader }) => userLoader.load(from.toString()),
    to: ({ to }, args, { userLoader }) => userLoader.load(to.toString()),
  },
};
