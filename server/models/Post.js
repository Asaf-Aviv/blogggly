const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new mongoose.Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true },
  body: { type: String, required: true },
  deleted: { type: Boolean, default: false },
  likeCount: {
    type: Number,
    default: 0,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
}, { timestamps: true });

PostSchema.statics.deletePost = async function (id) {
  return this.findByIdAndUpdate(
    id,
    { $set: { deleted: true } },
    { new: true },
  );
};

PostSchema.statics.findPostsForUser = async function (id) {
  const user = await User.findById(id).populate('posts');
  return user.posts;
};

PostSchema.statics.findPostsByIds = async function (postIds) {
  if (!postIds || !postIds.length) {
    return [];
  }

  return postIds.map(pId => this.find({ _id: { $in: pId } }));
};

PostSchema.statics.updatePost = async function (postId, updatedPost) {
  const post = await this.findPostById(postId);

  post.title = updatedPost.title;
  post.body = updatedPost.body;

  return post.save();
};

PostSchema.statics.findPostById = async function (postId) {
  const post = await this.findById(postId);

  if (!post) {
    throw new Error('Post not found.');
  }

  return post;
};

PostSchema.statics.toggleLike = async function (id, userId) {
  const [post, user] = await Promise.all([
    this.findPostById(id),
    User.findUserById(userId),
  ]);

  const alreadyLike = post.likes
    .some(postAuthorId => postAuthorId.toString() === userId);

  if (alreadyLike) {
    post.likes = post.likes
      .filter(postAuthorId => postAuthorId.toString() !== userId);

    post.likeCount -= 1;

    user.likes.posts = user.likes.posts
      .filter(postId => postId.toString() !== post._id.toString());
  } else {
    post.likes.push(userId);
    post.likeCount += 1;

    user.likes.posts.unshift(post._id);
  }

  await Promise.all([
    post.save(),
    user.save(),
  ]);

  return { likes: post.likes };
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
