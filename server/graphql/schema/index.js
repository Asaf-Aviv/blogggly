const { mergeTypes } = require('merge-graphql-schemas');
const user = require('./userTypeDefs');
const post = require('./postTypeDefs');
const comment = require('./commentTypeDefs');
const message = require('./messageTypeDefs');
const report = require('./reportTypeDefs');

const typeDefs = [
  user,
  message,
  post,
  comment,
  report,
];

module.exports = mergeTypes(typeDefs, { all: true });
