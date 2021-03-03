import { Service } from 'egg';
import { POIItem }  from '@type/poi'
// const fileUtil = require('../utils/file')

const TABLE = 'poi'
const GEO = {  // 地理范围
  longitude: [120.567924, 120.787542],
  latitude: [27.859125, 28.071486]
}
/**
 * POI Service
 */
export default class POI extends Service {

  /**
   * 获取POI数据列表
   */
  public async list(geo = GEO): Promise<POIItem[]>{
    const { app } = this
    
    // const user = await app.mysql.select(TABLE);
    const sql = `select 
      uid as id, name, type, longitude, latitude
      from ${TABLE} where
      longitude > ${geo['longitude'][0]} AND 
      longitude < ${geo['longitude'][1]} AND 
      latitude > ${geo['latitude'][0]} AND
      latitude < ${geo['latitude'][1]}
    `
      // LIMIT 0,5000
    const pois:POIItem[] = await app.mysql.query(sql);
    console.log(pois.length)
    console.log(pois[0])
    return pois;
  }
}
