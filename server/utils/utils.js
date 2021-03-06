const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const multer = require('multer');
const uuidv1 = require('uuid/v1');
const { sample } = require('lodash');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const storage = multer.diskStorage({
  destination: 'server/uploads/avatar/',
  filename: (req, file, cb) => cb(null, `${uuidv1().replace(/-/g, '')}.png`),
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.match(/image\/.*/)) {
    cb(new Error('Only images are allowed.'));
    return;
  }
  cb(null, true);
};

module.exports.multerUploader = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});

exports.generateToken = (userId, username) => {
  const token = jwt.sign(
    { userId, username },
    process.env.JWT_SECRET,
    { expiresIn: '1y' },
  );

  if (!token) {
    throw new Error('Unauthorized');
  }

  return token;
};

exports.createLoaders = () => ({
  userLoader: new DataLoader(async userIds => userIds.map(id => User.findById(id))),
  postLoader: new DataLoader(async postIds => postIds.map(id => Post.findById(id))),
  commentLoader: new DataLoader(async commentIds => commentIds.map(id => Comment.findById(id))),
});

const titles = [
  'que magni, nemo fugit culpa explicabo laborum.',
  'que magni, nemo fugit culpa cum dolores deleniti sequi explicabo laborum.',
  'que magni, nemo fugit culpa',
  'que magni, nemo fugit culpa que magni, nemo fugit culpa cum dolores deleniti sequi explicabo laborum.',
];

exports.createFakeData = async () => {
  await Promise.all([
    await User.deleteMany(),
    await Post.deleteMany(),
    await Comment.deleteMany(),
  ]);

  const fakeUsers = await Promise.all(
    [...Array(5)].map(async (_, i) => {
      let userInput;
      if (i) {
        userInput = {
          username: `test${i}`,
          email: `test${i}@test.com`,
          password: '12345678a',
        };
      } else {
        userInput = {
          username: 'asafaviv',
          email: 'avivasaf1@hotmail.com',
          password: '12345678a',
        };
      }
      return User.createUser(userInput);
    }),
  );

  // await Promise.all(
  //   [...Array(5)].map(async (_, i) => { // eslint-disable-line
  //     const postInput = {
  //       author: fakeUsers[i],
  //       title: sample(titles),
  //       body: `
  //       Lorem ipsum dolor sit, amet consectetur
  //       adipisicing elit. Dolore laboriosam praesentium ab
  //       animi totam! Quas sapiente ipsa nobis porro unde dignissimos
  //       expedita incidunt doloribus corrupti quasi enim ullam voluptas ea
  //       que magni, nemo fugit culpa cum dolores deleniti sequi explicabo laborum.

  //       Loa nobis porro unde dignissimos
  //       expedita incidunt doloribus corrupti quasi enim ullam voluptas ea
  //       que magni, nemo fugit culpa cum dolores deleniti sequi explicabo laborum.

  //       Lorem ipsum dolor sit, amet consectetur
  //       adipisicing elit. Dolore laboriosam praesentium ab
  //       animi totam!nde dignissimos
  //       expedita incidunt doloribus corrupti quasi enim ullam voluptas ea
  //       que magni, nemo fugit culpa cum dolores deleniti sequi explicabo laborum.
  //     `,
  //       tags: ['React', 'Programming'],
  //     };
  //     return Post.createPost(postInput);
  //   }),
  // );

  // const users = await User.find();
  // const posts = await Post.find();
  // eslint-disable
  // for (const post of posts) {// eslint-disable-line
  //   for (const user of users) {// eslint-disable-line
  //     await Comment.newComment({ // eslint-disable-line
  //       author: user._id,
  //       post: post._id,
  //       body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, cum.',
  //     });
  //   }
  // }

  // for (const user1 of users) {// eslint-disable-line
  //   await User.findByIdAndUpdate(user1._id, { $set: { 'info.bio': sample(titles) } });// eslint-disable-line
  //   for (const user2 of users) {// eslint-disable-line
  //     if (user1.username !== user2.username) {
  //       await User.sendMessage(user1._id, user2._id, `from ${user2.username}`) // eslint-disable-line
  //     }
  //   }
  // }
};
