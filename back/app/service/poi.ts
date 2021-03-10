import { Service } from 'egg';
import { POIItem } from '@type/poi';

const TABLE = 'poi';


import { DEFAULT_GEO } from '../utils/stc'
/**
 * POI Service
 */
export default class POI extends Service {

  /**
   * 获取POI数据列表
   */
  public async list(geo = DEFAULT_GEO, keyword = null): Promise<POIItem[]> {
    if (!geo) geo = DEFAULT_GEO;
    const { app } = this;
    console.time('Select POI List');
    // const user = await app.mysql.select(TABLE);
    let sql = `select 
      uid as id, name, type, longitude, latitude
      from ${TABLE} where
      longitude > ${geo[1]} AND 
      longitude < ${geo[0]} AND 
      latitude > ${geo[3]} AND
      latitude < ${geo[2]}
      LIMIT 0, 10000
    `;
    // LIMIT 0, 2000

    if (keyword) {
      // POI 名称中包含 keyword
      sql += ` AND name like '%${keyword}%'`;
    }

    // LIMIT 0,5000
    const pois:POIItem[] = await app.mysql.query(sql);
    this.logger.info('POI length: ', pois.length);
    console.timeEnd('Select POI List');
    return pois;
  }
}
