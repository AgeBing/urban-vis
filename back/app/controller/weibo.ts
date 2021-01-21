import { Controller } from 'egg';

import { WeiboItem }  from '@type/weibo'


export default class WeiboController extends Controller {
  public async index() {
    const { ctx } = this;
    let res:WeiboItem[] = await ctx.service.weibo.list();
    ctx.body = res
  }
}
