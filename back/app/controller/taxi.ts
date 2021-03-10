import { Controller } from 'egg';
import { DS as DataSource, Traj } from '@type/base';
import { STCData, STCDataItem } from '@type/cube';
import { DEFAULT_GEO, DEFAULT_TIME } from '../utils/stc'

export default class TaxiController extends Controller {
  public async query() {
    const { ctx } = this;
    this.logger.info('获取出租车轨迹数据...');
    this.logger.info('输入条件: ', ctx.request.body);

    // 设置默认条件
    const { geo = DEFAULT_GEO, time = DEFAULT_TIME } = ctx.request.body;
    ctx.request.body = { geo, time }


    const cells = await ctx.service.stc.queryCellsInRange();
    const cellsId = cells.map(c => c.id.toString());
    const stcDatas: STCData = await ctx.service.stc.getDatasInCells(cellsId, DataSource.TaxiTraj);

    let taxiTrajs: Traj[] = [];
    taxiTrajs = stcDatas.map((d: STCDataItem) => ({
      id: d.id,
      points: d.data,
    }));

    this.logger.info('taxi 轨迹数量: ', taxiTrajs.length);
    ctx.body = taxiTrajs;
  }
}
