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
    const { spaceRegions } = ctx.request.body;
    // ctx.logger.info("查询返回 POI SpaceRegion", spaceRegions);
    const data = await ctx.service.poi.query(spaceRegions);
    ctx.logger.info("查询返回 POI 数量", data.length)
    this.ctx.body = data; 
  }
  async getCommentsData(){
    const { ctx } = this;
    const { pid } = ctx.request.body;
    ctx.logger.info("查询返回 POI 大众点评数据，pid：", pid);
    const data = await ctx.service.poi.getCommentsData(pid);
    this.ctx.body = data; 
  }
  async getPOITypes(){
    const { ctx } = this;
    let data = await ctx.service.poi.getPOITypes();
    this.ctx.body = data; 
  }
  async getTypicalPOIs() {
    // "南普陀寺","厦门大学 思明校区","芙蓉隧道","厦大白城沙滩","厦门环岛路木栈道","胡里山炮台","曾厝垵"
    const data = [{
          name: "南普陀寺",
          name_en: "Nanputuo Temple",
          lng: 118.096582,
          lat: 24.440987,
          type:"风景名胜",
        },
        {
          name: "厦门大学 思明校区",
          name_en: "Xiamen university",
          lng: 118.102576,
          lat: 24.436343,
          type:"科教文化服务",
        },{
          name: "芙蓉隧道",
          name_en: "Furong tunnel",
          lng: 118.107953,
          lat: 24.435693,
          type:"风景名胜",
        },{
          name: "厦大白城沙滩",
          name_en: "Baicheng Beach",
          lng: 118.105063,
          lat: 24.431196,
          type:"风景名胜",
        },{
          name:  "厦门环岛路木栈道",
          name_en: "Boardwalk, Huandao Road, Xiamen",
          lng: 118.107752,
          lat: 24.430582,
          type:"科教文化服务",
        },{
          name: "胡里山炮台",
          name_en: "Hulishan Canon Platform",
          lng: 118.106381,
          lat: 24.429501,
          type:"风景名胜",
        },{
          name: "曾厝垵",
          name_en: "Zengcuo 'an",
          lng: 118.125201,
          lat: 24.42515,
          type:"风景名胜",
        }];
        this.ctx.body = data ;
}
}
module.exports = POIController;