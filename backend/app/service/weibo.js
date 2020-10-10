const { Service } = require('egg');
const coorUtil = require('../util/coor')
const weiboTempScript = require('../../scripts/weibo')

class WeiboService extends Service{
  async list(){
    const data = await weiboTempScript.readWeiboData()
    return data.map(weibo => ({
      lon: weibo['lng'],
      lat: weibo['lat'],
      text: weibo['text']
    }))
    .map(weibo => coorUtil.gcj02towgs84(weibo))
  }
}

module.exports = WeiboService
