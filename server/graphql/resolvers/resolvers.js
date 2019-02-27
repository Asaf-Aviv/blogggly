const User = require('../../models/User');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const { generateToken } = require('../../utils');

module.exports = {
  Query: {
    relog: async (root, args, { isAuth, userId }) => {
      console.log('relogging');

      if (!isAuth) {
        throw new Error('Unauthorized');
      }

      const user = await User.findUserById(userId);
      return { user };
    },
    user: (root, { id }) => User.findUserById(id),
    searchUser: async (root, { username }) => {
      const user = await User.findOne({ username });
      return { user };
    },
    users: async (root, args, { userLoader }) => {
      const users = await User.find({});
      users.map(user => userLoader.prime(user._id, user));
      return users;
    },
    userPosts: (root, { id }) => Post.findPostsForUser(id),
    post: (root, { postId }) => Post.findPostById(postId),
    posts: async () => Post.find({ deleted: false }),
    postComments: async (root, { postId }, { commentLoader }) => {
      const commentIds = await Comment.findCommentsForPost(postId);
      return commentLoader.load(commentIds);
    },
    moreFromAuthor: (root, { authorId, viewingPostId }) => (
      User.moreFromAuthor(authorId, viewingPostId)
    ),
    inbox: async (root, args, { userId }) => {
      if (!userId) throw new Error('Unauthorized');
      const { inbox } = await User.findUserById(userId, { inbox: 1 });
      return inbox;
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
    createPost: (root, { postInput }) => Post.createPost(postInput),
    updatePost: (root, { postId, updatedPost }) => Post.updatePost(postId, updatedPost),
    deletePost: (root, { id }) => Post.deletePost(id),
    createComment: (root, { comment }) => Comment.createComment(comment),
    toggleLike: (root, { isPost, id }, { userId }) => (isPost
      ? Post.toggleLike(id, userId)
      : Comment.toggleLike(id, userId)),
    sendMessage: async (root, { to, body }, { userId }) => {
      if (!userId) throw new Error('Unauthorized');
      const message = await User.sendMessage(userId, to, body);
      return message;
    },
  },
  User: {
    // posts: (root, args, { postLoader }) => postLoader.load(root.posts),
    // comments: (root, args, { commentLoader }) => commentLoader.load(root.comments),
  },
  Post: {
    author: ({ author }, args, { userLoader }) => userLoader.load(author),
    comments: ({ comments }, args, { commentLoader }) => commentLoader.load(comments),
  },
  Comment: {
    author: ({ author }, args, { userLoader }) => userLoader.load(author),
  },
};
