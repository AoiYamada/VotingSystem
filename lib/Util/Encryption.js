const bcrypt = require("bcryptjs");
const crypto = require("crypto");

class Encryption {
  static md5(input, digest = "hex") {
    return input
      ? crypto
        .createHash("md5")
        .update(input)
        .digest(digest)
      : null;
  }
  static async salt(input, cost = 12) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(input, cost, (error, hash) => {
        if (error) {
          reject(error);
        } else {
          resolve(hash);
        }
      });
    });
  }
  static async verify(input, hash) {
    hash = hash.replace(/^\$2y(.+)$/i, "$2a$1");
    return new Promise((resolve, reject) => {
      bcrypt.compare(input, hash, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
  // https://stackoverflow.com/questions/7480158/how-do-i-use-node-js-crypto-to-create-a-hmac-sha1-hash
  static sha1(key, toSign, digest = "hex") {
    return crypto
      .createHmac("sha1", key)
      .update(toSign)
      .digest(digest);
  }
}

module.exports = Encryption;
