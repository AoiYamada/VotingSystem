const path = require("path");
const fs = require("fs");
const {
  PATHS: { APP },
} = require("config");
const Router = require("koa-router");
const router = new Router();

const paths = walk(APP);
const empty_regex = new RegExp(`${paths.empty_folders.map(v => `(?!\/${v}\/)`).join("")}/([\\w]+)`, "g");

for (const file_path of paths.files) {
  const dir_obj = path.parse(file_path);
  if (dir_obj.ext === ".js" && !dir_obj.name.startsWith("_")) {
    const method = dir_obj.name;

    const controller = dir_obj.dir.split(/\\|\//).slice(-1)[0];
    const base_with_ID = dir_obj.dir
      .replace(APP, "")
      .replace(/\\/g, "/")
      .replace(empty_regex, "/$1/:$1_ID");

    const base_without_ID = base_with_ID.slice(0, -`:${controller}_ID`.length);
    const handler = require(file_path);

    switch (method) {
      case "get":
      case "post":
      case "put":
      case "patch":
      case "delete":
        router[method](base_without_ID, ...handler);
        router[method](base_with_ID, ...handler);
      case "head":
      case "options":
        // Pending
        break;
      default:
    }
  }
}

module.exports = router;

// helper(s)
// https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
function walk(dir) {
  const files = [];
  const empty_folders = [];
  const list = fs.readdirSync(dir);
  if (!list.some(v => ~v.indexOf(".js"))) {
    empty_folders.push(path.parse(dir).base);
  }

  let pending = list.length;
  if (!pending)
    return {
      files,
      empty_folders,
    };
  for (let file of list) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      const res = walk(file);
      files.push(...res.files);
      empty_folders.push(...res.empty_folders);
    } else {
      files.push(file);
    }
    if (!--pending)
      return {
        files,
        empty_folders,
      };
  }
}
