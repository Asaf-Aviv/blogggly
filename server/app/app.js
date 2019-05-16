
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { createServer } = require('http');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const isAuth = require('../middleware/isAuth');
const typeDefs = require('../graphql/schema');
const resolvers = require('../graphql/resolvers');
const { createLoaders } = require('../utils');

const app = express();
const httpServer = createServer(app);

const devMode = process.env.NODE_ENV !== 'production';
const PORT = process.env.NODE_ENV || 5000;

if (devMode) {
  mongoose.set('debug', true);
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(isAuth);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: (connectionParams, webSocket) => {
      console.log('*'.repeat(20));
      console.log(connectionParams);
      console.log('*'.repeat(20));
      console.log(webSocket);
      console.log('*'.repeat(20));
      console.log('websocket connected');
      console.log('*'.repeat(20));
    },
  },
  context: ({ req, connection }) => {
    if (connection) {
      console.log(connection.context);
      return connection.context;
    }

    return {
      ...createLoaders(),
      isAuth: req.isAuth,
      userId: req.userId,
    };
  },
});

apolloServer.applyMiddleware({ app });
apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀  Apollo Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  console.log(`🚀  Apollo Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`);
});

app.get('/*', (req, res) => {
  res.sendFile(
    path.join(
      __dirname, `../../client/${devMode ? 'public' : 'dist'}`, 'index.html',
    ),
  );
});

module.exports = app;
