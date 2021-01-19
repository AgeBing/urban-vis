const { Controller } = require('egg');

class RoadController extends Controller{
  /**
   * 获取各路口过车的统计信息
   */
  async crossDailyConut(){
    const { ctx } = this
    const { cid } =  ctx.request.body;
    console.log(cid);
    this.ctx.body = await ctx.service.cross.crossDailyConut(cid);
  }

    /**
   * 获取各路口过车的ODMap图表统计信息
   */
  async crossODMapData(){
    const { ctx } = this
    const { cid,splitNumber=5 } =  ctx.request.body;
    console.log(cid);
    this.ctx.body = await ctx.service.cross.crossODMapData(cid,splitNumber);
  }


  /**
   * 所有路口列表
   */
  async getCrossingSites(){
    this.ctx.body = await this.ctx.service.cross.crossList();
  }
  /**
   * 查询路口
   */
  async postCrossingSites(){
    const { ctx } = this
    const { spaceRegions } = ctx.request.body;
    const data = await this.ctx.service.cross.queryCrossList(spaceRegions);
    ctx.logger.info("查询返回 Cross 数量", data.length)
    this.ctx.body = data
  }

  /**
   * LDA Block 区域列表
   */
  async blocks(){
    this.ctx.body = await this.ctx.service.road.blocks();
  }
}
module.exports = RoadController;
