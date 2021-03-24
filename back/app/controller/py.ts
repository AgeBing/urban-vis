import { Controller } from 'egg';
import { DS, Traj } from '@type/base';
import { DEFAULT_GEO, DEFAULT_TIME } from '../utils/stc'
import { POIItem } from '@type/poi';
import { STCData, STCDataItem } from '@type/cube';
import { WeiboItem } from '@type/weibo';

/**
 * 字段格式定义
 */
export type queryResItem = {
  id: string, // 数据项 id
  bbx?: Bbx | null // 包围盒
  stcubes?: string[], // 该条数据轨迹传过的 cube cell id
  scube?: number[]  // 地理单元（与时空单元对应）
} | undefined | null;
export interface Bbx{
  time: string[],
  geo: number[]
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
    const { source, attr, keyword, step } = ctx.request.body;
    this.logger.info('Python 端数据查询...', ctx.request.body);

    // 条件转换
    if (attr) {
      let { geo, time } = attr;
      if(!geo)  geo = DEFAULT_GEO
      if(!time) time = DEFAULT_TIME
      ctx.request.body = { 
        geo, time,
        keyword, step
      }
    }else{
      ctx.request.body = {
        geo: DEFAULT_GEO,
        time: DEFAULT_TIME,
        keyword, step
      }
    }

    let res:queryRes = [];
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

