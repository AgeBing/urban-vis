import { Controller } from 'egg';
// import { POIItem }  from '@type/poi'

export default class POIController extends Controller {
  public async index() {
    const { ctx } = this;
    this.logger.info('获取POI数据...')
    ctx.body = await ctx.service.poi.list()
  }
  public async query() {
    const { ctx } = this;
    this.logger.info('查询POI数据...', ctx.request.body)
    let { geo } = ctx.request.body
    console.log(geo)
    if(geo && geo.length === 4){
      geo = {
        longitude: [geo[1], geo[0]],
        latitude: [geo[3], geo[2]]
      }
    }
    ctx.body = await ctx.service.poi.list(geo)
  }
}
