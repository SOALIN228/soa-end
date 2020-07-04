import send from '@/config/MailConfig'
import moment from 'moment'
import jsonwebtoken from 'jsonwebtoken'
import config from '@/config'
import { checkCode } from '@/common/Utils'
import User from '@/model/User'

class LoginController {
  async forget (ctx) {
    const { body } = ctx.request
    try {
      let result = await send({
        code: '1234',
        expire: moment()
          .add(30, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss'),
        email: body.username,
        user: 'soalin',
      })
      ctx.body = {
        code: 200,
        data: result,
        msg: '邮件发送成功',
      }
    } catch (e) {
      console.error(e)
    }
  }

  async login (ctx) {
    const { body } = ctx.request
    const { username, password, sid, code } = body
    // 图像验证码是否有效
    const isValid = await checkCode(sid, code)
    if (isValid) {
      // 验证用户名密码
      let checkUserPassword = false
      let user = await User.findOne({ username })
      if (user.password === password) {
        checkUserPassword = true
      }
      if (checkUserPassword) {
        // 验证通过，返回token
        let token = jsonwebtoken.sign({
          _id: username
        }, config.JWT_SECRET, {
          expiresIn: '1d'
        })
        ctx.body = {
          code: 200,
          token
        }
      } else {
        // 用户名或密码验证失败
        ctx.body = {
          code: 404,
          msg: '用户名或密码错误'
        }
      }
    } else {
      // 图片验证码验证失败
      ctx.body = {
        code: 401,
        msg: '图片验证码不正确，请检查！'
      }
    }
  }
}

export default new LoginController()
