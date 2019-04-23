const User = require('../../models/User');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

module.exports = {
  Query: {
    getCommentsByIds: async (root, { commentIds }, { commentLoader }) => {
      const comments = await commentLoader.loadMany(commentIds);
      console.log(comments);
      return comments;
    },
    postComments: async (root, { postId }, { commentLoader }) => {
      const commentIds = await Comment.findCommentsForPost(postId);
      return commentLoader.load(commentIds.map(String));
    },
  },
  Mutation: {
    addComment: (root, { comment }, { userId }) => {
      if (!userId) throw new Error('Unauthorized, Please Login to comment.');
      return Comment.addComment({ author: userId, ...comment });
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
  },
  Comment: {
    author: ({ author }, args, { userLoader }) => userLoader.load(author.toString()),
    post: ({ post }, args, { postLoader }) => postLoader.load(post.toString()),
  },
};
