const mongoose = require('mongoose');
const User = require('./User');

const { Schema } = mongoose;

const PostSchema = new mongoose.Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  body: { type: String, required: true },
}, { timestamps: true });

PostSchema.statics.createPost = async function (postInput) {
  const post = await new this(postInput).save();
  const user = await User.findById(post.author);
  user.posts.unshift(post._id);
  await user.save();
  return post;
};

module.exports = mongoose.model('Post', PostSchema);
