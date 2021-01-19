const { Controller }  = require('egg');

// const DATA_SOURCE = {
//   "0" : "Passenger",
//   "1" : "Weibo",
//   "2" : s
// }

class DataController extends Controller {
  async list() {
    const { ctx } = this;
    const { dataSource, time, spaceRegion } = ctx.request.body;
    let res;
    switch(dataSource){
      case 0:  // 行人
      case 1:  // 行人
      case 2:  // 行人
      case 3:  // POI
        res = await ctx.service.poi.query();
    }
    console.log(res.length);
    this.ctx.body = res;
  }
}

module.exports = DataController;