// https://github.com/S-PRO/koa2-starter/blob/master/app/models/index.js
const fs = require("fs");
const path = require("path");
const {
  PATHS: { LIB },
  DB: { MYSQL },
} = require("config");
const Sequelize = require("sequelize");
const { DataTypes } = Sequelize;
const { Compose } = require(path.join(LIB, "Util"));

const folders = Compose(scanDir, getFolders)(__dirname);
const db = Object.create(null);
const sequelize = new Sequelize(MYSQL);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

for (const folder of folders) {
  const files = Compose(scanDir, getJSs)(path.join(__dirname, folder));

  for (const file of files) {
    const modelPath = path.join(__dirname, folder, file);
    const model = require(modelPath);
    db[model.name] = model.init(sequelize, DataTypes);
  }
}

for (const [, model] of Object.entries(db)) {
  if (model.associate) {
    model.associate(db);
  }
}

db.truncate = () => {
  return Promise.all(
    Object.keys(db).map(key => {
      if (["sequelize", "Sequelize", "truncate"].includes(key)) return null;
      return db[key].destroy({ where: {}, force: true });
    })
  );
}

module.exports = db;

// helper(s)
function scanDir(dir) {
  return fs.readdirSync(dir);
}

function getFolders(dirsArray) {
  return dirsArray.filter(file => !~file.indexOf("."));
}

function getJSs(dirsArray) {
  return dirsArray.filter(file => ~file.indexOf(".js"));
}
