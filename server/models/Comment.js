const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  body: { type: String, required: true },
  likesCount: { type: Number, default: 0 },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

CommentSchema.statics.findCommentById = async function (commentId) {
  const comment = await this.findById(commentId);

  if (!comment) {
    throw new Error('Comment not found.');
  }

  return comment;
};

CommentSchema.statics.findCommentsByIds = async function (commentIds) {
  if (!commentIds || !commentIds.length) {
    return [];
  }

  return this.find({ _id: { $in: commentIds } }).sort({ createdAt: -1 });
};

CommentSchema.statics.findCommentsForPost = async function (postId) {
  const { comments: commentIds } = await Post.findById(postId).select('comments');
  return commentIds;
};

CommentSchema.statics.addComment = async function (commentInput) {
  const [post, user] = await Promise.all([
    Post.findPostById(commentInput.post),
    User.findUserById(commentInput.author),
  ]);

  const comment = new this(commentInput);

  post.comments.push(comment._id);
  user.comments.unshift(comment._id);

  post.commentsCount += 1;

  await Promise.all([
    await comment.save(),
    await post.save(),
    await user.save(),
  ]);

  return post;
};

CommentSchema.statics.toggleLike = async function (id, userId) {
  const [comment, user] = await Promise.all([
    this.findCommentById(id),
    User.findUserById(userId),
  ]);

  const alreadyLike = comment.likes
    .some(commentAuthorId => commentAuthorId.toString() === userId);

  if (alreadyLike) {
    comment.likes = comment.likes
      .filter(commentAuthorId => commentAuthorId.toString() !== userId);

    comment.likesCount -= 1;

    user.likes.comments = user.likes.comments
      .filter(commentId => commentId.toString() !== comment._id.toString());
  } else {
    comment.likes.push(userId);
    comment.likesCount += 1;

    user.likes.comments.unshift(comment._id);
  }

  await Promise.all([
    comment.save(),
    user.save(),
  ]);

  return comment;
};

module.exports = mongoose.model('Comment', CommentSchema);

// prevent circular dependencies by requiring after export
const User = require('./User');
const Post = require('./Post');
