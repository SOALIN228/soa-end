/**
 * User: soalin
 * Date: 2020/7/4
 * Time: 16:06
 * Desc: 异常处理中间件
 */
export default (ctx, next) => {
  return next().catch((err) => {
    // 鉴权异常处理
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        msg: 'Protected resource, use Authorization header to get access\n',
      };
    } else {
      // 错误异常处理
      ctx.status = err.status || 500;
      ctx.body = {
        code: 500,
        msg: err.message,
      };
      // 开发环境打印错误所在行数
      if (process.env.NODE_ENV === 'development') {
        console.log(err.stack);
      }
    }
  });
};
