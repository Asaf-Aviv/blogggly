const mongoose = require('mongoose');

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
  likeCount: {
    type: Number,
    default: 0,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    get(v) {
      return v.toString();
    },
  }],
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

  return commentIds.map(cId => (cId.length ? this.find({ _id: { $in: cId } }) : []));
};

CommentSchema.statics.findCommentsForPost = async function (postId) {
  const { comments: commentIds } = await Post.findById(postId).select('comments');
  return commentIds;
};

CommentSchema.statics.createComment = async function (commentInput) {
  const post = await Post.findPostById(commentInput.post);
  const user = await User.findUserById(commentInput.author);
  const comment = new this(commentInput);

  post.comments.push(comment._id);
  user.comments.unshift(comment._id);

  await comment.save();
  await post.save();
  await user.save();

  return comment;
};

CommentSchema.statics.toggleLike = async function (id, userId) {
  const [comment] = await Promise.all([
    this.findCommentById(id),
    User.findUserById(userId),
  ]);

  const alreadyLike = comment.likes.includes(userId);

  let updatedDoc;

  if (alreadyLike) {
    updatedDoc = await this.findOneAndUpdate(
      { _id: id },
      {
        $pull: { likes: userId },
        $inc: { likeCount: -1 },
      },
      { new: true },
    );
  } else {
    updatedDoc = await this.findOneAndUpdate(
      { _id: id },
      {
        $addToSet: { likes: userId },
        $inc: { likeCount: 1 },
      },
      { new: true },
    );
  }

  return { likes: updatedDoc.likes };
};
module.exports = mongoose.model('Comment', CommentSchema);

// prevent circular dependencies by requiring after export
const User = require('./User');
const Post = require('./Post');
