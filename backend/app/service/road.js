const Service = require('egg').Service;
const fileReader = require('../util/file')
const coorUtil = require('../util/coor')

const fileName = {
  'road': 'roads01.json',  // 厦门岛 路网
  'crossing': 'crossings.json'  // 路口
}

class RoadService extends Service{
  async list(){
    const { ctx } = this
    const data = await fileReader.file(fileName['road'])
    ctx.logger.info("道路 数量", data.length)
    return data
  }
  async crossing(){
    const { ctx } = this
    const data = await fileReader.file(fileName['crossing'])
    ctx.logger.info("路口 数量", data.length)
    return data.map(p => [p[1], p[0]])  // lon lat 反了一下
  }

}

module.exports = RoadService;