import svgCaptcha from 'svg-captcha';
import { setValue } from '@/config/RedisConfig';

class PublicController {
  // 生成验证码
  async getCaptcha(ctx) {
    // 获取参数
    const body = ctx.request.query;
    const newCaptcha = svgCaptcha.create({
      size: 6,
      ignoreChars: '0Oo1il',
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 150,
      height: 46,
      fontSize: 50,
    });
    if (body.sid) {
      // 设置图片验证码超时10分钟
      setValue(body.sid, newCaptcha.text, 10 * 60);
    }
    ctx.body = {
      code: 200,
      data: newCaptcha.data,
    };
  }
}

export default new PublicController();
