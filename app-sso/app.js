const Koa = require('koa');
const KoaRouter = require('koa-router');
const koaView = require('koa-views');
const koaBody = require('koa-body');
const session = require('../service/session');
const path = require('path');
const app = new Koa();
const uuid = require('uuid');
const util = require('../util/util');
const config = require('../config');

app.use(koaView(path.resolve(__dirname, './view'), {
  extension: 'ejs'
}));

app.use(koaBody());


app.use(session());

const koaRouter = new KoaRouter();

koaRouter.get('/', async (ctx, next) => {
  ctx.redirect('/user');
});

/**
 * @description 登录页面
 * */
koaRouter.get('/login', async (ctx, next) => {
  await ctx.render('login');
});

/**
 * @description 用户中心页面
 * */
koaRouter.get('/user', async (ctx, next) => {
  // 获取 session
  const username = await ctx.session.get('username');
  // session 未存在用户名表示未登录、未登录跳转至登录
  if (!username) {
    return ctx.redirect('/login');
  }
  await ctx.render('user', {
    username: username,
    app001Config: config.app001,
    app002Config: config.app002
  });
});

/**
 * @description 统一登录入口
 * @method post
 * */
koaRouter.post('/login', async (ctx, next) => {
  // 写入 session
  await ctx.session.set('username', ctx.request.body.username);
  await ctx.session.set('loginTime', new Date().toString());
  ctx.redirect('/user');
});

/**
 * @description 统一退出入口
 * @method post
 * */
koaRouter.get('/logout', async (ctx, next) => {
  // 写入 session
  await ctx.session.remove('username');
  ctx.redirect('/login');
});

/**
 * @description 业务系统异步登录接口
 * */
koaRouter.get('/async/login', async (ctx, next) => {
  // 判断业务系统来源
  const serverList = ['127.0.0.1', 'localhost', config.app001.host, config.app002.host];
  const is = serverList.some((item) => {
    return new RegExp(item, 'g').test(ctx.headers.referer);
  });
  // 获取 session
  const username = await ctx.session.get('username');
  const loginTime = await ctx.session.get('loginTime');

  ctx.set('Content-Type', 'application/x-javascript');

  if (!is || !username || !loginTime) {
    return ctx.redirect('/login');
  }
  // 生成 token
  const token = uuid.v4();
  const cookie = ctx.cookies.get(ctx.cookieKey);
  // 写入 redis
  await util.redisNode.set(token, cookie);
  ctx.body = `${ctx.request.query.callBack}('${token}')`;
});


/**
 * @description 获取用户信息
 * */

koaRouter.post('/getUserInfo', async (ctx, next) => {
  // 写入 session
  const username = await ctx.session.get('username');
  const loginTime = await ctx.session.get('loginTime');
  ctx.body = { username, loginTime }
});

app.use(koaRouter.routes());

module.exports = function () {
  app.listen(config.appSso.port);
}


