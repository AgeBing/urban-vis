const Service = require('egg').Service;
const fileReader = require('../util/file')
const coorUtil = require('../util/coor')

const TABLES = {
  "route": "travelroute",
}

class TourService extends Service{
  async routes(){
    // const { ctx } = this
    // const res = await this.app.mysql.select(TABLES['route']);

    // const data  = res.map((p) => {
    //   const { name, lng_gcj02, lat_gcj02 } = p
    //   return {
    //     name,
    //     lng : lng_gcj02,
    //     lat : lat_gcj02
    //   }
    // })
    // return data
    const r1_reverse = r1.concat([]).reverse();
    console.log(r1_reverse);
    return [r1_reverse, r2, r3]
  }
}



/**
 * 
 * http://www.mafengwo.cn/mdd/map/10132.html
 * https://lbs.qq.com/tool/getpoint/index.html
 */
const r1 = [
  {
    name: "南普陀寺",
    lng: 118.096582,
    lat: 24.440987
  },
  {
    name: "厦门大学 思明校区",
    lng: 118.102576,
    lat: 24.436343
  },{
    name: "芙蓉隧道",
    lng: 118.107953,
    lat: 24.435693
  },{
    name: "厦大白城沙滩",
    lng: 118.105063,
    lat: 24.431196,
  },{
    name:  "厦门环岛路木栈道",
    lng: 118.107752,
    lat: 24.430582
  },{
    name: "胡里山炮台",
    lng: 118.106381,
    lat: 24.429501
  },{
    name: "曾厝垵",
    lng: 118.126588,
    lat: 24.426948
  }
]

const r2 = [
  {
    name: "鼓浪屿风琴博物馆",
    lng: 118.068506,
    lat: 24.446890
  },
  {
    name: "厦门市鼓浪屿风景名胜区-三一堂",
    lng: 118.067330,
    lat: 24.444521
  },{
    name: "日光岩(鼓浪屿)",
    lng: 118.067467,
    lat: 24.442170
  },{
    name: "菽庄花园",
    lng: 118.069636,
    lat: 24.438859
  },{
    name: "鼓浪屿钢琴博物馆",
    lng: 118.069808,
    lat: 24.438290
  },{
    name: "皓月园",
    lng: 118.075923,
    lat: 24.441153
  },{
    name: "龙头路商业街",
    lng: 118.070552,
    lat: 24.444773
  }
]

const r3 = [
  {
    name: "门园林植物园(万石植物园)",
    lng: 118.103438,
    lat: 24.442495
  },{
    name: "世茂云上厦门",
    lng: 118.088838,
    lat: 24.435085,
  },{
    name: "沙坡尾",
    lng: 118.088094,
    lat: 24.437569
  },{
    name: "中山路步行街",
    lng: 118.078609,
    lat: 24.453794
  }
]

module.exports = TourService;