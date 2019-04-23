const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

module.exports = {
  Mutation: {
    toggleLike: (root, { isPost, id }, { userId }) => {
      if (!userId) throw new Error(`Unauthorized, Please Login to like this ${isPost ? 'post' : 'comment'}.`);
      return isPost ? Post.toggleLike(id, userId) : Comment.toggleLike(id, userId);
    },
  },
  ToggleLikeResult: {
    __resolveType({ post: parentPost }) {
      return parentPost ? 'Comment' : 'Post';
    },
  },
};
