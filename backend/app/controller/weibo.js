const { Controller }  = require('egg');

class WeiboController extends Controller {
  async list() {
    const { ctx } = this;
    const data = await ctx.service.weibo.list();
    this.ctx.body = data ;
  }
}
module.exports = WeiboController;