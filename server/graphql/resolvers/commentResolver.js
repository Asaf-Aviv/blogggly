const { withFilter } = require('graphql-subscriptions');
const User = require('../../models/User');
const Post = require('../../models/Post');
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
      if (!userId) throw new Error('Unauthorized, Please Login to comment.');

      const newPostComment = await Comment.newComment(
        { post: postId, body, author: userId },
      );
      pubsub.publish(tags.NEW_POST_COMMENT, { newPostComment });
      return newPostComment;
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
      const comment = await Comment.findCommentById(commentId);

      if (comment.author.toString() !== userId) {
        throw new Error('Unauthorized');
      }

      const [user, post] = await Promise.all([
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

      pubsub.publish(
        tags.DELETED_POST_COMMENT,
        { commentId, commentPostId: postId, deletedCommentAuthorId: userId },
      );

      return comment._id;
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
        ({ commentPostId, deletedCommentAuthorId }, { postId }, { currentUserId }) => (
          commentPostId === postId
            && deletedCommentAuthorId.toString() !== currentUserId
        ),
      ),
      resolve: ({ commentId }) => commentId,
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
