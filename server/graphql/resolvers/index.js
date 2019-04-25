const { mergeResolvers } = require('merge-graphql-schemas');
const generalResolver = require('./generalResolver');
const userResolver = require('./userResolver');
const postResolver = require('./postResolver');
const commentResolver = require('./commentResolver');
const messageResolver = require('./messageResolver');
const reportResolver = require('./reportResolver');

const resolvers = [
  userResolver,
  generalResolver,
  postResolver,
  commentResolver,
  messageResolver,
  reportResolver,
];

module.exports = mergeResolvers(resolvers);
