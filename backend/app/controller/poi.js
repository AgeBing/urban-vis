const { Controller }  = require('egg');

class POIController extends Controller {
  async list() {
    const { ctx } = this;
    const data = await ctx.service.poi.list();
    ctx.logger.info("获取 POI 列表数量", data.length)
    this.ctx.body = data;
  }
  async query(){
    const { ctx } = this;
    
    const { spaceRegion } = ctx.request.body;
    ctx.logger.info("查询返回 POI SpaceRegion", spaceRegion);
    const data = await ctx.service.poi.query(spaceRegion);

    ctx.logger.info("查询返回 POI 数量", data.length)
    this.ctx.body = data; 
  }
}
module.exports = POIController;