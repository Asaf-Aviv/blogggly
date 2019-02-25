const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const { sampleSize } = require('lodash');

const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    uniqueCaseInsensitive: true,
    validate: [/^[a-zA-Z0-9_]+$/, 'Username must contain only Characters, Numbers and Underscores'],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    uniqueCaseInsensitive: true,
    validate: [validator.isEmail, "The email you've entered is invalid, Please try again."],
  },
  password: {
    type: String,
    select: false,
    required: true,
    unique: false,
    minlength: [6, 'Password is too short'],
    maxlength: [100, 'Password is too long'],
    validate: [/^[^ ]+$/],
  },
  avatar: {
    type: String,
    default: '/public/assets/avatar/man.svg',
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post',
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

UserSchema.statics.moreFromAuthor = async function (userId, viewingPostId) {
  const user = await this.findUserById(userId);
  const postIds = sampleSize(user.posts.filter(post => post.id.toString() !== viewingPostId), 3);
  return Post.find({ _id: { $in: postIds } });
};

UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

UserSchema.statics.comparePasswords = async (password, hashedPassword) => (
  bcrypt.compare(password, hashedPassword)
);

UserSchema.statics.findUserById = async function (userId) {
  const user = await this.findById(userId);

  if (!user) {
    throw new Error('User not found.');
  }

  return user;
};

UserSchema.statics.findUsersByIds = async function (userIds) {
  if (!userIds || !userIds.length) {
    return [];
  }
  return this.find({ _id: { $in: userIds } });
};

UserSchema.statics.createUser = async function (userInput) {
  const userExist = await this.findByEmail(userInput.email);

  if (userExist) {
    throw new Error('User already exists.');
  }

  const hashedPassword = await bcrypt.hash(userInput.password, 10);

  const user = new this({
    ...userInput,
    password: hashedPassword,
  });

  return user.save();
};

UserSchema.statics.login = async function (email, password) {
  const user = await this.findByEmail(email).select('+password');

  if (!user) {
    throw new Error('User does not exists.');
  }

  if (!await this.comparePasswords(password, user.password)) {
    throw new Error('Incorrect password.');
  }

  return user;
};

UserSchema.plugin(uniqueValidator, { message: '{PATH} already exists' });

module.exports = mongoose.model('User', UserSchema);
// prevent circular dependencies by requiring after export
const Post = require('./Post');
