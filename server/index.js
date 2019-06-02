require('dotenv').config();
const redisClient = require('./redisClient');
require('./db');
require('./app');


// const { createFakeData } = require('./utils');

// createFakeData();

['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM']
  .forEach((eventType) => {
    process.on(eventType, async () => {
      await redisClient.flushallAsync();
      console.log('beforeExit');
    });
  });