    res = await this.InjectCaseData(res)
    this.logger.info('返回数据条数', res.length);
    ctx.body = res;
  }

  // 插入指定的 Case 数据
  // 需要确保 dataId 对应的数据在数据库里也有，让 queryByDataId 接口能查到
  public async InjectCaseData(res:queryRes){
    const { ctx } = this
    const { step } = ctx.request.body;

    console.log(`step: ${step}`)
    let injectData: queryResItem = null
    switch(step){
      case 0:  // 微博数据条件，用于查 taxi
        injectData = {
          id: '1e16f656-8b01-11eb-927a',
          bbx: {
            "geo": [
              120.69833278656004,
              120.69211006164551,
              27.998607559462243,
              27.98989193447871
            ],
            "time": ["08:00:00", "08:30:00"]
          },
          stcubes:['4962'],
          scube: [62]
        }
      break
      case 1:  // 微博数据条件，用于查 people
        injectData = {
          id: '1e16f656-8b01-11eb-927a',
          bbx: {
            "geo": [
              120.69833278656004,
              120.69211006164551,
              27.998607559462243,
              27.98989193447871
            ],
            "time": ["07:00:00", "08:30:00"]
          },
          stcubes:['4962'],
          scube: [62]
        }
      break
      case 2:  // 行人数据条件，用于查 weibo
      case 3:  // 行人数据条件，用于查 taxi
        injectData = {
          id: '460008794504403',
          bbx: {
            "geo": [120.698445, 120.678937, 28.003419, 27.989737],
            "time": ["07:00:00", "08:30:00"]
          },
          stcubes:['4962'],
          scube: [62]
        }
      break


      default:
        return res
    }
    res.unshift(injectData)
    this.logger.info(`插入 case 数据`, injectData)
    return res
  }


  public async queryByDataId(){
    const { ctx } = this
    const { originSource:os, targetSource:ts, id } = ctx.request.body
    this.logger.info('Python queryByDataId...', ctx.request.body);
    if(os === undefined || ts === undefined || id === undefined){
      this.logger.error('传参不完整！')
      ctx.body = []
      return
    }

    let res:queryRes = [],
        cellIds:string[] = []   

    cellIds = await this.queryCellsByDataId()
    if(cellIds.length == 0){
      ctx.body = []
      return
    }

    this.logger.info(`数据 ${id} 对应的 cell 数`, cellIds.length);

    // 2. 根据 cellIds 去数据源中获取数据，返回
    if(ts === DS['MobileTraj'] || ts === DS['TaxiTraj']){
      let dataIds = await ctx.service.stc.getIdsInCells(cellIds, ts)
      res = await ctx.service.stc.getSTCInfoOfDatas(dataIds, ts)
    }else if(ts === DS['Poi']){
      let pois:POIItem[] = await ctx.service.poi.queryPOIByCellsId(cellIds)
      console.log("pois len",pois.length)
      res = await ctx.service.py.pyQueryPoisInfo(pois)
    }else if(ts === DS['Weibo']){
      let weibos = await ctx.service.weibo.queryWeiboByCellsId(cellIds)
      console.log("weibo len",weibos.length)
      res = await ctx.service.py.pyQueryWeibosInfo(weibos)
    }
    this.logger.info('Python queryByDataId 返回数据条数', res.length);
    ctx.body = res
  }

  /**
   * 前端查询
   * 1. 传入一条数据数据id
   * 2. 获取这条数据经过的 cube cells
   * 3. 获取经过这些 cells 的某数据源的 详细数据
   */
  public async queryDetailByDataId(){
    const { ctx } = this
    const { originSource:os, targetSource:ts, id, boolFull = false } = ctx.request.body
    this.logger.info('Python queryByDataId...', ctx.request.body);
    if(os === undefined || ts === undefined || id === undefined){
      this.logger.error('传参不完整！')
      ctx.body = []
      return
    }

    let res: Traj[] | POIItem[] | WeiboItem[]= [],
        cellIds:string[] = []   

    cellIds = await this.queryCellsByDataId()
    if(cellIds.length == 0){
      ctx.body = []
      return
    }

    // 2. 根据 cellIds 去数据源中获取数据，返回
    if(ts === DS['MobileTraj'] || ts === DS['TaxiTraj']){
        let stcDatas: STCData  = []  
        if(!boolFull){
          stcDatas = await ctx.service.stc.getDatasInCells(cellIds, ts);
        }else{
          stcDatas = await ctx.service.stc.getFullDatasInCells(cellIds, ts);
        }
        let trajs: Traj[] = [];
        trajs = stcDatas.map((d: STCDataItem) => ({
          id: d.id,
          points: d.data,
        }));
        res = trajs
    }else if(ts === DS['Poi']){
      let pois:POIItem[] = await ctx.service.poi.queryPOIByCellsId(cellIds)
      console.log("pois len",pois.length)
      res = pois
    }else if(ts === DS['Weibo']){
      let weibos:WeiboItem[] = await ctx.service.weibo.queryWeiboByCellsId(cellIds)
      console.log("weibo len",weibos.length)
      res = weibos
    }
    this.logger.info('Python queryDetailByDataId 返回数据条数', res.length);
    ctx.body = res
  }

  // 获取某条数据对应的条件是啥
  public async queryInfoByDataId(){
    const { ctx } = this
    const { source:os, ids } = ctx.request.body
    let infos:queryResItem[] = []
    // 1. 通过 mode 和 id 获取数据查询条件，返回 cellIds 
    if(os == DS['MobileTraj'] || os === DS['TaxiTraj']){
      // 1.1 数据转条件
      infos = await ctx.service.stc.getSTCInfoOfDatas(ids, os)
    }else if(os === DS['Poi']){
      infos = await Promise.all(ids.map(async function(id:string):Promise<queryResItem>{
        return await ctx.service.py.queryPOIBoxInfoById(id)
      }))
    }else if(os === DS['Weibo']){
      infos = await Promise.all(ids.map(async function(id:string):Promise<queryResItem>{
        return await ctx.service.py.queryWeiboBoxInfoById(id)
      }))
    }
    ctx.body = infos
  }

  private async queryCellsByDataId(){
    const { ctx } = this
    const { originSource:os, id, mode } = ctx.request.body
    this.logger.info('Python queryCellsByDataId...', ctx.request.body);

    let info:queryResItem|null,
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
      return []
    }

      // 1.2 条件转cell
    cellIds = await ctx.service.stc.getCellsFromInfo(info,mode)
    if(cellIds.length === 0){
      this.logger.error(`无对应 cell 单元`)
      return []
    }
    this.logger.info('QueryCellsByDataId Cells Length:', cellIds.length);
    return cellIds
  }

  public async mockReq(){
    let res:queryRes = [],
        req
    while (res.length <= 10 || res.length >= 100) {
      req = await this.makeAvaliableReq()
      const { attr, source } = req
      this.ctx.request.body = {
        geo: attr?.geo,
        time: attr?.time
      }
      if(source === DS.MobileTraj){
        res = await this.ctx.service.py.pyQuery(source)
      }else if(source === DS.Weibo){
        res = await this.ctx.service.py.pyQueryWeibo()
      }
      console.log(res.length)
    }
    this.ctx.body = req
  }

  private async makeAvaliableReq(){
    let sources = [DS.MobileTraj, DS.Weibo],
        source = sources[Math.floor(Math.random() * sources.length)]
    let req 
    if(source === DS.MobileTraj){
      let taxisId = await this.ctx.service.stc.getDataSetIds(source)
      let randTaxiId = taxisId[Math.floor(Math.random()*taxisId.length)]
      let queryRes:queryRes = await this.ctx.service.stc.getSTCInfoOfDatas([randTaxiId], source)
      let taxiInfo:queryResItem = queryRes[0]
      req = {
        source,
        attr: taxiInfo?.bbx
      }
    }else if(source === DS.Weibo){
      let weibos = await this.ctx.service.weibo.list()
      let weiboId = weibos[Math.floor(Math.random()*weibos.length)].id
      let weiboInfo:queryResItem = await this.ctx.service.py.queryWeiboBoxInfoById(weiboId)
      req = {
        source,
        attr: weiboInfo?.bbx
      }
    }
    return req
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
