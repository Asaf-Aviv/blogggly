require('dotenv').config();
require('./db');

// const User = require('./models/User');
// const Post = require('./models/Post');
// const Comment = require('./models/Comment');

// const { createFakeData } = require('./utils');

// createFakeData();

// (async () => {
//   await User.updateMany({}, {
//     $set: {
//       info: {
//         firstname: '',
//         lastname: '',
//         gender: '',
//         dateofbirth: '',
//         country: '',
//       },
//     },
//   });
// })();

const app = require('./app');

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`listening on port ${port}`));
