const Service = require('egg').Service;
const fileReader = require('../util/file')
const coorUtil = require('../util/coor')

// 从文件读取
const fileName = 'xiamen_poi_gcj02.csv'  // 厦门岛所有POI

class POIService extends Service{
  async list(){
    const { ctx } = this
    const data = await fileReader.csv(fileName)
    ctx.logger.info("POI 数量", data.length)
    const filter = data.map(d => ({
      name : d.name,
      lon: d.lon,
      lat: d.lat    
    }))
    .filter(d => isWithinInXiamengland(d) )  // 过滤岛内
    ctx.logger.info("过滤后 POI 数量", filter.length)
    return filter.map(poi => coorUtil.gcj02towgs84(poi))
  }

  /**
   * 根据 Region 过滤
   * spaceRegion: [
   *    {lng,lat},
   *    {lng,lat},
   *    {lng,lat},
   *    {lng,lat},
   * ]
   */
  async query(spaceRegion){
    const allPois = await this.list();

    if(!spaceRegion || spaceRegion.length == 0 || spaceRegion[0] == null)
      return allPois
    const boundrys = getRegionBoundry(spaceRegion)
    return allPois.filter(poi => {
      let {lon,lat} = poi
      const { lngMax,lngMin,latMax,latMin } = boundrys
      return  lon && lat && ( lon < lngMax && lon > lngMin && lat < latMax && lat > latMin ) 
    })
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

const getRegionBoundry = (region) => {
  let lngMax = region[0]['lng'],
      lngMin = lngMax,
      latMax = region[0]['lat'],
      latMin = latMax;
  if(region.length <= 1){
    return { lngMax,lngMin,latMax,latMin }
  }
  for(let i = 1;i < region.length;i++){
      lngMax = region[i]['lng'] > lngMax ? region[i]['lng'] : lngMax
      lngMin = region[i]['lng'] < lngMin ? region[i]['lng'] : lngMin
      latMax = region[i]['lat'] > latMax ? region[i]['lat'] : latMax
      latMin = region[i]['lat'] < latMin ? region[i]['lat'] : latMin
  }
  return { lngMax,lngMin,latMax,latMin }
}

module.exports = POIService;