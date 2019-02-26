const mongoose = require('mongoose');
const mongoDBConfig = require('./db.config');

mongoose.connect(process.env.MONGO_URI, mongoDBConfig);

const conn = mongoose.connection;

if (process.env.NODE_ENV !== 'production') {
  // mongoose.set('debug', true);
}

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
