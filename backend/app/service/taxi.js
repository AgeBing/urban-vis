const { Service } = require('egg');
const geoUtil = require('../util/geo')
const timeUtil = require('../util/time')
const heapdump = require('heapdump');

// const TABLE = '20200618order_mini'
const TABLE = 'taxigps20200618_filter_land_duplicate_slice'



class TaxiService extends Service{
  static trajs
  /**
   * 获取轨迹点
   */
  async trajsPoints(){
    console.log("查询 TABLE", TABLE)
    const limit = 10000 * 20
    const offset = 0
    const sql = `SELECT LONGITUDE as lon, LATITUDE as lat, GPS_DATE as time, CARNO as carNo, SLICECOUNT as sliceCount FROM ${TABLE} LIMIT ${offset},${limit}`
    let points = await this.app.mysql.query(sql)
    console.log('points length', points.length);
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Memory Used: ${Math.round(used)} MB`);
    return points
  }
  /**
   * 轨迹点变成轨迹
   */
  async trajectorys(){
    if(!TaxiService.trajs){
      const points = await this.trajsPoints()
      TaxiService.trajs =  pointsToTrajs(points)
    }
    return TaxiService.trajs
  }
  /**
   * 按时间可空间查询
   */
  async query(){
    const { ctx } = this
    const { time, region } = ctx.request.body
    let trajs = await this.trajectorys()
    console.log("过滤前",trajs.length)
    trajs = filterTrajInRegion(trajs, region, time)
    console.log("过滤后",trajs.length)
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Memory Used: ${Math.round(used)} MB`);
    return trajs
  }
}


/**
 * 轨迹点拼接成轨迹
 */
const pointsToTrajs = (ps) => {
  const trajs = []
  let lastCarNo = ''
  let lastSliceCount = 0
  ps.forEach(point => {
    const { lon, lat, time, carNo, sliceCount } = point
    if(carNo != lastCarNo || sliceCount != lastSliceCount){
      trajs.push({
        carNo,
        sliceCount,
        points: []
      })
      lastCarNo = carNo
      lastSliceCount = sliceCount
    }
    delete point.carNo
    delete point.sliceCount
    trajs[trajs.length - 1]['points'].push( point )
  })
  return trajs
}
/**
 * 轨迹点变成轨迹
 */
const filterTrajInRegion = (trajs, region, timeInterval) => {
    return trajs.filter( t => {
      const { points } = t
      for(let i = 0;i < points.length;i++){
        let point = points[i]

        let isPointInRegion = region.length === 0 || geoUtil.isPointInRegion( [point['lon'], point['lat']], region )
        let isPointTimeInInterval = timeUtil.isInTimeInterval( point['time'], timeInterval )

        if(isPointInRegion && isPointTimeInInterval){
          return true
        }
      }
      return false
    })
}

module.exports = TaxiService
