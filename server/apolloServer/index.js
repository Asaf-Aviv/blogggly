const jwt = require('jsonwebtoken');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../graphql/schema');
const resolvers = require('../graphql/resolvers');
const { createLoaders } = require('../utils');
const pubsub = require('../graphql/pubsub');
const redisClient = require('../redisClient');

module.exports = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: (connectionParams) => {
      let currentUserId = null;

      if (connectionParams.Authorization) {
        try {
          const token = connectionParams.Authorization.replace('Bearer ', '');
          const { userId } = jwt.verify(token, process.env.JWT_SECRET);
          currentUserId = userId;
          redisClient.hset('connectedUsers', currentUserId, '');
        // eslint-disable-next-line no-empty
        } catch (e) {}
      }

      return {
        currentUserId,
      };
    },
    onDisconnect: async (webSocket, context) => {
      const { currentUserId } = await context.initPromise;
      if (currentUserId) {
        redisClient.hdel('connectedUsers', currentUserId);
      }
    },
  },
  context: ({ req, connection }) => {
    if (connection) {
      return {
        ...connection.context,
        ...createLoaders(),
        pubsub,
      };
    }

    return {
      ...createLoaders(),
      pubsub,
      redisClient,
      userId: req.userId,
    };
  },
});
