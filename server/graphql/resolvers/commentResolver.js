const User = require('../../models/User');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

module.exports = {
  Query: {
    getCommentsByIds: async (root, { commentIds }, { commentLoader }) => (
      commentLoader.loadMany(commentIds)
    ),
    postComments: async (root, { postId }) => Comment.find({ post: postId }),
  },
  Mutation: {
    addComment: (root, { comment }, { userId }) => {
      if (!userId) throw new Error('Unauthorized, Please Login to comment.');
      return Comment.addComment({ ...comment, author: userId });
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
  Comment: {
    author: ({ author }, args, { userLoader }) => userLoader.load(author.toString()),
    post: ({ post }, args, { postLoader }) => postLoader.load(post.toString()),
  },
};
