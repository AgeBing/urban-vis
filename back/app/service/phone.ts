import { Service } from 'egg';
import { PhoneTrajectory }  from '@type/phone'
const fileUtil = require('../utils/file')

const PATH = '/Users/age/Desktop/code/urban-vis/data/data_in_use/phone.json'


/**
 * Phone Service
 */
export default class Phone extends Service {

  /**
   * 获取手机行人轨迹列表
   */
  public async list() : Promise<PhoneTrajectory []>{
    return await fileUtil.readJson(PATH)
  }
}

