/**
 * User: soalin
 * Date: 2020/7/4
 * Time: 16:06
 * Desc: 鉴权中间件
 */
export default (ctx, next) => {
  return next().catch((err) => {
    if (401 === err.status) {
      ctx.status = 401
      ctx.body = 'Protected resource, use Authorization header to get access\n'
    } else {
      throw err
    }
  })
}
