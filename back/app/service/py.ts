import { Service } from 'egg';
import { DS, SpaceTimeParam } from '@type/base'
import { queryRes } from '../controller/py'
import { WeiboItem } from '@type/weibo'
import { POIItem }  from '@type/poi'
import { pointToCubeIndex, getCubeCellBbx } from '../utils/stc'
import { geoToCubeIndex } from '../utils/stc'


export default class Py extends Service {

  /**
   * Python 端查询
   */
  public pyQuery = async(source:DS) => {
    const { ctx }  = this; 
    this.logger.info('py 查询时空数据...')
    this.logger.info('输入条件: ', ctx.request.body)

    // 0. 设置默认条件
    let { geo, time } = ctx.request.body
    if(!geo && !time){  // 两个都为空时
      ctx.request.body = {
        "geo": [120.707524, 120.623029, 28.027669, 27.988246],
        "time": ["01:06:33", "03:12:56"],
        // "boolOp": 1
      }
      this.logger.info('设置默认条件', ctx.request.body)
    }

    const stcService = ctx.service.stc
    let cells = await stcService.queryCellsInRange();
    const cellsId = cells.map(c => c.id.toString())
    let trajsIds:string[] = await stcService.getIdsInCells(cellsId, source)
    let res:queryRes = await stcService.getSTCInfoOfDatas(trajsIds, source)
    
    const resLength = Array.isArray(res) && res.length || 0

    this.logger.info('cellsId: ', cellsId.length, ' trajsIds: ', trajsIds.length, '  res:',  resLength)

    if(resLength == 0){
      this.logger.error('时空过滤结果为空！！', ctx.request.body)
      return []
    }
    return res;
  }

  
  public async pyQueryWeibo():Promise<queryRes>{
    const { ctx }  = this; 
    this.logger.info('py 查询 weibo 数据...')
    this.logger.info('输入条件: ', ctx.request.body)

    // 0. 设置默认条件
    let { geo, time } = ctx.request.body
    // if(!geo || !time){
    //   ctx.request.body = {
    //     "geo": [120.707524, 120.623029, 28.027669, 27.988246],
    //     "time": ["01:06:33", "03:12:56"],
    //     // "boolOp": 1
    //   }
    // }

    const param : SpaceTimeParam = { geo, time }

    const weibos:WeiboItem[] = await this.service.weibo.query(param, null)

    const ps = weibos.map(async (weibo:WeiboItem) => {
      const { time, lat, lng, id } = weibo
      const cubeId = await pointToCubeIndex({ 
        time, longitude:lng, latitude:lat
      })

      const bbx = await getCubeCellBbx(cubeId)
      if(!bbx) return undefined

      return {
        id,
        stcubes: [cubeId],
        bbx
      }
    })

    return (await Promise.all(ps)).filter(x => x)
  }


  public async pyQueryPOI():Promise<queryRes>{
    const { ctx }  = this; 
    this.logger.info('py 查询 poi 数据...')
    // this.logger.info('输入条件: ', ctx.request.body)

    // 0. 设置默认条件
    // let { geo, time } = ctx.request.body
    let { geo } = ctx.request.body
    // if(!geo || !time){
    //   ctx.request.body = {
    //     "geo": [120.707524, 120.623029, 28.027669, 27.988246],
    //     "time": ["01:06:33", "03:12:56"],
    //     // "boolOp": 1
    //   }
    // }

    const pois:POIItem[] = await this.service.poi.list(geo, null)

    const ps = pois.map(async (poi:POIItem) => {
      const { longitude, latitude, id } = poi

      const cubeId = (await geoToCubeIndex({ longitude, latitude})).toString()
      const bbx = await getCubeCellBbx(cubeId.toString())

      if(!bbx) return undefined
      /**
          cube 第 0 层， 时间为 0
           "timeRange": [
                "00:00:00",
                "00:10:00"
            ],
       */
      return {
        id,
        stcubes: [cubeId],
        bbx
      }
    })

    return (await Promise.all(ps)).filter(x => x)
  }

}