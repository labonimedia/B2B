const Bull = require("bull");
const Redis = require("ioredis");
require("dotenv").config();

const redisClient = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
});

const autoForwardQueue = new Bull("auto-forward-orders", { redis: redisClient });
const autoCancelQueue = new Bull("auto-cancel-orders", { redis: redisClient });

module.exports = { autoForwardQueue, autoCancelQueue };
