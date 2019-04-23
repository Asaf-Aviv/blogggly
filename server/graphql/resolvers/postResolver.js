const User = require('../../models/User');
const Post = require('../../models/Post');

module.exports = {
  Query: {
    post: async (root, { postId }) => {
      const post = await Post.findPostById(postId);
      console.log(post);
      if (post.deleted) {
        throw new Error('This post has been deleted');
      }
      return post;
    },
    posts: async () => Post.find({ deleted: false }),
    postsByTag: async (root, { tag }) => Post.find({ tags: { $in: [tag] } }),
    userPosts: (root, { id }) => Post.findPostsForUser(id),
    getPostsByIds: async (root, { postIds }, { postLoader }) => (
      postLoader.loadMany(postIds)
    ),
    moreFromAuthor: (root, { authorId, viewingPostId }) => (
      User.moreFromAuthor(authorId, viewingPostId)
    ),
  },
  Mutation: {
    createPost: (root, { postInput }) => Post.createPost(postInput),
    updatePost: (root, { postId, updatedPost }) => Post.updatePost(postId, updatedPost),
    deletePost: async (root, { postId }, { userId }) => {
      const post = await Post.findById(postId);

      if (post.author.toString() !== userId) {
        throw new Error('Unauthorized');
      }

      return Post.deletePost(postId);
    },
  },
  Post: {
    author: ({ author }, args, { userLoader }) => userLoader.load(author.toString()),
    comments: ({ comments }, args, { commentLoader }) => commentLoader.loadMany(comments),
  },
};
