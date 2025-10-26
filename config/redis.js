const Redis = require('ioredis');

let redisClient;
try {
    redisClient = new Redis(process.env.REDIS_URL);

    redisClient.on('connect', () => console.log('🟢 Connected to Redis'));
    redisClient.on('error', (err) => console.log('🔴 Redis Error:', err));
} catch (err) {
    throw err;
}


module.exports = redisClient;