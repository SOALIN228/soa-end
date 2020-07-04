import send from '@/config/MailConfig'
import moment from 'moment'
import bcrypt from 'bcrypt'
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
      const user = await User.findOne({ username })
      // if (!user) {
      //   // 用户信息不存在
      //   ctx.body = {
      //     code: 404,
      //     msg: '用户名不存在'
      //   }
      //   return
      // }
      const checkPassword = await bcrypt.compare(password, user.password)
      if (checkPassword) {
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

  async reg (ctx) {
    const { body } = ctx.request
    const { username, name, password, sid, code } = body
    const msg = {}
    // 图像验证码是否有效
    let result = await checkCode(sid, code)
    let check = true
    if (result) {
      // 查库，看username是否被注册
      let user1 = await User.findOne({ username })
      if (user1 !== null && typeof user1.username !== 'undefined') {
        msg.username = ['此邮箱已经注册，可以通过邮箱找回密码']
        check = false
      }
      let user2 = await User.findOne({ name })
      // 查库，看name是否被注册
      if (user2 !== null && typeof user2.name !== 'undefined') {
        msg.name = ['此昵称已经被注册，请修改']
        check = false
      }
      // 写入数据到数据库
      if (check) {
        // 密码加密
        const handlePassword = await bcrypt.hash(password, 5)
        let user = new User({
          username,
          name,
          password: handlePassword,
          created: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        let result = await user.save()
        ctx.body = {
          code: 200,
          data: result,
          msg: '注册成功'
        }
        return
      }
    } else {
      msg.code = ['验证码输入错误！']
    }
    ctx.body = {
      code: 500,
      msg: msg
    }
  }
}

export default new LoginController()
