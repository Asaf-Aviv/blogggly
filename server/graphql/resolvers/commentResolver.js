const { withFilter } = require('graphql-subscriptions');
const Comment = require('../../models/Comment');
const tags = require('../tags');

module.exports = {
  Query: {
    getCommentsByIds: async (root, { commentIds }, { commentLoader }) => (
      commentLoader.loadMany(commentIds)
    ),
    postComments: async (root, { postId }) => Comment.find({ post: postId }),
  },
  Mutation: {
    newComment: async (root, { postId, body }, { userId, pubsub }) => {
      if (!userId) throw new Error('Unauthorized');

      const { newComment, commentAuthor, postAuthorId } = await Comment.newComment(
        { post: postId, body, author: userId },
      );

      pubsub.publish(tags.NEW_POST_COMMENT, { newPostComment: newComment });
      pubsub.publish(tags.THEY_COMMENT_ON_MY_POST, { toUserId: postAuthorId, commentAuthor });

      return newComment;
    },
    toggleLikeOnComment: async (root, { commentId }, { userId, pubsub }) => {
      const { user, comment, isLike } = await Comment.toggleLike(commentId, userId);

      pubsub.publish(tags.COMMENT_LIKES_UPDATES, {
        comment,
        likerId: userId,
      });

      if (isLike) {
        pubsub.publish(
          tags.THEY_LIKE_MY_COMMENT,
          { toUserId: comment.author._id.toString(), user },
        );
      }

      return comment;
    },
    deleteComment: async (root, { commentId, postId }, { userId, pubsub }) => {
      const deletedCommentId = await Comment.deleteComment(commentId, postId, userId);

      pubsub.publish(
        tags.DELETED_POST_COMMENT,
        { commentId, commentPostId: postId },
      );

      return deletedCommentId;
    },
  },
  Subscription: {
    newPostComment: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(tags.NEW_POST_COMMENT),
        ({ newPostComment }, variables, { currentUserId }) => (
          newPostComment.author._id.toString() !== currentUserId
        ),
      ),
      resolve: ({ newPostComment }) => newPostComment,
    },
    commentLikesUpdates: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(tags.COMMENT_LIKES_UPDATES),
        ({ comment, likerId }, { postId }, { currentUserId }) => (
          comment.post.toString() === postId
            && likerId !== currentUserId
        ),
      ),
      resolve: ({ comment }) => comment,
    },
    deletedPostComment: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(tags.DELETED_POST_COMMENT),
        ({ commentPostId }, { postId }) => commentPostId === postId,
      ),
      resolve: ({ commentId }) => commentId,
    },
    theyCommentOnMyPost: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(tags.THEY_COMMENT_ON_MY_POST),
        ({ toUserId }, variables, { currentUserId }) => toUserId === currentUserId,
      ),
      resolve: ({ commentAuthor }) => commentAuthor,
    },
    theyLikeMyComment: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(tags.THEY_LIKE_MY_COMMENT),
        ({ toUserId, user }, variables, { currentUserId }) => (
          toUserId === currentUserId
            && user._id.toString() !== currentUserId
        ),
      ),
      resolve: ({ user }) => user,
    },
  },
  Comment: {
    author: ({ author }, args, { userLoader }) => {
      console.log(author);
      return userLoader.load(author.toString());
    },
    post: ({ post }, args, { postLoader }) => postLoader.load(post.toString()),
  },
};
