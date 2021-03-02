import { Controller } from 'egg';
import * as moment from 'moment';
import { Trajectory } from '@type/base'
import { PhoneTrajectory } from '@type/phone'


const fileUtil = require('../utils/file')

export default class TaxiController extends Controller {
  public async index() {
    const { ctx } = this;
    let res = await ctx.service.taxi.list();
    ctx.body = res
  }

  public async weibo(){
    const { ctx }  = this; 
    this.logger.info('获取手机丢失的微博数据...')
    let weibos = await fileUtil.readJson('weibo.json')

    weibos = weibos.filter(w => (w.name == '红唇'))
    console.log(weibos)
    ctx.body = weibos
  }

  public async taxi(){
    const { ctx }  = this; 
    this.logger.info('获取两辆出租车数据...')
    let car1 = await fileUtil.readJson('taxi_浙CT0230.LOG.json')
    // let car2 = await fileUtil.readJson('taxi_浙CT1168.LOG.json')

    const filterInTime = (car) => {
      // const start = moment("2014-01-01 00:30:55")
      // const end = moment("2014-01-01 01:30:55")
      const start = moment("2014-01-01 00:00:55")
      const end = moment("2014-01-01 23:59:55")
      car.points = car.points.filter(p => {
        let m = moment(p['time'])
        return (m.isAfter(start) && m.isBefore(end))
      })
    }

    filterInTime(car1)
    // filterInTime(car2)

    ctx.body = [
      car1,
      // car2
    ]
  }

  public async taxiPhone(){
    const { ctx }  = this; 
    this.logger.info('获取出租车司机的手机数据...')
    let phone:Trajectory = await fileUtil.readJson('phone_460022584127733.json')
    
    // 分段的形式
    // let trajs: PhoneTrajectory[] = phone.segments.map((s,i) => ({
    //   IMEI: phone['id'] + '-' + i,
    //   points: s
    // }))

      // 将分段连成一条线
    let trajs: PhoneTrajectory[] = [{
      IMEI: phone['id'],
      points: phone.segments.reduce((a,b)=> a.concat(b),[])
    }]

    ctx.body = trajs
  }
}
