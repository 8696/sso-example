const Koa = require('koa');
const KoaRouter = require('koa-router');
const koaView = require('koa-views');
const koaBody = require('koa-body');
const session = require('../service/session');
const path = require('path');
const app = new Koa();
const config = require('../config');
const util = require('../util/util');
app.use(koaView(path.resolve(__dirname, './view'), {
  extension: 'ejs'
}));

app.use(koaBody());

app.keys = ['app key'];

app.use(session());

const koaRouter = new KoaRouter();

koaRouter.get('/', async (ctx, next) => {
  await ctx.render('index', {
    appSsoConfig: config.appSso,
    app002Config: config.app002
  });
});

/**
 * @description 业务系统登录接口 | 业务系统登录很简单只需要写入 cookie 即可
 * */
koaRouter.get('/login', async (ctx, next) => {
  const token = ctx.request.query.token
  const cookie = await util.redisNode.get(token);
  const username = await util.redisNode.get(token + 'username')
  const loginTime = await util.redisNode.get(token + 'loginTime')
  await util.redisNode.remove(token)
  // 将 cookie 和 登录系统保持同步
  ctx.cookies.set('session:key', cookie);
  ctx.set('Content-Type', 'application/x-javascript');
  ctx.body = `${ctx.request.query.callBack}({
    username: '${username}',
    loginTime: '${loginTime}'
  })`;
});


app.use(koaRouter.routes());

module.exports = function () {
  app.listen(config.app002.port);
}





