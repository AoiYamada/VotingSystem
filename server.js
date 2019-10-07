const path = require("path");
const {
  PATHS: { LIB, MODULE },
  PORT,
} = require("config");

const { server } = require(path.join(LIB, "Server"));

// Require to init
require(path.join(MODULE, "Notification"));

server.listen(PORT);

console.log(`Koa API is starting at port ${PORT}`);