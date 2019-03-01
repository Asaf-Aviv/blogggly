const User = require('../../models/User');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const { generateToken } = require('../../utils');

module.exports = {
  Query: {
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
      return commentLoader.load(commentIds.map(String));
    },
    moreFromAuthor: (root, { authorId, viewingPostId }) => (
      User.moreFromAuthor(authorId, viewingPostId)
    ),
    inbox: async (root, args, { userId }) => {
      if (!userId) throw new Error('Unauthorized,');
      const { inbox } = await User.findUserById(userId, { inbox: 1 });
      return inbox;
    },
  },
  Mutation: {
    relog: async (root, args, { userId }) => {
      console.log('relogging');
      if (!userId) throw new Error('Unauthorized');

      const currentUser = await User.findUserById(userId);
      return currentUser;
    },
    login: async (root, { email, password }) => {
      const currentUser = await User.login(email, password);
      const token = generateToken(currentUser._id);
      return { ...currentUser._doc, token };
    },
    signup: async (root, { userInput }) => {
      const currentUser = await User.createUser(userInput);
      const token = generateToken(currentUser._id);
      return { ...currentUser._doc, token };
    },
    createPost: (root, { postInput }) => Post.createPost(postInput),
    updatePost: (root, { postId, updatedPost }) => Post.updatePost(postId, updatedPost),
    deletePost: (root, { id }) => Post.deletePost(id),
    addComment: (root, { comment }, { userId }) => {
      if (!userId) throw new Error('Unauthorized, Please Login to comment.');
      return Comment.addComment({ author: userId, ...comment });
    },
    toggleLike: (root, { isPost, id }, { userId }) => {
      if (!userId) throw new Error(`Unauthorized, Please Login to like this ${isPost ? 'post' : 'comment'}.`);
      return isPost ? Post.toggleLike(id, userId) : Comment.toggleLike(id, userId);
    },
    sendMessage: async (root, { to, body }, { userId }) => {
      if (!userId) throw new Error('Unauthorized, Please Login to send a message.');
      const message = await User.sendMessage(userId, to, body);
      return message;
    },
    toggleFollow: (root, { userIdToFollow }, { userId }) => {
      if (!userId) throw new Error('Unauthorized, Please Login to follow this author.');
      return User.toggleFollow(userId, userIdToFollow);
    },
  },
  ToggleLikeResult: {
    __resolveType({ post: parentPost }) {
      return parentPost ? 'Comment' : 'Post';
    },
  },
  Post: {
    author: ({ author }, args, { userLoader }) => userLoader.load(author.toString()),
    comments: ({ comments }, args, { commentLoader }) => commentLoader.load(comments),
  },
  Comment: {
    author: ({ author }, args, { userLoader }) => userLoader.load(author.toString()),
  },
};
