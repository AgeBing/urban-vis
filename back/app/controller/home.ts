import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = 'hi'
  }
  public async test() {
    const { ctx } = this;
    this.logger.info(ctx.request.body)
    
    // 模拟运行时间
    await new Promise(resolve => {
      setTimeout(resolve, 1000)
    })

    ctx.body = {
      name: 'tom',
      age: 12
    }
  }
}
