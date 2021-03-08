import { Controller } from 'egg';
import { DS as DataSource, Traj } from '@type/base'
import { STCData, STCDataItem } from '@type/cube'

export default class PhoneController extends Controller {
  public async index() {
    const { ctx } = this;
    let res = await ctx.service.phone.list();
    ctx.body = res
  }
  public async query(){
    const { ctx }  = this; 
    this.logger.info('查询手机基站数据...')
    this.logger.info('输入条件: ', ctx.request.body)     

    // 设置默认条件
    let { geo, time } = ctx.request.body
    if(!geo && !time){
      ctx.request.body= {
        "geo": [120.907524, 120.023029, 28.527669, 27.688246],
        "time": ["06:06:33", "10:12:56"],
      }
    }

    let cells = await ctx.service.stc.queryCellsInRange();
    const cellsId = cells.map(c => c.id.toString())
    let stcDatas: STCData =  await ctx.service.stc.getDatasInCells(cellsId, DataSource['MobileTraj'])
    
    let taxiTrajs: Traj[] = []
    taxiTrajs = stcDatas.map((d: STCDataItem) => ({
      'id': d['id'],
      'points': d['data']
    }))

    this.logger.info('手机轨迹数量: ', taxiTrajs.length)
    ctx.body = taxiTrajs
  }
}
