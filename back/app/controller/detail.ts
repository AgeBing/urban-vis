import { Controller } from 'egg';
import { DS as DataSource, Traj, BoolOperate, DS } from '@type/base';
import { STCData, STCDataItem } from '@type/cube';
import { DEFAULT_GEO, DEFAULT_TIME } from '../utils/stc'

/**
 * 查询数据的详细信息，返回给前端展示
 */
export default class DetailController extends Controller {
  /**
   * 查询时空数据： taxi、phone
   */
  public async queryTrajectoryData(){
    const { ctx } = this 
    // 设置默认条件
    const { geo , time, source, boolOp } = ctx.request.body;
    ctx.request.body = { geo, time, boolOp }
    this.logger.info(`查询数据源 ${source},条件`,ctx.request.body);
    // 按时空条件过滤时空立方体单元
    const cells = await ctx.service.stc.queryCellsInRange();
    const cellsId = cells.map(c => c.id.toString());
    // 拿着时空立方体单元去获取详细数据
    const stcDatas: STCData = await ctx.service.stc.getDatasInCells(cellsId, source);

    let trajs: Traj[] = [];
    trajs = stcDatas.map((d: STCDataItem) => ({
      id: d.id,
      points: d.data,
    }));

    this.logger.info(`查询数据源 ${source},返回数量 ${trajs.length}`);
    ctx.body = trajs;
  }

  public async queryWeibo(){
    const { ctx } = this
    this.logger.info(`查询数据源 ${DataSource['Weibo']},条件`,ctx.request.body);
    const weibos = await ctx.service.weibo.queryWeiboBySTC()
    this.logger.info(`查询数据源 ${DataSource['Weibo']},返回数量 ${weibos.length}`);
    ctx.body = weibos
  }

  public async queryPOI(){
    const { ctx } = this
    let { geo, keyword } = ctx.request.body;
    ctx.request.body = {
      // time 需要过滤掉时间属性
      geo,
      boolOp: BoolOperate['Union'],
      keyword
    };

    this.logger.info(`查询数据源 ${DataSource['Poi']},条件`,ctx.request.body);
    const pois = await ctx.service.poi.queryPOIBySTC()
    this.logger.info(`查询数据源 ${DataSource['Poi']},返回数量 ${pois.length}`);
    ctx.body = pois
  }

  public async transfer(){
    const { ctx } = this
    let { geo, time, keyword } = ctx.request.body
    if(!geo)  geo = DEFAULT_GEO
    if(!time) time = DEFAULT_TIME

    let source:DS
    let func
    switch(ctx.originalUrl){
      case '/taxi':
        source = DS['TaxiTraj']
        func = this.queryTrajectoryData
        break
      case '/phone':
        source = DS['MobileTraj']
        func = this.queryTrajectoryData
        break
      case '/weibo':
        source = DS['Weibo']
        func = this.queryWeibo
        break
      case '/poi':
        source = DS['Poi']
        func = this.queryPOI
        break
      default:
        source = DS['Poi']
        func = this.queryPOI
    }
    ctx.request.body = Object.assign(ctx.request.body,{
      source,keyword,geo,time
    })
    let res = await func.call(this)
    return res
  }
}
