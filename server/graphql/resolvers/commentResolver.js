const { withFilter } = require('graphql-subscriptions');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const { NEW_POST_COMMENT, COMMENT_LIKES_UPDATES } = require('../tags');

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
      const { comment, isLike } = await Comment.toggleLike(commentId, userId);
      pubsub.publish(COMMENT_LIKES_UPDATES, {
        commentLikesUpdates: {
          userId,
          isLike,
          commentId,
          postId: comment.post.toString(),
        },
      });
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
        ({ newPostComment }, args, { currentUserId }) => {
          console.log(currentUserId);

          return newPostComment.author._id.toString() !== currentUserId;
        },
      ),
      resolve: ({ newPostComment }) => newPostComment,
    },
    commentLikesUpdates: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(COMMENT_LIKES_UPDATES),
        ({ commentLikesUpdates }, { postId }, { currentUserId }) => {
          console.log(commentLikesUpdates);
          console.log(currentUserId);
          return commentLikesUpdates.postId === postId
            && commentLikesUpdates.userId !== currentUserId;
        },
      ),
    },
  },
  Comment: {
    author: ({ author }, args, { userLoader }) => userLoader.load(author.toString()),
    post: ({ post }, args, { postLoader }) => postLoader.load(post.toString()),
  },
};
