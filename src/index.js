import Koa from 'koa'
import path from 'path'
import JWT from 'koa-jwt'
import helmet from 'koa-helmet'
import statics from 'koa-static'
import router from './routes/routes'
import koaBody from 'koa-body'
import json from 'koa-json'
import cors from '@koa/cors'
import compose from 'koa-compose'
import compress from 'koa-compress'
import config from './config'
import errorHandle from './common/ErrorHandle'

const app = new Koa()
const isDevMode = process.env.NODE_ENV !== 'production'

// 定义公共路径，不需要jwt鉴权
const jwt = JWT({ secret: config.JWT_SECRET }).unless({ path: [/^\/public/, /\/login/] })

// 整合中间件
const middleware = compose([
  koaBody(),
  statics(path.join(__dirname, '../public')),
  cors(),
  json({ pretty: false, param: 'pretty' }),
  helmet(),
  errorHandle,
  jwt
])

// 生产环境开启压缩
if (!isDevMode) {
  app.use(compress())
}
app.use(middleware)
app.use(router())

app.listen(3000)
