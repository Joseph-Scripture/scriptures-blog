const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on('error', (err) => {
    console.log('Redis client error:', err);
});

// Since Redis v4, you must explicitly connect
redisClient.connect().catch(console.error);

module.exports = redisClient;