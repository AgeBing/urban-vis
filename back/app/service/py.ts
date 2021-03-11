import { Service } from 'egg';
import { DS } from '@type/base';
import { queryRes } from '../controller/py';
import { WeiboItem } from '@type/weibo';
import { POIItem } from '@type/poi';
import { pointToCubeIndex, getCubeCellBbx } from '../utils/stc';
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

    // 1. 设置默认条件
    // const { geo, time } = ctx.request.body;
    // if (!geo && !time) { // 两个都为空时
    //   ctx.request.body = {
    //     geo: [ 120.707524, 120.623029, 28.027669, 27.988246 ],
    //     time: [ '01:06:33', '03:12:56' ],
    //   };
    //   this.logger.info('设置默认条件', ctx.request.body);
    // }


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
        bbx,
      };
    });

    return (await Promise.all(ps)).filter(x => x);
  }

}
