import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    let res = await ctx.service.test.sayHi();
    console.log(res)
    ctx.body = 'hi'
  }
}
