const User = require('../../models/User');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const { generateToken } = require('../../utils');

module.exports = {
  Query: {
    relog: async (root, args, { isAuth, userId }) => {
      console.log('relogging', isAuth);

      if (!isAuth) {
        throw new Error('Unauthorized');
      }

      const user = await User.findById(userId);
      return { user };
    },
    user: (root, args) => User.findUserById(args.id),
    searchUser: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      return { user };
    },
    users: async (root, args, { userLoader }) => {
      const users = await User.find({});
      users.map(user => userLoader.prime(user._id, user));
      return users;
    },
    userPosts: (root, args) => Post.findPostsForUser(args.id),
    post: (root, args) => Post.findPostById(args.postId),
    posts: async () => Post.find({ deleted: false }),
    postComments: async (root, args, { commentLoader }) => {
      const commentIds = await Comment.findCommentsForPost(args.postId);
      return commentLoader.load(commentIds);
    },
  },
  Mutation: {
    login: async (root, { email, password }) => {
      const user = await User.login(email, password);
      const token = generateToken(user._id);
      return { user, token };
    },
    signup: async (root, { userInput }) => {
      const user = await User.createUser(userInput);
      const token = generateToken(user._id);
      return { user, token };
    },
    createPost: (root, args) => Post.createPost(args.postInput),
    updatePost: (root, args) => Post.updatePost(args.postId, args.updatedPost),
    deletePost: (root, args) => Post.deletePost(args.id),
    createComment: (root, args) => Comment.createComment(args.comment),
    toggleLike: (root, args) => Post.toggleLike(args.postId, args.userId),
  },
  User: {
    // posts: (root, args, { postLoader }) => postLoader.load(root.posts),
    // comments: (root, args, { commentLoader }) => commentLoader.load(root.comments),
  },
  Post: {
    author: (root, args, { userLoader }) => userLoader.load(root.author),
    comments: (root, args, { commentLoader }) => commentLoader.load(root.comments),
  },
  Comment: {
    author: (root, args, { userLoader }) => userLoader.load(root.author),
  },
};
