// https://wohugb.gitbooks.io/koajs/content/document/application.html
const ResponseTime = () => async (ctx, next) => {
  const start = Date.now();
  console.log("Request Time:", new Date(start))
  await next();
  const end = Date.now();
  const time = end - start;
  ctx.set("X-Response-Time", `${time}ms`);
};

module.exports = {
  ResponseTime,
}