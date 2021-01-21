import { Controller } from 'egg';

export default class PhoneController extends Controller {
  public async index() {
    const { ctx } = this;
    let res = await ctx.service.phone.list();
    ctx.body = res
  }
}
