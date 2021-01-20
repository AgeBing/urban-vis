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
}
