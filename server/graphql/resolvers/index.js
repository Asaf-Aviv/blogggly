const { mergeResolvers } = require('merge-graphql-schemas');
const generalResolver = require('./generalResolver');
const userResolver = require('./userResolver');
const postResolver = require('./postResolver');
const commentResolver = require('./commentResolver');
const messageResolver = require('./messageResolver');

const resolvers = [
  userResolver,
  generalResolver,
  postResolver,
  commentResolver,
  messageResolver,
];

module.exports = mergeResolvers(resolvers);
