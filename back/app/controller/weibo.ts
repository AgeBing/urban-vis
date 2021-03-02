import { Controller } from 'egg';

import { WeiboItem }  from '@type/weibo'


export default class WeiboController extends Controller {
  public async index() {
    const { ctx } = this;
    this.logger.info('获取微博数据...')
    let res:WeiboItem[] = await ctx.service.weibo.list();
    ctx.body = res
  }
}
