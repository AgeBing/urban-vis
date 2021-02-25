import { Service } from 'egg';
import { TaxiTrajectory }  from '@type/taxi'
const fileUtil = require('../utils/file')

const PATH = '/Users/age/Desktop/code/urban-vis/data/data_in_use/taxi.json'


/**
 * Taxi Service
 */
export default class Taxi extends Service {

  /**
   * 获取出租车轨迹列表
   */
  public async list() : Promise<TaxiTrajectory []>{
    return await fileUtil.readJson(PATH)
  }

  /**
    查询逻辑：
    0. 初始化，load 时空立方体
    1. 传入时空条件，过滤得到符合条件的时空立方体id
    2. 根据时空立方体获取符合条件的轨迹段，合并成轨迹
  */
}
