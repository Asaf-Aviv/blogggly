const { withFilter } = require('graphql-subscriptions');
const User = require('../../models/User');
const Post = require('../../models/Post');
const { POST_LIKES_UPDATES, THEY_LIKE_MY_POST } = require('../tags');

module.exports = {
  Query: {
    post: async (root, { postId }, { postLoader }) => (
      postLoader.load(postId)
    ),
    postsByTag: async (root, { tag }) => Post.find({ tags: { $in: [tag] } }),
    userPosts: (root, { id }) => Post.findPostsForUser(id),
    getPostsByIds: (root, { postIds }, { postLoader }) => (
      postLoader.loadMany(postIds)
    ),
    moreFromAuthor: (root, { authorId, viewingPostId }) => (
      User.moreFromAuthor(authorId, viewingPostId)
    ),
    searchPosts: async (root, { postQuery }) => (
      Post.find({ title: new RegExp(postQuery, 'i') })
    ),
  },
  Mutation: {
    createPost: (root, { postInput }, { userId }) => {
      if (!userId) throw new Error('Unauthorized, Please Login to publish a post.');
      return Post.createPost({ author: userId, ...postInput });
    },
    toggleLikeOnPost: async (root, { postId }, { userId, pubsub }) => {
      const { post, isLike, user } = await Post.toggleLike(postId, userId);

      pubsub.publish(
        POST_LIKES_UPDATES,
        { postLikesUpdates: { userId, isLike, postId } },
      );

      if (isLike) {
        pubsub.publish(
          THEY_LIKE_MY_POST,
          { toUserId: post.author._id.toString(), user },
        );
      }

      return post;
    },
    updatePost: (root, { postId, updatedPost }) => Post.updatePost(postId, updatedPost),
    deletePost: async (root, { postId }, { userId }) => {
      const post = await Post.findById(postId);

      if (post.author.toString() !== userId) {
        throw new Error('Unauthorized');
      }

      return Post.deletePost(postId);
    },
  },
  Subscription: {
    theyLikeMyPost: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(THEY_LIKE_MY_POST),
        ({ user, toUserId }, variables, { currentUserId }) => (
          toUserId === currentUserId
            && user._id.toString() !== currentUserId
        ),
      ),
      resolve: ({ user }) => user,
    },
    postLikesUpdates: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(POST_LIKES_UPDATES),
        ({ postLikesUpdates }, { postId }, { currentUserId }) => (
          postLikesUpdates.postId === postId
            && postLikesUpdates.userId !== currentUserId
        ),
      ),
    },
  },
  Post: {
    author: ({ author }, args, { userLoader }) => userLoader.load(author.toString()),
  },
};
