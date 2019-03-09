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
  shortBody: String,
  deleted: { type: Boolean, default: false },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
}, { timestamps: true });

PostSchema.pre('save', function (done) {
  if (this.isNew) {
    this.shortBody = this.body.slice(0, 150).trim();
  }
  return done();
});

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

  return this.find({ _id: { $in: postIds } });
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

    post.likesCount -= 1;

    user.likes.posts = user.likes.posts
      .filter(postId => postId.toString() !== post._id.toString());
  } else {
    post.likes.push(userId);
    post.likesCount += 1;

    user.likes.posts.unshift(post._id);
  }

  await Promise.all([
    post.save(),
    user.save(),
  ]);

  return post;
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
