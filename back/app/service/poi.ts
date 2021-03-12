import { Service } from 'egg';
import { POIItem } from '@type/poi';
import { geoToCubeIndex } from '../utils/stc';

const TABLE = 'poi_in_city_range';

/**
CREATE TABLE poi_in_city_range AS SELECT *  FROM poi 
WHERE longitude < 120.747524 AND longitude > 120.593029 AND latitude < 28.027669 AND latitude > 27.958246 
ORDER BY RAND() LIMIT 1, 5000
*/

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

  public async queryPOIBySTC():Promise<POIItem[]>{
    const { ctx } = this;
    let { keyword } = ctx.request.body;
    const stcService = ctx.service.stc;
    const cells = await stcService.queryCellsInRange();
    const cellsId = cells.map(c => c.id.toString());

    // 2. 获取数据列表
    const pois:POIItem[] = await this.list(undefined, keyword);
    const poisInRange:POIItem[] = []
    
    // 3. 数据过滤并返回索引信息
    const ps = pois.map(async (poi:POIItem) => {
      const { longitude, latitude } = poi;
      const cubeId = (await geoToCubeIndex({ longitude, latitude })).toString();

      if (cellsId.indexOf(cubeId) !== -1) {
        poisInRange.push(poi)
      }
    });

    await Promise.all(ps)
    return poisInRange
  }

  public async queryById(id:string): Promise<POIItem|null>{
    const pois = await this.app.mysql.select(TABLE,{ id });
    if(Array.isArray(pois) && pois.length === 1){
      return pois[0]
    }else{
      return null
    }
  }

  public async queryPOIByCellsId(cellsId:string[],keyword=null):Promise<POIItem[]>{
    const pois:POIItem[] = await this.list(undefined, keyword);
    const poisInRange:POIItem[] = []

    this.logger.info('传入 cells 数量', cellsId);
    this.logger.info('整体 poi 数据量', pois.length);
    
    // 3. 数据过滤并返回索引信息
    const ps = pois.map(async (poi:POIItem) => {
      const { longitude, latitude } = poi;
      const cubeId = (await geoToCubeIndex({ longitude, latitude })).toString();

      if (cellsId.indexOf(cubeId) !== -1) {
        poisInRange.push(poi)
      }
    });
    this.logger.info('在 cells 里的 poi 数据量', poisInRange.length);
    await Promise.all(ps)
    return poisInRange
  }
}
