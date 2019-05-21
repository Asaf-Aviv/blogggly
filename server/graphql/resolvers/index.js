const { mergeResolvers } = require('merge-graphql-schemas');
const userResolver = require('./userResolver');
const postResolver = require('./postResolver');
const commentResolver = require('./commentResolver');
const messageResolver = require('./messageResolver');
const reportResolver = require('./reportResolver');

const resolvers = [
  userResolver,
  messageResolver,
  postResolver,
  commentResolver,
  reportResolver,
];

module.exports = mergeResolvers(resolvers);
