const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.generateToken = (userId) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '10m' },
  );

  if (!token) {
    throw new Error('Unauthorized');
  }

  return token;
};

exports.createLoaders = () => ({
  userLoader: new DataLoader(userIds => User.findUsersByIds(userIds)),
  postLoader: new DataLoader(postIds => Post.findPostsByIds(postIds)),
  commentLoader: new DataLoader(commentIds => Comment.findCommentsByIds(commentIds)),
});

exports.createFakeData = async () => {
  await User.deleteMany();
  await Post.deleteMany();
  await Comment.deleteMany();

  const fakeUsersAndPosts = [...Array(10)]
    .map(async (_, i) => {
      const userInput = {
        username: `testeroni_${i}`,
        email: `testeroni_${i}@test.com`,
        password: '12345',
      };

      const user = await User.createUser(userInput);

      const postInput = {
        author: user._id,
        title: `${user.username} ${i} post`,
        body: `
        Lorem ipsum dolor sit, amet consectetur 
        adipisicing elit. Dolore laboriosam praesentium ab 
        animi totam! Quas sapiente ipsa nobis porro unde dignissimos 
        expedita incidunt doloribus corrupti quasi enim ullam voluptas ea 
        que magni, nemo fugit culpa cum dolores deleniti sequi explicabo laborum.
      `,
      };

      return Post.createPost(postInput);
    });

  await Promise.all(fakeUsersAndPosts);

  const users = await User.find();
  const posts = await Post.find();

  for (let i = 0; i < posts.length; i += 1) {
    for (let j = 0; j < users.length; j += 1) {
      await Comment.createComment({ // eslint-disable-line
        author: users[j]._id,
        post: posts[i]._id,
        body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, cum.',
      });
    }
  }
};
