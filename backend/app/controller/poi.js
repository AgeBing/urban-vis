const { Controller }  = require('egg');

class POIController extends Controller {
  /**
   * POI 列表：（厦门岛内）
   */
  async list() {
    const { ctx } = this;
    const data = await ctx.service.poi.list();
    this.ctx.body = data
  }
}
module.exports = POIController;