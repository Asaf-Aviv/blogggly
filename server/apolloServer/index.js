const jwt = require('jsonwebtoken');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../graphql/schema');
const resolvers = require('../graphql/resolvers');
const { createLoaders } = require('../utils');
const pubsub = require('../graphql/pubsub');

module.exports = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: (connectionParams) => {
      console.log('*'.repeat(20));
      console.log(connectionParams);
      console.log('*'.repeat(20));
      console.log('websocket connected');
      console.log('*'.repeat(20));

      let currentUserId = null;

      if (connectionParams.Authorization) {
        try {
          const token = connectionParams.Authorization.replace('Bearer ', '');
          const { userId } = jwt.verify(token, process.env.JWT_SECRET);
          currentUserId = userId;
        // eslint-disable-next-line no-empty
        } catch (e) {}
      }

      return {
        currentUserId,
      };
    },
  },
  context: ({ req, connection }) => {
    if (connection) {
      console.log('context', connection.context);
      return {
        ...connection.context,
        ...createLoaders(),
        pubsub,
      };
    }

    return {
      ...createLoaders(),
      pubsub,
      userId: req.userId,
    };
  },
});
