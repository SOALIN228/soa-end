class DemoController {
  async demo (ctx) {
    ctx.body = {
      msg: 'hhh'
    }
  }
}

export default new DemoController()
