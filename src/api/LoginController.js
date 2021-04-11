import send from '@/config/MailConfig';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import config from '@/config';
import { checkCode } from '@/common/Utils';
import User from '@/model/User';

class LoginController {
  /**
   * 邮箱找回密码
   * @param ctx
   */
  async forget(ctx) {
    const { body } = ctx.request;
    try {
      const result = await send({
        code: '1234',
        expire: dayjs().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        email: body.username,
        user: 'soalin',
      });
      ctx.body = {
        code: 200,
        data: result,
        msg: '邮件发送成功',
      };
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 登录
   * @param ctx
   */
  async login(ctx) {
    const { body } = ctx.request;
    const { username, password, sid, code } = body;
    // 图像验证码是否有效
    const isValid = await checkCode(sid, code);
    if (isValid) {
      // 验证用户名密码
      let checkUserPassword = false;
      const user = await User.findOne({ username });
      if (!user) {
        // 用户信息不存在
        ctx.body = {
          code: 404,
          msg: '用户名不存在',
        };
        return;
      }
      // 和数据库解密后的密码进行比较
      const checkPassword = await bcrypt.compare(password, user.password);
      if (checkPassword) {
        checkUserPassword = true;
      }
      if (checkUserPassword) {
        // 根据secret和用户信息生成token
        const token = jsonwebtoken.sign(
          {
            _id: username,
          },
          config.JWT_SECRET,
          {
            expiresIn: '1d',
          },
        );
        ctx.body = {
          code: 200,
          token,
        };
        return;
      }
      // 用户名或密码验证失败
      ctx.body = {
        code: 404,
        msg: '用户名或密码错误',
      };
      return;
    }
    // 图片验证码验证失败
    ctx.body = {
      code: 401,
      msg: '图片验证码不正确，请检查！',
    };
  }

  /**
   * 注册
   * @param ctx
   */
  async reg(ctx) {
    const { body } = ctx.request;
    const { username, name, password, sid, code } = body;
    const msg = {};
    // 图像验证码是否有效
    const result = await checkCode(sid, code);
    if (result) {
      // 查库，看username是否被注册
      const user1 = await User.findOne({ username });
      if (user1) {
        msg.username = '此邮箱已经注册，可以通过邮箱找回密码';
        ctx.body = {
          code: 500,
          msg: msg,
        };
        return;
      }
      const user2 = await User.findOne({ name });
      // 查库，看name是否被注册
      if (user2) {
        msg.name = '此昵称已经被注册，请修改';
        ctx.body = {
          code: 500,
          msg: msg,
        };
        return;
      }
      // 验证通过，写入数据到数据库
      // 密码加密
      const handlePassword = await bcrypt.hash(password, 5);
      const user = new User({
        username,
        name,
        password: handlePassword,
      });
      const result = await user.save();
      ctx.body = {
        code: 200,
        data: result,
        msg: '注册成功',
      };
      return;
    }
    msg.code = '验证码输入错误！';
    ctx.body = {
      code: 500,
      msg,
    };
  }
}

export default new LoginController();
