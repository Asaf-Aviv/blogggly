const mongoose = require('mongoose');
const conn = require('../db/');
const User = require('./User');

const { Schema } = mongoose;

const PostSchema = new mongoose.Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  deleted: { type: Boolean, default: false },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', required: true }],
}, { timestamps: true });

PostSchema.statics.deletePost = async function (id) {
  return this.findByIdAndUpdate(
    id,
    { $set: { deleted: true } },
    { new: true },
  );
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

PostSchema.statics.createPost = async function (postInput) {
  const session = await conn.startSession();

  try {
    session.startTransaction();

    const post = await new this(postInput).save({ session });

    const user = await User.findById(post.author);

    if (!user) {
      throw new Error('User not found.');
    }

    user.posts.unshift(post._id);
    await user.save({ session });

    await session.commitTransaction();

    return post;
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    throw err;
  }
};

module.exports = mongoose.model('Post', PostSchema);
