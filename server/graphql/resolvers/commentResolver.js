const { withFilter } = require('graphql-subscriptions');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const { NEW_POST_COMMENT, COMMENT_LIKES_UPDATES, THEY_LIKE_MY_COMMENT } = require('../tags');

module.exports = {
  Query: {
    getCommentsByIds: async (root, { commentIds }, { commentLoader }) => (
      commentLoader.loadMany(commentIds)
    ),
    postComments: async (root, { postId }) => Comment.find({ post: postId }),
  },
  Mutation: {
    addComment: async (root, { comment }, { userId, pubsub }) => {
      if (!userId) throw new Error('Unauthorized, Please Login to comment.');

      const newPostComment = await Comment.addComment({ ...comment, author: userId });
      pubsub.publish(NEW_POST_COMMENT, { newPostComment });
      return newPostComment;
    },
    toggleLikeOnComment: async (root, { commentId }, { userId, pubsub }) => {
      const { user, comment, isLike } = await Comment.toggleLike(commentId, userId);

      pubsub.publish(COMMENT_LIKES_UPDATES, {
        comment,
        likerId: userId,
      });

      if (isLike) {
        pubsub.publish(
          THEY_LIKE_MY_COMMENT,
          { toUserId: comment.author._id.toString(), user },
        );
      }

      return comment;
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

      await Promise.all([
        user.save(),
        post.save(),
        Comment.findByIdAndRemove(commentId),
        ...comment.likes.map(likeUserId => User.findByIdAndUpdate(
          likeUserId,
          { $pull: { 'likes.comments': commentId } },
        )),
      ]);

      return comment._id;
    },
  },
  Subscription: {
    newPostComment: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(NEW_POST_COMMENT),
        ({ newPostComment }, variables, { currentUserId }) => (
          newPostComment.author._id.toString() !== currentUserId
        ),
      ),
      resolve: ({ newPostComment }) => newPostComment,
    },
    commentLikesUpdates: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(COMMENT_LIKES_UPDATES),
        ({ comment, likerId }, { postId }, { currentUserId }) => (
          comment.post.toString() === postId
            && likerId !== currentUserId
        ),
      ),
      resolve: ({ comment }) => comment,
    },
    theyLikeMyComment: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(THEY_LIKE_MY_COMMENT),
        ({ toUserId, user }, variables, { currentUserId }) => (
          toUserId === currentUserId
            && user._id.toString() !== currentUserId
        ),
      ),
      resolve: ({ user }) => user,
    },
  },
  Comment: {
    author: ({ author }, args, { userLoader }) => userLoader.load(author.toString()),
    post: ({ post }, args, { postLoader }) => postLoader.load(post.toString()),
  },
};
