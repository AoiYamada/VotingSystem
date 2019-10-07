const Redis = require("ioredis");
const {
  DB: { REDIS },
} = require("config");

module.exports = {
  Subscriber: new Redis(REDIS),
  Publisher: new Redis(REDIS),
  Events: {
    VOTE: "vote",
    SUBSCRIBE: "subscribe",
  }
}
