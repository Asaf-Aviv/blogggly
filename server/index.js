require('dotenv').config();
require('./db');

// const User = require('./models/User');
// const Post = require('./models/Post');
// const Comment = require('./models/Comment');

// const { createFakeData } = require('./utils');

// createFakeData();

// (async () => {
//   await Promise.all([
//     User.remove(),
//     Post.remove(),
//     Comment.remove(),
//   ]);
// })();

const app = require('./app');

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`listening on port ${port}`));
