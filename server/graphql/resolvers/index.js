
const User = require('../../models/User');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const { generateToken } = require('../../utils');

module.exports = {
  Query: {
    user: (root, args) => User.findUserById(args.id),
    users: async (root, args, { userLoader }) => {
      const users = await User.find({});
      users.map(user => userLoader.prime(user._id, user));
      return users;
    },
    post: (root, args) => Post.findPostById(args.id),
    posts: async () => Post.find({ deleted: false }),
    postComments: (root, args) => Comment.findCommentsForPost(args.postId),
  },
  Mutation: {
    login: async (root, args) => {
      const user = await User.login(args.user);
      const token = generateToken(user._id);
      return { token };
    },
    createUser: (root, args) => User.createUser(args.user),
    createPost: (root, args) => Post.createPost(args.post),
    updatePost: (root, args) => Post.updatePost(args.postId, args.updatedPost),
    deletePost: (root, args) => Post.deletePost(args.id),
    createComment: (root, args) => Comment.createComment(args.comment),
  },
  User: {
    posts: (root, args, { postLoader }) => postLoader.load(root.posts),
    comments: (root, args, { commentLoader }) => commentLoader.load(root.comments),
  },
  Post: {
    author: (root, args, { userLoader }) => userLoader.load(root.author),
    comments: (root, args, { commentLoader }) => commentLoader.load(root.comments),
  },
  Comment: {
    author: (root, args, { userLoader }) => userLoader.load(root.author),
  },
};
