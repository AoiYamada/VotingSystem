const Redis = require("ioredis");
const {
  DB: { REDIS },
} = require("config");

module.exports = new Redis(REDIS);
