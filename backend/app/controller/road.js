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
    const { cid } =  ctx.request.body;
    console.log(cid);
    this.ctx.body = await ctx.service.cross.crossODMapData(cid);
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
    this.ctx.body = await this.ctx.service.cross.queryCrossList();
  }
}
module.exports = RoadController;
