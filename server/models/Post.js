const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: {
    type: Array,
    required: true,
    validate: {
      validator(array) {
        return (array.length && array.length <= 5) && array.every(v => typeof (v) === 'string');
      },
    },
  },
  title: { type: String, required: true },
  body: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
}, { timestamps: true });

PostSchema.statics.deletePost = async function (postId, userId) {
  const post = await this.findById(postId);

  if (post.author.toString() !== userId) {
    console.log('not post author');
    throw new Error('Unauthorized');
  }

  const commentIds = post.comments;

  try {
    await Promise.all([
      this.findByIdAndDelete(postId),
      User.updateOne(
        { _id: post.author },
        { $pull: { posts: postId } },
      ),
      User.updateMany(
        { _id: { $in: post.likes } },
        { $pull: { 'likes.posts': postId } },
      ),
      ...commentIds.map(async (commentId) => {
        const comment = await Comment.findById(commentId);
        return Promise.all([
          Comment.findByIdAndDelete(commentId),
          User.updateOne(
            { _id: comment.author },
            { $pull: { comments: commentId } },
          ),
          User.updateMany(
            { _id: { $in: comment.likes } },
            { $pull: { 'likes.comments': commentId } },
          ),
        ]);
      }),
    ]);
  } catch (e) {
    console.error(e);
    throw new Error('Something went wrong');
  }

  return postId;
};

PostSchema.statics.findPostsByIds = async function (postIds) {
  if (!postIds || !postIds.length) {
    return [];
  }

  return this.find({ _id: { $in: postIds } });
};

PostSchema.statics.updatePost = async function (postId, updatedPost) {
  const post = await this.findPostById(postId);

  post.title = updatedPost.title;
  post.body = updatedPost.body;

  return post.save();
};

PostSchema.statics.findPostById = async function (postId, options = {}) {
  const post = await this.findById(postId, options);

  if (!post) {
    throw new Error('Post not found.');
  }

  return post;
};

PostSchema.statics.getFeaturedPosts = function () {
  return this.find({}).sort({ likesCount: -1, commentsCount: -1 });
};

PostSchema.statics.toggleLike = async function (postId, userId) {
  const [post, user] = await Promise.all([
    this.findPostById(postId),
    User.findUserById(userId),
  ]);

  const alreadyLike = post.likes
    .some(postAuthorId => postAuthorId.toString() === userId);

  if (alreadyLike) {
    post.likes = post.likes
      .filter(postAuthorId => postAuthorId.toString() !== userId);

    post.likesCount -= 1;

    user.likes.posts = user.likes.posts
      .filter(pId => pId.toString() !== postId);
  } else {
    post.likes.push(userId);
    post.likesCount += 1;
    user.likes.posts.unshift(postId);
  }

  await Promise.all([
    post.save(),
    user.save(),
  ]);

  return { post, isLike: !alreadyLike };
};

PostSchema.statics.createPost = async function (postInput) {
  const post = new this(postInput);

  const user = await User.findUserById(post.author);

  if (!user) {
    throw new Error('User not found.');
  }

  await post.save();
  user.posts.unshift(post._id);
  await user.save();

  return post;
};

module.exports = mongoose.model('Post', PostSchema);

// prevent circular dependencies by requiring after export
const User = require('./User');
const Comment = require('./Comment');
