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
    minlength: [6, 'Password is too short'],
    maxlength: [100, 'Password is too long'],
    validate: [/^[^ ]+$/],
  },
  avatar: { type: String, default: '/public/assets/avatar/man.svg' },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  likes: {
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  inbox: {
    sent: [MessageSchema],
    inbox: [MessageSchema],
    bookmarks: [MessageSchema],
    trash: [MessageSchema],
  },
  tags: [String],
}, { timestamps: true });

UserSchema.statics.moreFromAuthor = async function (userId, viewingPostId) {
  const user = await this.findUserById(userId);
  const postIds = sampleSize(user.posts.filter(post => post._id.toString() !== viewingPostId), 4);
  return Post.find({ _id: { $in: postIds } });
};

UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

UserSchema.statics.comparePasswords = async (password, hashedPassword) => (
  bcrypt.compare(password, hashedPassword)
);

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

UserSchema.statics.findUserById = async function (userId, options) {
  const user = await this.findById(userId, options);

  if (!user) {
    throw new Error('User not found.');
  }

  return user;
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

UserSchema.statics.findUsersByIds = async function (userIds) {
  console.log(userIds);
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
