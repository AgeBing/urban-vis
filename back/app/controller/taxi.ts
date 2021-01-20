import { Controller } from 'egg';

export default class TaxiController extends Controller {
  public async index() {
    const { ctx } = this;
    let res = await ctx.service.taxi.list();
    ctx.body = res
  }
}
