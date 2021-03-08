import { Service } from 'egg';
import { DS } from '@type/base'
import { queryRes } from '../controller/py'

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
    if(!geo || !time){
      ctx.request.body = {
        "geo": [120.707524, 120.623029, 28.027669, 27.988246],
        "time": ["01:06:33", "03:12:56"],
        // "boolOp": 1
      }
    }

    const stcService = this.service.stc
    let cells = await stcService.queryCellsInRange();
    const cellsId = cells.map(c => c.id.toString())
    let trajsIds:string[] = await stcService.getIdsInCells(cellsId, source)
    let res:queryRes = await stcService.getSTCInfoOfDatas(trajsIds, source)
    return res;
  }

}