import { Controller } from 'egg';
import { DS } from '@type/base';
import { DEFAULT_GEO, DEFAULT_TIME } from '../utils/stc'
/**
 * 字段格式定义
 */
export type queryResItem = {
  id: string, // 数据项 id
  stcubes?: string[], // 该条数据轨迹传过的 cube cell id
  bbx?: Bbx | null // 包围盒
} | undefined;
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
    const { source, attr } = ctx.request.body;
    this.logger.info('Python 端数据查询...', ctx.request.body);

    // 条件转换
    if (attr) {
      let { S: geo, T: time } = attr;
      if(!geo)  geo = DEFAULT_GEO
      if(!time) time = DEFAULT_TIME
      ctx.request.body = { geo, time }
    }else{
      ctx.request.body = {
        geo: DEFAULT_GEO,
        time: DEFAULT_TIME
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
    this.logger.info('删减后数据条数', res.length);
    ctx.body = res;
  }

  // // 原先条件的转发
  public async transfer(){
    const { ctx } = this
    const { geo, time } = ctx.request.body
    let source:DS
    switch(ctx.originalUrl){
      case '/taxi':
        source = DS['TaxiTraj']
        break
      case '/phone':
        source = DS['MobileTraj']
        break
      case '/weibo':
        source = DS['Weibo']
        break
      case '/poi':
        source = DS['Poi']
        break
      default:
        source = DS['Poi']
    }
    ctx.request.body = {
      source,
      attr: { S:geo, T:time }
    }
    await this.query()
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
