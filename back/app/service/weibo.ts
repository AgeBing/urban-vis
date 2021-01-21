import { Service } from 'egg';
import { WeiboItem }  from '@type/weibo'
const fileUtil = require('../utils/file')

const PATH = '/Users/age/Desktop/code/urban-vis/data/data_in_use/weibo.json'

/**
 * Weibo Service
 */
export default class Weibo extends Service {

  /**
   * 获取微博数据列表
   */
  public async list() : Promise<WeiboItem []>{
    return await fileUtil.readJson(PATH)
  }
}
