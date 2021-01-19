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
    let {startTime,endTime,spaceRegions} = ctx.request.body;
    startTime = "2020-06-18 12:00:00"
    endTime = "2020-06-18 18:00:00"
    const data = await ctx.service.taxi.query([startTime,endTime],spaceRegions);
    ctx.logger.info("查询 Taxi 数量", data.length)
    this.ctx.body = data
  }
}
module.exports = TaxiController;