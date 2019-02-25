require('dotenv').config();
require('./db');

// const { createFakeData } = require('./utils');

// createFakeData();

const app = require('./app');

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`listening on port ${port}`));
