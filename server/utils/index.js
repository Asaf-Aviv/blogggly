const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.generateToken = (userId) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
  );

  if (!token) {
    throw new Error('Unauthorized');
  }

  return token;
};

exports.createLoaders = () => ({
  userLoader: new DataLoader(userIds => User.findUsersByIds(userIds)),
  postLoader: new DataLoader(postIds => Post.findPostsByIds(postIds)),
  commentLoader: new DataLoader(commentIds => Comment.findCommentsbyIds(commentIds)),
});
