import { Controller } from 'egg';
import { DS } from '@type/base';
import { DEFAULT_GEO, DEFAULT_TIME } from '../utils/stc'
import { POIItem } from '@type/poi';
/**
 * 字段格式定义
 */
export type queryResItem = {
  id: string, // 数据项 id
  stcubes?: string[], // 该条数据轨迹传过的 cube cell id
  bbx?: Bbx | null // 包围盒
} | undefined | null;
export interface Bbx{
  timeRange: string[],
  areaRange: number[]
}
export interface BbxTimeRange{
  min: string,
  max: string
}
export interface BbxAreaRange{
  minLat: number,
  maxLat: number,
  minLng: number,
  maxLng: number
}
export type queryRes = queryResItem[];

const staxi = Symbol();
const sphone = Symbol();
const spoi = Symbol();
const sweibo = Symbol();


/**
 * 给 Py 后端接口的处理逻辑
 */
export default class PyController extends Controller {
  public async query() {
    const { ctx } = this;
    const { source, attr, keyword } = ctx.request.body;
    this.logger.info('Python 端数据查询...', ctx.request.body);

    // 条件转换
    if (attr) {
      let { S: geo, T: time } = attr;
      if(!geo)  geo = DEFAULT_GEO
      if(!time) time = DEFAULT_TIME
      ctx.request.body = { geo, time, keyword }
    }else{
      ctx.request.body = {
        geo: DEFAULT_GEO,
        time: DEFAULT_TIME,
        keyword
      }
    }

    let res = [];
    res = await Funcfactory(
      {
        [staxi]: this.service.py.pyQuery.bind(this, source),
        [sphone]: this.service.py.pyQuery.bind(this, source),
        [sweibo]: this.service.py.pyQueryWeibo.bind(this),
        [spoi]: this.service.py.pyQueryPOI.bind(this),
      },
      source,
      this,
    );

    if (!res) return [];

    this.logger.info('返回数据条数', res.length);
    // 返回全部轨迹数据
    // res = res.slice(0, 100)
    // this.logger.info('删减后数据条数', res.length);
    ctx.body = res;
  }

  public async queryByDataId(){
    const { ctx } = this
    const { originSource:os, targetSource:ts, id, mode } = ctx.request.body
    this.logger.info('Python queryByDataId...', ctx.request.body);
    if(os === undefined || ts === undefined || id === undefined){
      this.logger.error('传参不完整！')
      ctx.body = []
      return
    }

    let res:queryRes = [],
        info:queryResItem|null,
        cellIds:string[] = []    
    
    // 1. 通过 mode 和 id 获取数据查询条件，返回 cellIds 
    if(os == DS['MobileTraj'] || os === DS['TaxiTraj']){
      // 1.1 数据转条件
      let infos = await ctx.service.stc.getSTCInfoOfDatas([id], os)
      if(infos.length < 1){
        info = null
      }else{
        info = infos[0]
      }
    }else if(os === DS['Poi']){
      info = await ctx.service.py.queryPOIBoxInfoById(id)
    }else if(os === DS['Weibo']){
      info = await ctx.service.py.queryWeiboBoxInfoById(id)
    }

    if(!info){
      this.logger.error(`无 STC 信息！`)
      ctx.body = []
      return
    }

      // 1.2 条件转cell
    cellIds = await ctx.service.stc.getCellsFromInfo(info,mode)
    if(cellIds.length === 0){
      this.logger.error(`无对应 cell 单元`)
      ctx.body = []
      return
    }
    
    // 2. 根据 cellIds 去数据源中获取数据，返回
    if(ts === DS['MobileTraj'] || ts === DS['TaxiTraj']){
      let dataIds = await ctx.service.stc.getIdsInCells(cellIds, ts)
      res = await ctx.service.stc.getSTCInfoOfDatas(dataIds, ts)
    }else if(ts === DS['Poi']){
      let pois:POIItem[] = await ctx.service.poi.queryPOIByCellsId(cellIds)
      res = await ctx.service.py.pyQueryPoisInfo(pois)
    }else if(ts === DS['Weibo']){
      let weibos = await ctx.service.weibo.queryWeiboByCellsId(cellIds)
      res = await ctx.service.py.pyQueryWeibosInfo(weibos)
    }
    this.logger.info('Python queryByDataId 返回数据条数', res.length);
    ctx.body = res
  }

}


/**
 * 可以 少写点 switch 语句
 */
interface Factory {
  [staxi]?: Function,
  [sphone]?: Function,
  [spoi]?: Function,
  [sweibo]?: Function
}
const Funcfactory = async (config:Factory, source: DS, self) => {
  // let { source: s } = self.ctx.request.body
  let res = [];
  switch (source) {
    case DS.TaxiTraj:
      res = await config[staxi]?.call(self);
      break;
    case DS.MobileTraj:
      res = await config[sphone]?.call(self);
      break;
    case DS.Poi:
      res = await config[spoi]?.call(self);
      break;
    case DS.Weibo:
      res = await config[sweibo]?.call(self);
      break;
    default:
      console.log('找不到方法');
      // throw Error('找不到方法')
      return [];
  }
  return res;
};
