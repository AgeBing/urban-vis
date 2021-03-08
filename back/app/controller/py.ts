import { Controller } from 'egg';
import { DS } from '@type/base'
/**
 * 字段格式定义
 */
export interface queryResItem{
  id: string,  // 数据项 id
  stcubes?: string[], // 该条数据轨迹传过的 cube cell id
  bbx?: Bbx  // 包围盒
}
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
export type queryRes = queryResItem[]

const staxi = Symbol();
const sphone = Symbol();
const spoi = Symbol();
const sweibo = Symbol();


/**
 * 给 Py 后端接口的处理逻辑 
 */
export default class PyController extends Controller {
  public async query(){
    const { ctx } = this;
    let { source } = ctx.request.body
    this.logger.info('Python 端数据查询...')
    this.logger.info('Python 端数据查询...', ctx.request.body)
    
    let res = []
    res = await Funcfactory(
      {
        [staxi] : this.service.py.pyQuery.bind(this,source),
        [sphone] : this.service.py.pyQuery.bind(this,source),
        [sweibo]: this.service.py.pyQueryWeibo.bind(this),
        [spoi]: this.service.py.pyQueryPOI.bind(this)
      },
      source,
      this
    )

    if(!res) return []

    this.logger.info('返回数据条数', res.length)
    res = res.slice(0, 100)
    this.logger.info('删减后数据条数', res.length)
    ctx.body = res
  }

  public async getOneData() {
    const { ctx } = this;
    const self = this
    this.logger.info('获取单条特定数据...')
    let { source } = ctx.request.body

    ctx.body = await Funcfactory(
      {
        // [staxi] : this.service.taxi.getOneTaxi.bind(id)
      },
      source,
      self
    )
  }

  public async isOneDataInBBox() {
    const { ctx } = this;
    this.logger.info('获取数据是否在范围内...')
    let { source } = ctx.request.body
    
    ctx.body = await Funcfactory(
      {
        // [staxi] : this.service.taxi.isOneTaxiInBbox.bind(id, bbox)
      },
      source, 
      this
    )
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
  let res = []
  switch(source){
    case DS['TaxiTraj']:
      res = await config[staxi]?.call(self)
      break
    case DS['MobileTraj']:
      res = await config[sphone]?.call(self)
      break
    case DS['Poi']:
      res = await config[spoi]?.call(self)
      break
    case DS['Weibo']:
      res = await config[sweibo]?.call(self)
      break
    default:
      console.log('找不到方法')
      // throw Error('找不到方法')
      return []
  }
  return res
}
