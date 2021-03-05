import { Service } from 'egg';
import { POIItem }  from '@type/poi'
// const fileUtil = require('../utils/file')
import { GeoParam } from '@type/base'

const TABLE = 'poi'
const GEO = {  // 地理范围
  longitude: [120.567924, 120.787542],
  latitude: [27.859125, 28.071486]
}

const GEO_LIST:GeoParam = [
  GEO['longitude'][1],
  GEO['longitude'][0],
  GEO['latitude'][1],
  GEO['latitude'][0],
]
/**
 * POI Service
 */
export default class POI extends Service {

  /**
   * 获取POI数据列表
   */
  public async list(geo = GEO_LIST, keyword = null): Promise<POIItem[]>{
    const { app } = this
    
    // const user = await app.mysql.select(TABLE);
    let sql = `select 
      uid as id, name, type, longitude, latitude
      from ${TABLE} where
      longitude > ${geo[1]} AND 
      longitude < ${geo[0]} AND 
      latitude > ${geo[3]} AND
      latitude < ${geo[2]} 
    `

    if(keyword){
      // POI 名称中包含 keyword
      sql += ` AND name like '%${keyword}%'`
    }

      // LIMIT 0,5000
    const pois:POIItem[] = await app.mysql.query(sql);
    console.log("pois.length: ",pois.length)
    // console.log(pois[0])
    return pois;
  }
}
