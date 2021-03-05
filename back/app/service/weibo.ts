import { Service } from 'egg';
import { WeiboItem }  from '@type/weibo'
import { SpaceTimeParam, Point } from '@type/base'
import { isPointWithinRect, isPointWithinInterval } from '../utils/math';

const fileUtil = require('../utils/file')
const PATH = 'weibo.json'

/**
 * Weibo Service
 */
export default class Weibo extends Service {

  /**
   * 获取微博数据列表
   */
  public async list() : Promise<WeiboItem []>{
    return await fileUtil.readJson(PATH)
  }

  /**
   * 按条件查询
   */
  public async query(param: SpaceTimeParam | null) : Promise<WeiboItem []>{
    const list: WeiboItem[] = await this.list()
    if(!param) return list
    return list.filter((weibo: WeiboItem) => {
      let bool = true
      let point:Point = {
        latitude: weibo.lat,
        longitude: weibo.lng,
        time: weibo.time
      }

      if(param.geo) bool = bool && isPointWithinRect(point, param.geo)
      if(param.time) bool = bool && isPointWithinInterval(point, param.time)

      return bool
    })
  }
}
