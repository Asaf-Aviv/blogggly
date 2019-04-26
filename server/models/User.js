const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const { sampleSize } = require('lodash');
const MessageSchema = require('./Message');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    uniqueCaseInsensitive: true,
    minlength: 3,
    maxlength: 16,
    validate: [
      /^[a-zA-Z0-9_]+$/,
      'Username can contain only Characters, Numbers and Underscores',
    ],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    uniqueCaseInsensitive: true,
    validate: [validator.isEmail, 'Invalid email.'],
  },
  password: {
    type: String,
    select: false,
    required: true,
    maxlength: [100, 'Password is too long'],
    // validate: [
    //   /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    //   'Password must contain atleast eight characters, one letter and one number',
    // ],
  },
  avatar: { type: String, default: '/public/assets/avatar/man.svg' },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  likes: {
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  },
  info: {
    firstname: { type: String, default: '' },
    lastname: { type: String, default: '' },
    bio: { type: String, default: '' },
    gender: {
      type: String,
      default: '',
      validate: [
        /male|female|/,
        'Gender must be "male" or "female"',
      ],
    },
    dateOfBirth: { type: String, default: '' },
    country: { type: String, default: '' },
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', required: true }],
  sentFriendRequests: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  incomingFriendRequests: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  inbox: {
    sent: [MessageSchema],
    inbox: [MessageSchema],
  },
  tags: [String],
}, { timestamps: true });

UserSchema.statics.comparePasswords = async (password, hashedPassword) => (
  bcrypt.compare(password, hashedPassword)
);

UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: { $regex: email, $options: 'i' } });
};

UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username: { $regex: username, $options: 'i' } });
};

UserSchema.statics.findUserById = async function (userId, options) {
  const user = await this.findById(userId, options);

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

  const hashedPassword = await bcrypt.hash(userInput.password, 12);

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

UserSchema.statics.updateInfo = async function (userId, info) {
  return this.findOneAndUpdate(
    { _id: userId },
    { $set: { info, $set: { $dateFromString: { dateString: info.dateOfBirth, format: '%m-%d-%y' } } } },
    { new: true },
  ).select('info');
};

UserSchema.statics.sendMessage = async function (from, to, body) {
  const [sender, receiver] = await Promise.all([
    this.findUserById(from),
    this.findUserById(to),
  ]);

  const message = { from, to, body };

  sender.inbox.sent.unshift(message);
  receiver.inbox.inbox.unshift(message);

  await Promise.all([
    sender.save(),
    receiver.save(),
  ]);

  return sender.inbox.sent[0];
};

UserSchema.statics.toggleFollow = async function (currentUserId, userIdTofollow) {
  const [currentUser, userToFollow] = await Promise.all([
    this.findUserById(currentUserId),
    this.findUserById(userIdTofollow),
  ]);

  const alreadyFollow = currentUser.following
    .some(followedUser => followedUser._id.toString() === userIdTofollow);

  if (alreadyFollow) {
    currentUser.following = currentUser.following
      .filter(followedUser => followedUser._id.toString() !== userIdTofollow);

    userToFollow.followers = userToFollow.followers
      .filter(followingUser => followingUser._id.toString() !== currentUserId);

    currentUser.followingCount -= 1;
    userToFollow.followersCount -= 1;
  } else {
    currentUser.following.unshift(userIdTofollow);
    userToFollow.followers.unshift(currentUserId);

    currentUser.followingCount += 1;
    userToFollow.followersCount += 1;
  }

  await Promise.all([
    currentUser.save(),
    userToFollow.save(),
  ]);

  return currentUser;
};

UserSchema.statics.moreFromAuthor = async function (userId, viewingPostId) {
  const user = await this.findUserById(userId);
  const postIds = sampleSize(user.posts.filter(post => post._id.toString() !== viewingPostId), 4);
  return Post.find({ _id: { $in: postIds } });
};

UserSchema.plugin(uniqueValidator, { message: '{PATH} already exists' });

module.exports = mongoose.model('User', UserSchema);
// prevent circular dependencies by requiring after export
const Post = require('./Post');
