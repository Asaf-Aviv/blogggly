require('dotenv').config();
require('./utils/logger');
const redisClient = require('./redisClient');
require('./db');
require('./app');

// const { createFakeData } = require('./utils');

// createFakeData();

['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM']
  .forEach((eventType) => {
    process.on(eventType, async (err) => {
      console.error(err);
      await redisClient.flushall();
      console.log('beforeExit');
    });
  });
