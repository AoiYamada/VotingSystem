const Koa = require("koa");
const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

const path = require("path");
const helmet = require("koa-helmet");
const cors = require("@koa/cors");
const logger = require("koa-logger");
const compress = require("koa-compress");
const koaBody = require("koa-body");
const zlib = require("zlib");
const limiter = require("koa2-ratelimit").RateLimit.middleware;

const {
  PATHS: { APP, MIDDLEWARE },
  // IS_PROD,
  IS_DEV,
} = require("config");

const router = require(path.join(APP, "router"));
const ErrorHandler = require(path.join(MIDDLEWARE, "ErrorHandler"));
const { ResponseTime } = require(path.join(MIDDLEWARE, "ResponseTime"));

app
  .use(
    limiter({
      interval: { min: 10 },
      max: 3600, // limit each IP to 3600 requests per interval
      message: "Too many request, get out!",
    })
  )
  .use(helmet())
  .use(
    cors({
      origin: '*',
      // allowMethods: [],
      // exposeHeaders: [],
      // allowHeaders: [],

      /* http://www.ruanyifeng.com/blog/2016/04/cors.html
        该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。
        默认情况下，Cookie不包括在CORS请求之中。设为true，
        即表示服务器明确许可，Cookie可以包含在请求中，
        一起发给服务器。这个值也只能设为true，
        如果服务器不要浏览器发送Cookie，删除该字段即可。
      */
      // credentials: true,
      keepHeadersOnError: IS_DEV,
    })
  )
  .use(logger())
  .use(ResponseTime())
  .use(
    compress({
      filter: content_type => {
        return /text/i.test(content_type);
      },
      threshold: 2048,
      flush: zlib.Z_SYNC_FLUSH,
    })
  )
  .use(
    koaBody({
      multipart: true,
      includeUnparsed: true,
    })
  )
  .use(ErrorHandler())
  .use(router.routes())
  .use(router.allowedMethods());

module.exports = {
  app,
  server,
  io,
}