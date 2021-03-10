import { Service } from 'egg';
import { WeiboItem } from '@type/weibo';
import { SpaceTimeParam, Point } from '@type/base';
import { isPointWithinRect, isPointWithinInterval } from '../utils/math';

const fileUtil = require('../utils/file');
const PATH = 'weibo.json';

/**
 * Weibo Service
 */
export default class Weibo extends Service {

  /**
   * 获取微博数据列表
   */
  public async list() : Promise<WeiboItem []> {
    return await fileUtil.readJson(PATH);
  }

  /**
   * 按条件查询
   */
  public async query(param: SpaceTimeParam | null, keyword: string| null) : Promise<WeiboItem []> {
    console.time('Select Weibo List');

    const list: WeiboItem[] = await this.list();
    if (!param && !keyword) return list;

    let filterList: WeiboItem[] = list;
    if (param) {
      filterList = filterList.filter((weibo: WeiboItem) => {
        let bool = true;
        const point:Point = {
          latitude: weibo.lat,
          longitude: weibo.lng,
          time: weibo.time,
        };

        if (param.geo) bool = bool && isPointWithinRect(point, param.geo);
        if (param.time) bool = bool && isPointWithinInterval(point, param.time);

        return bool;
      });
    }
    if (keyword) {
      filterList = filterList.filter((weibo:WeiboItem) => {
        const { name, content } = weibo;
        return (content.indexOf(keyword) != -1 || name.indexOf(keyword) != -1);
      });
    }
    this.logger.info('Query weibo Length', filterList.length);
    console.timeEnd('Select Weibo List');
    return filterList;
  }
}
