// https://chenshenhai.github.io/koa2-note/note/static/server.html
const mime = {
  css: "text/css",
  less: "text/css",
  gif: "image/gif",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript",
  json: "application/json",
  pdf: "application/pdf",
  png: "image/png",
  svg: "image/svg+xml",
  swf: "application/x-shockwave-flash",
  tiff: "image/tiff",
  txt: "text/plain",
  wav: "audio/x-wav",
  wma: "audio/x-ms-wma",
  wmv: "video/x-ms-wmv",
  xml: "text/xml",
};

const reverse_mime = swap(mime);

const ext2mime = ext => mime[ext];
const mime2ext = mime => reverse_mime[mime];

module.exports = {
  ext2mime,
  mime2ext,
};

// helper
// https://stackoverflow.com/questions/23013573/swap-key-with-value-json/23013744
function swap(json) {
  var ret = {};
  for (var key in json) {
    ret[json[key]] = key;
  }
  return ret;
}
