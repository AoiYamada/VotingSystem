const path = require("path");
const IS_PROD = process.env.NODE_ENV == "prod" || process.env.NODE_ENV == "uat";
const IS_DEV = !IS_PROD;

// paths
const CWD = process.cwd();
const APP = path.join(CWD, "app");
const LIB = path.join(CWD, "lib");
const MODEL = path.join(CWD, "model");
const MODULE = path.join(CWD, "module");
const MIDDLEWARE = path.join(CWD, "middleware");

module.exports = {
  PORT: 3000,
  IS_PROD,
  IS_DEV,
  PATHS: {
    CWD,
    APP,
    LIB,
    MODEL,
    MODULE,
    MIDDLEWARE,
  },
};
