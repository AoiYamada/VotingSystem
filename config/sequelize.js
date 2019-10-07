const env = process.argv[4] || process.env.NODE_ENV || "dev";
process.env.NODE_ENV = env;
const config = require("config");

module.exports = {
  [env]: config.DB.MYSQL,
};