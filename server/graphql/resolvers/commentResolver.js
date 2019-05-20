const { withFilter } = require('graphql-subscriptions');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const { NEW_POST_COMMENT } = require('../tags');

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
        (_, __, { pubsub }) => pubsub.asyncIterator(NEW_POST_COMMENT),
        ({ newPostComment }, { currentUserId }) => (
          newPostComment.author._id.toString() !== currentUserId
        ),
      ),
      resolve: ({ newPostComment }) => newPostComment,
    },
  },
  Comment: {
    author: ({ author }, args, { userLoader }) => userLoader.load(author.toString()),
    post: ({ post }, args, { postLoader }) => postLoader.load(post.toString()),
  },
};
