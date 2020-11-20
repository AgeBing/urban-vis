const { Controller }  = require('egg');

class TaxiController extends Controller {
  async list() {
    const { ctx } = this;
    const data = await ctx.service.taxi.trajectorys();
    ctx.logger.info("Taxi 列表数量", data.length)
    this.ctx.body = data ;
  }

  async query(){
    const { ctx } = this;
    const data = await ctx.service.taxi.query();
    ctx.logger.info("查询 Taxi 数量", data.length)
    this.ctx.body = data
  }
}
module.exports = TaxiController;