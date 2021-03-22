import { Service } from 'egg';
import { WeiboItem } from '@type/weibo';
import { SpaceTimeParam, Point } from '@type/base';
import { isPointWithinRect, isPointWithinInterval } from '../utils/math';
import { pointToCubeIndex} from '../utils/stc';

// const fileUtil = require('../utils/file');
// const PATH = 'weibo.json';

/**
 * Weibo Service
 */
export default class Weibo extends Service {

  /**
   * 获取微博数据列表
   */
  public async list() : Promise<WeiboItem []> {
    // return await fileUtil.readJson(PATH);
    const { app } = this
   const weibos = await app.mysql.select('weibo');
    return weibos
  }

  public async queryByKeyword(keyword:string):Promise<WeiboItem []> {
    let filterList:WeiboItem[] = await this.list()
    if(keyword){
      filterList = filterList.filter((weibo:WeiboItem) => {
        const { name, content } = weibo;
        return (content.indexOf(keyword) != -1 || name.indexOf(keyword) != -1);
      });
    }
    return filterList
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


  public async queryWeiboBySTC():Promise<WeiboItem[]> {
    const { ctx } = this;
    const { keyword } = ctx.request.body;

    // 1. 首先将时空条件转换成立方体单元条件
    //   1.1 得到符合查询条件的 立方体单元 列表
    const stcService = ctx.service.stc;
    const cells = await stcService.queryCellsInRange();
    const cellsId = cells.map(c => c.id.toString());

    // 2. 获取数据列表
    const weibos:WeiboItem[] = await this.queryByKeyword(keyword);
    this.logger.info('整体 weibo 数据量', weibos.length);

    // 过滤是否在时空立方体内
    const weiboInRange:WeiboItem[] = []
    const ps = weibos.map(async (weibo:WeiboItem) => {
      const { time, lat, lng } = weibo;
      const cellId = await pointToCubeIndex({
        time,
        longitude: lng,
        latitude: lat,
      });
      if (cellsId.indexOf(cellId) !== -1) {
        weiboInRange.push(weibo)
      }
    })
    await Promise.all(ps)
    return weiboInRange
  }

  public async queryWeiboByCellsId(cellsId:string[], keyword = ''):Promise<WeiboItem[]> {

    // 获取数据列表
    const weibos:WeiboItem[] = await this.queryByKeyword(keyword);
    this.logger.info('传入 cells 数量', cellsId.length);
    this.logger.info('整体 weibo 数据量', weibos.length);
    // console.log(JSON.stringify(cellsId))
    // 过滤是否在时空立方体内
    const weiboInRange:WeiboItem[] = []
    const ps = weibos.map(async (weibo:WeiboItem) => {
      const { time, lat, lng } = weibo;
      let cellId = await pointToCubeIndex({
        time,
        longitude: lng,
        latitude: lat,
      });

      if (cellsId.indexOf(cellId.toString()) !== -1) {
        weiboInRange.push(weibo)
      }

    })
    this.logger.info('在 cells 里的 weibo 数据量', weiboInRange.length);
    await Promise.all(ps)
    return weiboInRange
  }

  public async queryById(id:string):Promise<WeiboItem|null>{
    const weibos = await this.list()
    for(let i = 0;i < weibos.length;i++){
      if(weibos[i].id === id)
        return weibos[i]
    }
    return null
  }
}
