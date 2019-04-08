const User = require('../../models/User');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const { generateToken } = require('../../utils');

module.exports = {
  Query: {
    user: (root, { id }) => User.findUserById(id),
    getUsersByIds: async (root, { userIds }, { userLoader }) => {
      const users = await userLoader.loadMany(userIds);
      console.log(users);
      return users;
    },
    getPostsByIds: async (root, { postIds }, { postLoader }) => (
      postLoader.loadMany(postIds)
    ),
    getCommentsByIds: async (root, { commentIds }, { commentLoader }) => {
      const comments = await commentLoader.loadMany(commentIds);
      console.log(comments);
      return comments;
    },
    getUserByUsername: async (root, { username }) => User.findOne({ username }),
    users: async (root, args, { userLoader }) => {
      const users = await User.find({}, { inbox: 0 });
      users.map(user => userLoader.prime(user._id, user));
      return users;
    },
    userPosts: (root, { id }) => Post.findPostsForUser(id),
    post: (root, { postId }) => Post.findPostById(postId),
    posts: async () => Post.find({ deleted: false }),
    postsByTag: async (root, { tag }) => Post.find({ tags: { $in: [tag] } }),
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
    updateUserInfo: (root, { info }, { userId }) => {
      if (!userId) throw new Error('Unauthorized, Please Login to update your info.');
      return User.updateInfo(userId, info);
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
    bookmarkMessage: async (root, { messageId }, { userId }) => {
      const user = await User.findUserById(userId);

      const message = user.inbox.inbox.find(m => m._id.toString() === messageId)
        || user.inbox.sent.find(m => m._id.toString() === messageId);

      message.inBookmarks = !message.inBookmarks;
      message.inTrash = false;

      await user.save();
      return message;
    },
    moveMessageToTrash: async (root, { messageId }, { userId }) => {
      const user = await User.findUserById(userId);

      const message = user.inbox.inbox.find(m => m._id.toString() === messageId)
        || user.inbox.sent.find(m => m._id.toString() === messageId);

      message.inTrash = !message.inTrash;
      message.inBookmarks = false;

      await user.save();
      return message;
    },
    deleteMessage: async (root, { messageId }, { userId }) => {
      const user = await User.findUserById(userId);

      let message = user.inbox.inbox
        .splice(user.inbox.inbox
          .findIndex(m => m._id.toString() === messageId), 1);

      if (!message.length) {
        message = user.inbox.sent
          .splice(user.inbox.sent
            .findIndex(m => m._id.toString() === messageId), 1);
      }

      await user.save();
      return message[0]._id;
    },
    deleteComment: async (root, { commentId, postId }, { userId }) => {
      const [user, post, comment] = await Promise.all([
        User.findUserById(userId),
        Post.findPostById(postId),
        Comment.findCommentById(commentId),
      ]);

      user.comments = user.comments
        .filter(cId => cId.toString() !== commentId);

      post.comments = post.comments
        .filter(commentRefId => commentRefId.toString() !== commentId);

      post.commentsCount -= 1;

      console.log(comment);

      await Promise.all([
        comment.likes.map(async likeUserId => User.findByIdAndUpdate(
          likeUserId,
          { $pull: { 'likes.comments': commentId } },
        )),
        Comment.findByIdAndRemove(commentId),
        post.save(),
        user.save(),
      ]);

      return comment._id;
    },
    toggleFollow: (root, { userId: userIdToFollow }, { userId }) => {
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
    comments: ({ comments }, args, { commentLoader }) => commentLoader.loadMany(comments),
  },
  Message: {
    from: ({ from }, args, { userLoader }) => userLoader.load(from.toString()),
    to: ({ to }, args, { userLoader }) => userLoader.load(to.toString()),
  },
  Comment: {
    author: ({ author }, args, { userLoader }) => userLoader.load(author.toString()),
    post: ({ post }, args, { postLoader }) => postLoader.load(post.toString()),
  },
};
