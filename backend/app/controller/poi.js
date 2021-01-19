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
          content:"弥勒真弥勒，分身千百亿，时时示世人，世人不自识",
        },
        {
          name: "厦门大学 思明校区",
          name_en: "Xiamen university",
          lng: 118.102576,
          lat: 24.436343,
          type:"科教文化服务",
          content:"简称厦大（XMU），是由中华人民共和国教育部直属、中央直管副部级建制的综合性研究型全国重点大学",
        },{
          name: "芙蓉隧道",
          name_en: "Furong tunnel",
          lng: 118.107953,
          lat: 24.435693,
          type:"风景名胜",
          content:"位于厦大内部，芙蓉餐厅旁，是中国最文艺的隧道，是中国最长的涂鸦隧道，是厦门大学主要景点之一",
        },{
          name: "厦大白城沙滩",
          name_en: "Baicheng Beach",
          lng: 118.105063,
          lat: 24.431196,
          type:"风景名胜",
          content:"位于厦门大学南部白城脚下，为演武大桥与胡里山炮台之间的一片美丽的沙滩，融合美丽景色与深厚的文化历史底蕴于一体",
        },{
          name:  "厦门环岛路木栈道",
          name_en: "Boardwalk, Huandao Road, Xiamen",
          lng: 118.107752,
          lat: 24.430582,
          type:"科教文化服务",
          content:"简称厦大（XMU），是由中华人民共和国教育部直属、中央直管副部级建制的综合性研究型全国重点大学",
        },{
          name: "胡里山炮台",
          name_en: "Hulishan Canon Platform",
          lng: 118.106381,
          lat: 24.429501,
          type:"风景名胜",
          content:"竣工于清光绪二十二年（公元1896年），总面积7万多平方米，分为战坪区、兵营区和后山区，历史上被称为“八闽门户、天南锁钥”",
        },{
          name: "曾厝垵",
          name_en: "Zengcuo 'an",
          lng: 118.125201,
          lat: 24.42515,
          type:"风景名胜",
          content:"中国最文艺渔村，为“曾厝垵文创村”的简称。位于厦门岛东南部，有兔耳岭之草，太姥山之石，火山岛之礁，自然人文为一体。至今已有八百多年历史",
        }];
        this.ctx.body = data ;
}
}
module.exports = POIController;