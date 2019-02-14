const express = require('express');
const path = require('path');
const passport = require('passport');
const { ApolloServer, gql } = require('apollo-server-express');
const User = require('../models/User');
const Post = require('../models/Post');

const productionMode = process.env.NODE_ENV === 'production';

const app = express();

app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    login(user: UserInput!): User
    createUser(user: UserInput!): User
    createPost(post: PostInput!): Post
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    password: String
    posts: [Post!]!
  }

  type Post {
    _id: ID!
    author: User!
    title: String!
    body: String!
    createdAt: String!
    updatedAt: String!
  }

  input PostInput {
    author: ID!
    title: String!
    body: String!
  }

  input UserInput {
    email: String!
    password: String!
    username: String
  }
`;

const resolvers = {
  Query: {
    user: (parent, args) => User.findById(args.id),
    users: () => User.find(),
    post: async (parent, args) => Post.findById(args.id).populate('author'),
    posts: () => Post.find(),
  },
  Mutation: {
    login: (parent, args) => User.login(args.user),
    createUser: (parent, args) => User.createUser(args.user),
    createPost: (parent, args) => Post.createPost(args.post),
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

apolloServer.applyMiddleware({ app });

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, `../../client/${productionMode ? 'dist' : 'public'}`, 'index.html'));
});

module.exports = app;
