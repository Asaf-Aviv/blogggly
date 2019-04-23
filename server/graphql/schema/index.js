const { mergeTypes } = require('merge-graphql-schemas');
const general = require('./generalTypeDefs');
const user = require('./userTypeDefs');
const post = require('./postTypeDefs');
const comment = require('./commentTypeDefs');
const message = require('./messageTypeDefs');

const typeDefs = [
  general,
  user,
  post,
  comment,
  message,
];

module.exports = mergeTypes(typeDefs, { all: true });
