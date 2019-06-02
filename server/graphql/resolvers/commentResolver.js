const { withFilter } = require('graphql-subscriptions');
const Comment = require('../../models/Comment');
const Post = require('../../models/Post');
const User = require('../../models/User');
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

      const { author } = await Post.findPostById(postId, { author: 1 });

      const [newComment, notification] = await Promise.all([
        Comment.newComment({ post: postId, body, author: userId }),
        User.addNotification({ from: userId, body: 'commented on your post!' }, author),
      ]);

      pubsub.publish(tags.NEW_POST_COMMENT, { newPostComment: newComment });
      pubsub.publish(tags.THEY_COMMENT_ON_MY_POST, {
        toUserId: author.toString(),
        theyCommentOnMyPost: {
          commentAuthor: userId,
          notification,
        },
      });

      return newComment;
    },
    toggleLikeOnComment: async (root, { commentId }, { userId, pubsub }) => {
      if (!userId) throw new Error('Unauthorized');

      const { comment, isLike } = await Comment.toggleLike(commentId, userId);

      pubsub.publish(tags.COMMENT_LIKES_UPDATES, {
        comment,
        likerId: userId,
      });

      if (isLike) {
        const commentAuthorId = comment.author._id.toString();
        const notification = await User.addNotification(
          { from: userId, body: 'liked your comment!' },
          commentAuthorId,
        );

        pubsub.publish(
          tags.THEY_LIKE_MY_COMMENT,
          {
            toUserId: commentAuthorId,
            theyLikeMyComment: {
              user: userId,
              notification,
            },
          },
        );
      }

      return comment;
    },
    deleteComment: async (root, { commentId, postId }, { userId, pubsub }) => {
      if (!userId) throw new Error('Unauthorized');

      await Comment.deleteComment(commentId, postId, userId);

      pubsub.publish(
        tags.DELETED_POST_COMMENT,
        { commentId, commentPostId: postId },
      );

      return commentId;
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
        ({ toUserId, theyCommentOnMyPost }, variables, { currentUserId }) => (
          toUserId === currentUserId
            && theyCommentOnMyPost.commentAuthor !== currentUserId
        ),
      ),
    },
    theyLikeMyComment: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(tags.THEY_LIKE_MY_COMMENT),
        ({ toUserId, theyLikeMyComment }, variables, { currentUserId }) => (
          toUserId === currentUserId
            && theyLikeMyComment.user !== currentUserId
        ),
      ),
    },
  },
  Comment: {
    author: ({ author }, args, { userLoader }) => userLoader.load(author.toString()),
    post: ({ post }, args, { postLoader }) => postLoader.load(post.toString()),
  },
  TheyCommentOnMyPost: {
    commentAuthor: ({ commentAuthor }, args, { userLoader }) => (
      userLoader.load(commentAuthor.toString())
    ),
  },
  TheyLikeMyComment: {
    user: ({ user }, args, { userLoader }) => (
      userLoader.load(user.toString())
    ),
  },
};
