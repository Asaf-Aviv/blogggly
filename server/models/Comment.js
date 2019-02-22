const mongoose = require('mongoose');
const conn = require('../db');
const User = require('./User');
const Post = require('./Post');

const { Schema } = mongoose;

const CommentSchema = new mongoose.Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    get(v) {
      return v.toString();
    },
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    get(v) {
      return v.toString();
    },
  },
  body: { type: String, required: true },
}, { timestamps: true });

CommentSchema.statics.findCommentsByIds = async function (commentIds) {
  if (!commentIds || !commentIds.length) {
    return [];
  }

  return commentIds.map(cId => (cId.length ? this.find({ _id: { $in: cId } }) : []));
};

CommentSchema.statics.findCommentsForPost = async function (postId) {
  const { comments: commentIds } = await Post.findById(postId).select('comments');
  return commentIds;
};

CommentSchema.statics.createComment = async function (commentInput) {
  const session = await conn.startSession();

  try {
    session.startTransaction();

    const post = await Post.findPostById(commentInput.post);
    const user = await User.findUserById(commentInput.author);
    const comment = new this(commentInput);

    post.comments.push(comment._id);
    user.comments.unshift(comment._id);

    await comment.save({ session });
    await post.save({ session });
    await user.save({ session });

    await session.commitTransaction();

    return comment;
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    throw err;
  }
};

module.exports = mongoose.model('Comment', CommentSchema);
