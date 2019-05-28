const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error(`Redis Error: ${err}`);
});

setInterval(() => {
  redisClient.hgetallAsync('connectedUsers').then(val => console.log(val));
}, 5000);

module.exports = redisClient;
