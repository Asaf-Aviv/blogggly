const { mergeTypes } = require('merge-graphql-schemas');
const general = require('./general');
const user = require('./user');
const post = require('./post');
const comment = require('./comment');
const message = require('./message');

const typeDefs = [
  general,
  user,
  post,
  comment,
  message,
];

module.exports = mergeTypes(typeDefs, { all: true });
