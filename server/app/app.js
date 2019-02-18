const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const isAuth = require('../middleware/isAuth');
const typeDefs = require('../graphql/schema');
const resolvers = require('../graphql/resolvers');
const { createLoaders } = require('../utils');

const productionMode = process.env.NODE_ENV === 'production';

const app = express();

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(isAuth);

app.use((req, res, next) => {
  console.log('isAuth', req.isAuth);
  next();
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    ...createLoaders(),
    isAuth: req.isAuth,
    userId: req.userId,
  }),
});

apolloServer.applyMiddleware({ app });

app.get('/*', (req, res) => {
  res.sendFile(
    path.join(
      __dirname, `../../client/${productionMode ? 'dist' : 'public'}`, 'index.html',
    ),
  );
});

module.exports = app;
