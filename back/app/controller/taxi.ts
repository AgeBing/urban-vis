import { Controller } from 'egg';

import { Trajectory } from '@type/base'
import { TaxiTrajectory } from '@type/taxi'

export default class TaxiController extends Controller {
  public async index() {
    const { ctx } = this;
    let res = await ctx.service.taxi.list();
    ctx.body = res
  }

  public async stc(){
    const { ctx } = this;
    console.time('时空立方体范围查询时间: ')
    let cells = await ctx.service.stc.queryCells();
    console.log('时空立方体数量:', cells.length)
    console.time('范围内轨迹获取')
    let stcTrajs: Trajectory[] = await ctx.service.stc.trajectoryInCells(cells);
    console.timeEnd('时空立方体范围查询时间: ')
    console.time('范围内轨迹获取时间: ')
    let taxiTrajs: TaxiTrajectory[] = []
    stcTrajs.map(t => {
      t.segments.map((s, i) => {
        taxiTrajs.push({
          carNo: t.id + '-' + i,
          points: s
        })
      })
    })
    console.log('车辆数量: ',stcTrajs.length,'  轨迹数量: ', taxiTrajs.length)
    console.timeEnd('范围内轨迹获取时间: ')
    // stcTrajs.map(t => {
    //   taxiTrajs.push({
    //       carNo: t.id,
    //       points: t.segments.reduce((a,b)=> a.concat(b),[])
    //   })
    // })
    ctx.body = taxiTrajs
  }
}
