import { Controller } from 'egg';

/**
 * 字段格式定义
 */
export interface queryResItem{
  id: string,  // 数据项 id
  stcubes: string[], // 该条数据轨迹传过的 cube cell id
  bbx: Bbx  // 包围盒
}
export interface Bbx{
  timeRange: BbxTimeRange,
  areaRange: BbxAreaRange
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
export type queryRes = queryResItem[]

// 数据源类型 DataSource
export enum DS{  
  mobileTraj = "mobileTraj",
  taxiTraj = "taxiTraj",
  weibo = "weibo",
  poi = "poi"
}



/**
 * Py 后端接口的处理逻辑 
 */
export default class PyController extends Controller {
  public async query(){
    const { ctx } = this;
    let { source } = ctx.request.body
    this.logger.info('Python 端数据查询...')

    source = DS.taxiTraj

    ctx.body = await Funcfactory(
      {
        [DS.taxiTraj] : this.service.taxi.pyQuery
      },
      source,
      this
    )
  }

  public async getOneData() {
    const { ctx } = this;
    this.logger.info('获取单条特定数据...')
    let { source, id } = ctx.request.body

    ctx.body = await Funcfactory(
      {
        [DS.taxiTraj] : this.service.taxi.getOneTaxi.bind(id)
      },
      source,
      this
    )
  }

  public async isOneDataInBBox() {
    const { ctx } = this;
    this.logger.info('获取数据是否在范围内...')
    let { source, id, bbox } = ctx.request.body
    
    ctx.body = await Funcfactory(
      {
        [DS.taxiTraj] : this.service.taxi.isOneTaxiInBbox.bind(id, bbox)
      },
      source,
      this
    )
  }
}


/**
 * 少写点 switch 语句
 */
interface Factory {
  [DS.mobileTraj]?: Function,
  [DS.taxiTraj]?: Function,
  [DS.poi]?: Function,
  [DS.weibo]?: Function
}
const Funcfactory = async (config:Factory, source: DS, self) => {
  // let { source: s } = self.ctx.request.body
  let res
  switch(source){
    case DS['taxiTraj']:
      res = await config['taxiTraj']?.call(self)
      break
    case DS['mobileTraj']:
      res = await config['mobileTraj']?.call(self)
      break
    case DS['poi']:
      res = await config['poi']?.call(self)
      break
    case DS['weibo']:
      res = await config['weibo']?.call(self)
      break
    default:
      throw Error('找不到方法')
  }
  return res
}
