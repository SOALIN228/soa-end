import Koa from 'koa';
import path from 'path';
import JWT from 'koa-jwt';
import helmet from 'koa-helmet';
import statics from 'koa-static';
import router from './routes/routes';
import koaBody from 'koa-body';
import json from 'koa-json';
import cors from '@koa/cors';
import compose from 'koa-compose';
import compress from 'koa-compress';
import config from './config';
import errorHandle from './common/ErrorHandle';

const app = new Koa();
const isDevMode = process.env.NODE_ENV !== 'production';

// 根据secret验证token，更安全的方法是使用动态secret
const jwt = JWT({ secret: config.JWT_SECRET }).unless({
  // 定义公共路径，不需要jwt鉴权
  path: [/^\/public/, /\/login/],
});

// 整合中间件
const middleware = compose([
  koaBody(), // 支持多种body格式的解析器
  statics(path.join(__dirname, '../public')), // 静态资源
  cors(), // 跨域处理
  json({ pretty: false, param: 'pretty' }), // 返回json格式数据
  helmet(), // 添加安全处理
  errorHandle, // 全局错误处理
  jwt, // token处理
]);

// 生产环境开启压缩
if (!isDevMode) {
  app.use(compress());
}
app.use(middleware);
app.use(router());

app.listen(3000);
