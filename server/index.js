require('dotenv').config();
require('./db');

// const Post = require('./models/Post');
// const { createFakeData } = require('./utils');

// createFakeData();

// (async () => {
//   await Post.update({}, { $set: { likes: [] } }, { multi: true });
// })();

const app = require('./app');

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`listening on port ${port}`));
