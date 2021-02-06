const uuid = require('uuid');
const util = require('../util/util')

const cookieKey = 'session:key';

module.exports = function () {
  return async (ctx, next) => {
    // 请求 cookie
    let cookieValue = ctx.cookies.get(cookieKey);

    // 如果请求未带 cookie 则手动设置 cookie
    if (!cookieValue) {
      cookieValue = `${cookieKey}=${uuid.v4()}; SameSite=None; Secure`
      ctx.set('Set-Cookie', cookieValue);
    }
    // 为请求上下文添加一个 session 对象供操作 session
    ctx.session = {
      async get(sessionKey) {
        return await util.redisNode.get(util.makeSessionKey(cookieValue, sessionKey))
      },
      async set(sessionKey, sessionValue) {
        await util.redisNode.set(util.makeSessionKey(cookieValue, sessionKey), sessionValue)
      },
      async remove(sessionKey) {
        await util.redisNode.remove(util.makeSessionKey(cookieValue, sessionKey))
      }
    };
    // 为请求上下文添加一个 sessionKey
    ctx.cookieKey = cookieKey
    await next();
  };
};

