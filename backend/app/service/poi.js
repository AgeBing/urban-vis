const Service = require('egg').Service;
const fileReader = require('../util/file')
const coorUtil = require('../util/coor')

const fileName = 'xiamen_poi_gcj02.csv'  // 厦门岛所有POI

class POIService extends Service{
  async list(){
    const { ctx } = this
    const data = await fileReader.csv(fileName)
    ctx.logger.info("POI 数量", data.length)
    const filter = data.map(d => ({
      name : d.adname,
      lon: d.lon,
      lat: d.lat    
    }))
    .filter(d => isWithinInXiamengland(d) )
    ctx.logger.info("过滤后 POI 数量", filter.length)

    return filter.map(poi => coorUtil.gcj02towgs84(poi))
    // return filter
  }
}

/**
 * 判断点 是否在 厦门岛 内
 * @param {*} param0 
 */
const isWithinInXiamengland = ( {lon,lat} ) => {
  const topleft = [118.05739,24.555591]
  const bottomRight = [118.203348,24.416553]
  const lngMax = bottomRight[0],
        lngMin = topleft[0],
        latMax = topleft[1],
        latMin = bottomRight[1]
  
  return  lon && lat && ( lon < lngMax && lon > lngMin && lat < latMax && lat > latMin ) 
}

module.exports = POIService;