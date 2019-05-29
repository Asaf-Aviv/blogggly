const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const { sampleSize } = require('lodash');
const MessageSchema = require('./Message');
const NotificationSchema = require('./Notification');

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
  avatar: { type: String, default: '/uploads/avatar/man.svg' },
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
  notifications: [NotificationSchema],
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

UserSchema.statics.toggleFollow = async function (followerId, followeeId) {
  const [follower, followee] = await Promise.all([
    this.findUserById(followerId),
    this.findUserById(followeeId),
  ]);

  const alreadyFollow = follower.following
    .some(followedUser => followedUser._id.toString() === followeeId);

  if (alreadyFollow) {
    follower.following = follower.following
      .filter(followedUser => followedUser._id.toString() !== followeeId);

    followee.followers = followee.followers
      .filter(followingUser => followingUser._id.toString() !== followerId);

    follower.followingCount -= 1;
    followee.followersCount -= 1;
  } else {
    follower.following.unshift(followeeId);
    followee.followers.unshift(followerId);

    follower.followingCount += 1;
    followee.followersCount += 1;
  }

  await Promise.all([
    follower.save(),
    followee.save(),
  ]);

  return { follower, followee, isFollow: !alreadyFollow };
};

UserSchema.statics.moreFromAuthor = async function (userId, viewingPostId) {
  const user = await this.findUserById(userId);
  const postIds = sampleSize(user.posts.filter(post => post._id.toString() !== viewingPostId), 4);
  return Post.find({ _id: { $in: postIds } });
};

UserSchema.statics.findMessage = async function (messageId, inInbox, userId) {
  const inboxOrSent = inInbox ? 'inbox' : 'sent';
  const messagesArray = inInbox ? 'inbox.inbox' : 'inbox.sent';

  const { inbox } = await this.findOne(
    { _id: userId, [`${messagesArray}._id`]: messageId },
    { [`${messagesArray}.$`]: 1 },
  );

  return inbox[inboxOrSent][0];
};

UserSchema.statics.bookmarkMessage = async function (messageId, inInbox, userId) {
  const messagesArray = inInbox ? 'inbox.inbox' : 'inbox.sent';
  const message = await this.findMessage(messageId, inInbox, userId);

  message.inBookmarks = !message.inBookmarks;
  message.inTrash = false;

  await this.updateOne(
    { _id: userId, [`${messagesArray}._id`]: messageId },
    {
      $set: {
        [`${messagesArray}.$.inBookmarks`]: message.inBookmarks,
        [`${messagesArray}.$.inTrash`]: false,
      },
    },
  );

  return message;
};

UserSchema.statics.moveMessageToTrash = async function (messageId, inInbox, userId) {
  const messagesArray = inInbox ? 'inbox.inbox' : 'inbox.sent';
  const message = await this.findMessage(messageId, inInbox, userId);

  message.inTrash = !message.inTrash;

  await this.updateOne(
    { _id: userId, [`${messagesArray}._id`]: messageId },
    {
      $set: {
        [`${messagesArray}.$.inTrash`]: message.inTrash,
        [`${messagesArray}.$.inBookmarks`]: false,
      },
    },
  );

  return message;
};

UserSchema.statics.deleteMessage = async function (messageId, inInbox, userId) {
  const messagesArray = inInbox ? 'inbox.inbox' : 'inbox.sent';

  await this.findByIdAndUpdate(
    userId,
    { $pull: { [messagesArray]: { _id: messageId } } },
  );

  return messageId;
};

UserSchema.plugin(uniqueValidator, { message: '{PATH} already exists' });

module.exports = mongoose.model('User', UserSchema);
// prevent circular dependencies by requiring after export
const Post = require('./Post');
