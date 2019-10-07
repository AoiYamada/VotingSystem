const { IS_DEV } = require("config");

// https://github.com/koajs/koa/issues/803
// https://github.com/koajs/examples/blob/master/errors/app.js#L7
module.exports = () => async (ctx, next) => {
  try {
    // Go down the stream
    await next();
  } catch (error) {
    console.log("Error:", error);

    if (typeof error == "symbol") {
      error = new Error(error.toString());
      error.status = 400;
    }

    if (error.name) {
      switch (error.name) {
        case "TimeoutError":
          error.status = 504;
          break;
        case "SequelizeUniqueConstraintError":
          error.status = 422;
          error.message = "DUPLICATE_ENTRY";
          break;
      }
    }

    // If an error occurs down the stream and no response is sent by
    // another middleware before, the error gets caught up here
    const response = {};
    // Set status on ctx
    ctx.status = parseInt(error.status, 10) || ctx.status || 500;
    // Build response or do whatever you want depending on status
    switch (ctx.status) {
      case 400:
      case 401:
      case 403:
      case 422:
      case 503:
      case 504:
      case 500:
      case 404:
        response.message = error.message;
        break;
      default:
        response.message = "UNKNOWN_ERROR";
    }

    if (IS_DEV) {
      if (error.debug) {
        response.debug = error.debug;
      }
    }

    // End processing by sending response
    ctx.body = response;
  }
};
