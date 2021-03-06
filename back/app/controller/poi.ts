import { Controller } from 'egg';
export default class POIController extends Controller {
  public async index() {
    const { ctx } = this;
    this.logger.info('获取POI数据...')
    ctx.body = await ctx.service.poi.list()
  }

  public async query() {
    const { ctx } = this;
    this.logger.info('查询POI数据...', ctx.request.body)
    let { geo, keyword } = ctx.request.body
    ctx.body = await ctx.service.poi.list(geo, keyword)
  }
}
