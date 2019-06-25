const mongoose = require('mongoose');
const mongoDBConfig = require('./db.config');

const isProd = process.env.NODE_ENV === 'production';
const MONGO_URI = isProd ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

mongoose.connect(MONGO_URI, mongoDBConfig);

const conn = mongoose.connection;

mongoose.set('useFindAndModify', false);

conn.on('connected', () => {
  console.log('Connected to MongoDB');
});

conn.on('reconnected', () => {
  console.log('Reconnected to MongoDB');
});

conn.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

conn.on('close', () => {
  console.log('Closed MongoDB Connection');
});

conn.on('error', (error) => {
  console.error(`MongoDB ERROR: ${error}`);
});

module.exports = conn;
