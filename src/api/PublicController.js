import svgCaptcha from 'svg-captcha'

class PublicController {
  async getCaptcha (ctx) {
    // 生成验证码
    const newCaptcha = svgCaptcha.create({
      size: 6,
      ignoreChars: '0Oo1il',
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 150,
      height: 38,
    })
    ctx.body = {
      code: 200,
      data: newCaptcha.data
    }
  }
}

export default new PublicController()
