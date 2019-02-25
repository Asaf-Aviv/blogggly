const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new mongoose.Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    get(v) {
      return v.toString();
    },
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
    required: true,
    get(v) {
      return v.toString();
    },
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
    get(v) {
      return v.toString();
    },
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
  const [post] = await Promise.all([
    this.findPostById(id),
    User.findUserById(userId),
  ]);

  const likeIndex = post.likes.findIndex(
    likeUserId => likeUserId.toString() === userId.toString(),
  );

  let updatedDoc;

  if (likeIndex === -1) {
    updatedDoc = await this.findOneAndUpdate(
      { _id: id },
      {
        $addToSet: { likes: userId },
        $inc: { likeCount: 1 },
      },
      { new: true },
    );
  } else {
    updatedDoc = await this.findOneAndUpdate(
      { _id: id },
      {
        $pull: { likes: userId },
        $inc: { likeCount: -1 },
      },
      { new: true },
    );
  }

  return { likes: updatedDoc.likes };
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
