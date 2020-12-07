const { Controller }  = require('egg');

class TourController extends Controller {
  async routes() {
    const { ctx } = this;
    const data = await ctx.service.tour.routes();
    ctx.logger.info("Tour Route 景点数量", data.length)
    this.ctx.body = data ;
  }
}
module.exports = TourController;