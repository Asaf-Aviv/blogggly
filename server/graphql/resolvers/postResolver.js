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
      const { post, isLike } = await Post.toggleLike(postId, userId);

      pubsub.publish(
        POST_LIKES_UPDATES,
        { post, likerId: userId },
      );

      if (isLike) {
        const postAuthorId = post.author.toString();
        const notification = await User.addNotification(
          { from: userId, body: 'liked your post!' },
          postAuthorId,
        );
        pubsub.publish(
          THEY_LIKE_MY_POST,
          {
            toUserId: postAuthorId,
            theyLikeMyPost: {
              user: userId,
              notification,
            },
          },
        );
      }

      return post;
    },
    updatePost: (root, { postId, updatedPost }) => Post.updatePost(postId, updatedPost),
    deletePost: (root, { postId }, { userId }) => Post.deletePost(postId, userId),
  },
  Subscription: {
    theyLikeMyPost: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(THEY_LIKE_MY_POST),
        ({ toUserId, theyLikeMyPost }, variables, { currentUserId }) => (
          toUserId === currentUserId
            && theyLikeMyPost.user !== currentUserId
        ),
      ),
    },
    postLikesUpdates: {
      subscribe: withFilter(
        (root, args, { pubsub }) => pubsub.asyncIterator(POST_LIKES_UPDATES),
        ({ post, likerId }, { postId }, { currentUserId }) => (
          post._id.toString() === postId
            && likerId !== currentUserId
        ),
      ),
      resolve: ({ post }) => post,
    },
  },
  Post: {
    author: ({ author }, args, { userLoader }) => userLoader.load(author.toString()),
  },
  TheyLikeMyPost: {
    user: ({ user }, args, { userLoader }) => userLoader.load(user),
  },
};
