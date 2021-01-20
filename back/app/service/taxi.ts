import { Service } from 'egg';

const fileUtil = require('../utils/file')


// interface TaxiTrajectory {
//   carNo: string;
//   sliceCount: number;
//   points: Point[];
// }

interface TaxiPoint {
  longitude: number;
  latitude: string;
  time: string;
}
/**
 * Taxi Service
 */
export default class Taxi extends Service {

  /**
   * 获取一辆车的轨迹点
   */
  public async points() : Promise<TaxiPoint[]>{
    let path: string = '/Users/age/Documents/毕业设计/thesis/project/data/浙C02668.LOG.json';
    let points: TaxiPoint[]  = await fileUtil.readJson(path);
    return points
  }  
}
