import nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
async function send(sendInfo) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount()

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: '741946117@qq.com', // generated ethereal user（发件人的邮箱）
      pass: 'kxwgnrfmstjrbebd', // generated ethereal password（认证后的授权码，安全机制）
    },
  });

  // 重置密码链接
  const url = 'http://www.imooc.com';

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"认证邮件" <741946117@qq.com>', // sender address(发件人信息)
    to: sendInfo.email, // list of receivers(收件人信息)
    subject:
      sendInfo.user !== ''
        ? `你好开发者，${sendInfo.user}！《慕课网前端全栈实践》注册码`
        : '《慕课网前端全栈实践》注册码', // Subject line
    text: `
        您在《慕课网前端全栈实践》课程中注册，您的邀请码是${sendInfo.code},
        邀请码的过期时间: ${sendInfo.expire}
        `, // plain text body
    html: `
        <div style="border: 1px solid #dcdcdc;color: #676767;width: 600px; margin: 0 auto; padding-bottom: 50px;position: relative;">
          <div style="height: 60px; background: #393d49; line-height: 60px; color: #58a36f; font-size: 18px;padding-left: 10px;">
            Imooc社区——欢迎来到官方社区
          </div>
          <div style="padding: 25px">
            <div>您好，${sendInfo.user}童鞋，重置链接有效时间30分钟，请在${sendInfo.expire}之前重置您的密码：</div>
            <a href="${url}" style="padding: 10px 20px; color: #fff; background: #009e94; display: inline-block;margin: 15px 0;">立即重置密码</a>
            <div style="padding: 5px; background: #f2f2f2;">如果该邮件不是由你本人操作，请勿进行激活！否则你的邮箱将会被他人绑定。</div>
          </div>
          <div style="background: #fafafa; color: #b4b4b4;text-align: center; line-height: 45px; height: 45px; position: absolute; left: 0; bottom: 0;width: 100%;">系统邮件，请勿直接回复</div>
        </div>
        `,
  });

  // 发送结束后返回的信息
  return `Message sent: %s, ${info.messageId}`;
}

export default send;
