const User = require('../../models/User');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const { generateToken } = require('../../utils');

module.exports = {
  Query: {
    user: (parent, args) => User.findUserById(args.id),
    users: async () => User.find(),
    post: (parent, args) => Post.findPostById(args.id),
    posts: async () => Post.find({ deleted: false }),
    postComments: (parent, args) => Comment.findCommentsForPost(args.postId),
  },
  Mutation: {
    login: async (parent, args) => {
      const user = await User.login(args.user);
      const token = generateToken(user._id);

      if (!token) {
        throw new Error('Unauthorized');
      }

      return { token };
    },
    createUser: (parent, args) => User.createUser(args.user),
    createPost: (parent, args) => Post.createPost(args.post),
    updatePost: (parent, args) => Post.updatePost(args.postId, args.updatedPost),
    deletePost: (parent, args) => Post.deletePost(args.id),
    createComment: (parent, args) => Comment.createComment(args.comment),
  },
  Post: {
    author: async parent => User.findById(parent.author),
  },
};
