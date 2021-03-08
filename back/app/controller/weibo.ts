import { Controller } from 'egg';
import { WeiboItem }  from '@type/weibo'
import { SpaceTimeParam } from '@type/base'


export default class WeiboController extends Controller {
  public async index() {
    const { ctx } = this;
    this.logger.info('获取微博数据...')
    let res:WeiboItem[] = await ctx.service.weibo.list();
    ctx.body = res
  }
  public async query() {
    const { ctx } = this;
    this.logger.info('查询微博数据...')
    let { geo, time, keyword } = ctx.request.body
    let param: SpaceTimeParam | null = null
    if(geo || time){
      param = {
        geo, time
      }
    }
    // param = {
    //   "geo": [120.707524, 120.623029, 28.027669, 27.988246],
    //     "time": ["01:06:33", "03:12:56"],
    // }
    let res:WeiboItem[] = await ctx.service.weibo.query(param, keyword);
    console.log(res.length)
    ctx.body = res
  }
}
