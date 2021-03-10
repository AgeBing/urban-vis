import { Controller } from 'egg';
import * as moment from 'moment';
import { Point, Trajectory } from '@type/base';
import { PhoneTrajectory } from '@type/phone';
import { WeiboItem } from '@type/weibo';
import { POIItem } from '@type/poi';
const fileUtil = require('../utils/file');


/**
 * 用于 VAUD CASE
 */
export default class TaxiController extends Controller {
  public async index() {
    // const { ctx } = this;
    // let res = await ctx.service.taxi.list();
    // ctx.body = res
  }

  public async weibo() {
    const { ctx } = this;
    this.logger.info('获取手机丢失的微博数据...');
    let weibos = await fileUtil.readJson('weibo.json');

    weibos = weibos.filter(w => (w.name == '红唇'));
    console.log(weibos);
    ctx.body = weibos;
  }
  public async weiboAll() {
    const { ctx } = this;
    this.logger.info('获取手机丢失的微博数据...');
    const weibos:WeiboItem[] = await fileUtil.readJson('weibo.json');
    ctx.body = weibos.slice(0, Math.floor(Math.random() * 300));
  }


  public async poi() {
    const { ctx } = this;
    this.logger.info('获取POI数据...');
    const pois:POIItem[] = [
      {
        id: '1',
        name: '百花苑',
        type: '',
        longitude: 120.64501953125,
        latitude: 28.007713317871094,
      },
      {
        id: '2',
        name: '松台广场',
        type: '',
        longitude: 120.65054321289062,
        latitude: 28.01406478881836,
      },
    ];
    ctx.body = pois;
  }


  public async taxi() {
    const { ctx } = this;
    this.logger.info('获取出租车数据...');
    const car1 = await fileUtil.readJson('taxi_浙CT0230.LOG.json');
    // let car2 = await fileUtil.readJson('taxi_浙CT1168.LOG.json')

    const filterInTime = car => {
      // const start = moment("2014-01-01 00:30:55")
      // const end = moment("2014-01-01 02:30:55")
      const start = moment('2014-01-01 00:00:55');
      const end = moment('2014-01-01 23:59:55');
      car.points = car.points.filter(p => {
        const m = moment(p.time);
        return (m.isAfter(start) && m.isBefore(end));
      });
    };

    filterInTime(car1);
    // filterInTime(car2)

    ctx.body = [
      car1,
      // car2
    ];
  }

  public async taxiPhone() {
    const { ctx } = this;
    this.logger.info('获取出租车司机的手机数据...');
    const phone:Trajectory = await fileUtil.readJson('phone_460022584127733.json');

    // 分段的形式
    // let trajs: PhoneTrajectory[] = phone.segments.map((s,i) => ({
    //   IMEI: phone['id'] + '-' + i,
    //   points: s
    // }))
    const points:Point[] = phone.segments.reduce((a, b) => a.concat(b), []);

    // console.log(bezierPoints)
    // 将分段连成一条线
    const trajs: PhoneTrajectory[] = [{
      IMEI: phone.id,
      points,
    }];
    ctx.body = trajs;
  }
}

// const smoothPoints = (points: Point[]) => {
//   let bezierPoints:Point[] = []
//   for(let i = 1; i < points.length - 1;i++){
//     let p1 = points[i - 1],
//         p2 = points[i]
//         // n = 2
//     let a = [p1['longitude'], p1['latitude']]
//     let b = [p2['longitude'], p2['latitude']]
//     let c = [ (a[0] + b[0] )/2, (a[1] + b[1] )/2]
//   }
//   return bezierPoints
// }
