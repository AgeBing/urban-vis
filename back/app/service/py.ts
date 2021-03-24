import { Service } from 'egg';
import { DS } from '@type/base';
import { queryRes, queryResItem } from '../controller/py';
import { WeiboItem } from '@type/weibo';
import { POIItem } from '@type/poi';
import { pointToCubeIndex, getCubeCellBbx, stcs2locas, bbxToCubeCellIds } from '../utils/stc';
import { geoToCubeIndex } from '../utils/stc';


export default class Py extends Service {
  /**
   * 基于 STC 查询时空数据（taxi、phone）
   * @param source 数据源
   * @return
   */
  public pyQuery = async (source:DS) => {
    const { ctx } = this;
    this.logger.info('py 查询时空数据...');
    this.logger.info('输入条件: ', ctx.request.body);

    //  2. 得到符合查询条件的 立方体单元 列表
    const stcService = ctx.service.stc;
    const cells = await stcService.queryCellsInRange();
    const cellsId = cells.map(c => c.id.toString());

    //  3. 获取经过这些 立方体单元 的 数据id列表
    const trajsIds:string[] = await stcService.getIdsInCells(cellsId, source);

    //  4. 返回这些数据对应的 stc info（即数据对应的时空范围）
    const res:queryRes = await stcService.getSTCInfoOfDatas(trajsIds, source);

    const resLength = Array.isArray(res) && res.length || 0;
    this.logger.info('cellsId: ', cellsId.length, ' trajsIds: ', trajsIds.length, '  res:', resLength);
    if (resLength == 0) {
      this.logger.error('时空过滤结果为空！！', ctx.request.body);
      return [];
    }
    return res;
  };


  /**
   * 基于 STC 查询 Weibo 数据
   * @return
   */
  public async pyQueryWeibo():Promise<queryRes> {
    const { ctx } = this;

    const weibos = await ctx.service.weibo.queryWeiboBySTC()

    // 返回索引信息
    const ps = weibos.map(async (weibo:WeiboItem) => {
      const { time, lat, lng, id } = weibo;
      const cellId = await pointToCubeIndex({
        time,
        longitude: lng,
        latitude: lat,
      });

      // 数据点不在 STC config 范围内
      const bbx = await getCubeCellBbx(cellId);
      if (!bbx) return undefined;

      return {
        id,
        stcubes: [ cellId ],
        scube: stcs2locas([cellId]),
        bbx,
      };
    });

    return (await Promise.all(ps)).filter(x => x);
  }

  public async pyQueryWeibosInfo(weibos:WeiboItem[]):Promise<queryRes> {
    // 返回索引信息
    const ps = weibos.map(async (weibo:WeiboItem) => {
      const { time, lat, lng, id } = weibo;
      const cellId = await pointToCubeIndex({
        time,
        longitude: lng,
        latitude: lat,
      });

      // 数据点不在 STC config 范围内
      const bbx = await getCubeCellBbx(cellId);
      if (!bbx) return undefined;

      return {
        id,
        stcubes: [ cellId ],
        scube: stcs2locas([cellId]),
        bbx,
      };
    });

    return (await Promise.all(ps)).filter(x => x);
  }


  public async pyQueryPOI():Promise<queryRes> {
    const { ctx } = this;

    const pois = await ctx.service.poi.queryPOIBySTC()

    // 3. 数据过滤并返回索引信息
    const ps = pois.map(async (poi:POIItem) => {
      const { longitude, latitude, id } = poi;
      const cubeId = (await geoToCubeIndex({ longitude, latitude })).toString();
      const bbx = await getCubeCellBbx(cubeId);
      if (!bbx) { return undefined; }
      /**
        cube 第 0 层， 时间为 0
          "timeRange": [
              "00:00:00",
              "00:10:00"
          ],
       */
      return {
        id,
        stcubes: [ cubeId ],
        scube: stcs2locas([cubeId]),
        bbx,
      };
    });

    return (await Promise.all(ps)).filter(x => x);
  }


  public async pyQueryPoisInfo(pois:POIItem[]):Promise<queryRes> {
    // 数据过滤并返回索引信息
    const ps = pois.map(async (poi:POIItem) => {
      const { longitude, latitude, id } = poi;
      const cubeId = (await geoToCubeIndex({ longitude, latitude })).toString();
      const bbx = await getCubeCellBbx(cubeId);
      if (!bbx) { return undefined; }
      /**
        cube 第 0 层， 时间为 0
          "timeRange": [
              "00:00:00",
              "00:10:00"
          ],
       */
      return {
        id,
        stcubes: [ cubeId ],
        scube: stcs2locas([cubeId]),
        bbx,
      };
    });

    return (await Promise.all(ps)).filter(x => x);
  }

  public async queryPOIBoxInfoById(id:string): Promise<queryResItem>{
    const poi:POIItem | null  = await this.ctx.service.poi.queryById(id)
    if(!poi) return null
    let { longitude, latitude } = poi
    const cubeId = (await geoToCubeIndex({ longitude, latitude })).toString();
    const bbx = await getCubeCellBbx(cubeId);
    if (!bbx) { return undefined; }
    /**
      cube 第 0 层， 时间为 0
        "timeRange": [
            "00:00:00",
            "00:10:00"
        ],
    */
    return {
      id,
      stcubes: [ cubeId ],
      scube: stcs2locas([cubeId]),
      bbx,
    };
  }
  public async queryWeiboBoxInfoById(id:string): Promise<queryResItem>{
    // Case weibo 数据，需要保证 queryDataById 的条件和直接 query 的条件一致
    console.log(`queryWeiboBoxInfoById ${id}`)
    if(id === '1e16f656-8b01-11eb-927a'){
      const bbx = {
          "geo": [
            120.69833278656004,
            120.69211006164551,
            27.998607559462243,
            27.98989193447871
          ],
          "time": ["07:00:00", "08:30:00"]
      },
      stcubes = await bbxToCubeCellIds(bbx)
      return {
        id,
        bbx, 
        stcubes,
        scube:stcs2locas(stcubes)
      }
    }

    // 正常模式
    const weibo:WeiboItem | null  = await this.ctx.service.weibo.queryById(id)
    if(!weibo) return null
    const { time, lat, lng } = weibo;
    const cellId = await pointToCubeIndex({
      time,
      longitude: lng,
      latitude: lat,
    });

    // 数据点不在 STC config 范围内
    const bbx = await getCubeCellBbx(cellId);
    if (!bbx) return undefined;

    return {
      id,
      stcubes: [ cellId ],
      scube: stcs2locas([cellId]),
      bbx,
    };
  }
}
