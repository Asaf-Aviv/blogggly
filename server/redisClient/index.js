const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);

const redisClient = redis.createClient();

redisClient.on('ready', () => {
  console.log('Redis connection established');
});

redisClient.on('connect', () => {
  console.log('Redis stream connected');
});

redisClient.on('reconnect', () => {
  console.log('Reonnecing to Redis');
});

redisClient.on('error', (err) => {
  console.error(`Redis Error: ${err}`);
});

redisClient.on('end', () => {
  console.error('Connection to Redis has been closed');
});

module.exports = redisClient;
