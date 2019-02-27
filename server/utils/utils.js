const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.generateToken = (userId) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
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

  for (let i = 0; i < 1; i++) {
    await User.createUser({
      username: 'asafaviv',
      email: 'avivasaf1@hotmail.com',
      password: '12345',
    });
  }

  const fakeUsersAndPosts = [...Array(5)]
    .map(async (_, i) => {
      const userInput = {
        username: `testeroni_${i}`,
        email: `testeroni_${i}@test.com`,
        password: '12345',
      };

      const user = await User.createUser(userInput);

      [...Array(5)].map(async (_, i) => { // eslint-disable-line
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
    });

  await Promise.all(fakeUsersAndPosts);

  const users = await User.find();
  const posts = await Post.find();

  for (const post of posts) {
    for (const user of users) {
      await Comment.createComment({ // eslint-disable-line
        author: user._id,
        post: post._id,
        body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, cum.',
      });
    }
  }


  for (const user1 of users) {
    for (const user2 of users) {
      if (user1._id !== user2._id) {
        await User.sendMessage(user1._id, user2._id, 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque, tempora.');
      }
    }
  }
};
