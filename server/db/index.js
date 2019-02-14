const mongoose = require('mongoose');
const mongoDBConfig = require('./db.config');

module.exports = {
  init() {
    mongoose.connect(process.env.MONGO_URI, mongoDBConfig);

    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true);
    }

    mongoose.set('useFindAndModify', false);

    mongoose.connection.on('connected', () => {
      console.log('Connected to MongoDB');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('Reconnected to MongoDB');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Disconnected from MongoDB');
    });

    mongoose.connection.on('close', () => {
      console.log('Closed MongoDB Connection');
    });

    mongoose.connection.on('error', (error) => {
      console.error(`MongoDB ERROR: ${error}`);
    });
  },
};
