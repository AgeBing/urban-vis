import { Controller } from 'egg';
import { WeiboItem } from '@type/weibo';
import { SpaceTimeParam } from '@type/base';
import { DEFAULT_GEO, DEFAULT_TIME } from '../utils/stc'

export default class WeiboController extends Controller {

  public async query() {
    const { ctx } = this;
    this.logger.info('查询微博数据...');
    // 设置默认条件
    const { geo = DEFAULT_GEO, time = DEFAULT_TIME, keyword } = ctx.request.body;
    let param: SpaceTimeParam | null = null;
    if (geo || time) {
      param = {
        geo, time,
      };
    }
    const res:WeiboItem[] = await ctx.service.weibo.query(param, keyword);
    console.log(res.length);
    ctx.body = res;
  }
}
