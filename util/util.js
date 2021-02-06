const md5 = require('blueimp-md5');

const redis = require('redis');
const client = redis.createClient({
  host: require('../config').redis.host,
  port: require('../config').redis.port
});

module.exports = {
  redisNode: {
    set(key, value) {
      return new Promise((resolve, reject) => {
        client.set(key, value, function (error, value) {
          if (error === null) {
            return resolve();
          }
          reject();
        });
      });
    },
    get(key) {
      return new Promise((resolve, reject) => {
        client.get(key, function (error, value) {
          if (error === null) {
            return resolve(value);
          }
          reject();
        });
      });
    },
    remove(key) {
      return this.set(key, '')
    }
  },
  /**
   * @description 生成服务端 sessionKey | 简单拼接进行 MD5 即可 | 实际场景中应进行有效期等更复杂加密
   * @param cookieValue {String}
   * @param sessionKey {String}
   * */

  makeSessionKey(cookieValue, sessionKey) {
    return md5(cookieValue + '__md5__' + sessionKey);
  }
};
