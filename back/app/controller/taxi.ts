import { Controller } from 'egg';

export default class TaxiController extends Controller {
  public async index() {
    const { ctx } = this;
    let res = await ctx.service.taxi.points();
    console.log(res)
    ctx.body = res
  }
}
