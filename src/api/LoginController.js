import send from '@/config/MailConfig'
import moment from 'moment'
import jsonwebtoken from 'jsonwebtoken'
import config from '@/config'

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
    let token = jsonwebtoken.sign({
      _id: 'soalin'
    }, config.JWT_SECRET, {
      expiresIn: '1d'
    })
    ctx.body = {
      code: 200,
      token
    }
  }
}

export default new LoginController()
