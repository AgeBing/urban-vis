const { Service } = require('egg');

// const TABLE = '20200618order_mini'
const TABLE = 'taxigps20200618_filter_land_duplicate'


class TaxiService extends Service{
  async trajsPoints(){
    console.log(TABLE)
    let points = await this.app.mysql.select(TABLE,{
      limit: 10000 * 300,
    })
    console.log('points length', points.length);
    points = points.map(p => ({
      lon: p['LONGITUDE'],
      lat: p['LATITUDE'],
      time: p['GPS_DATE'],
      carNo: p['CARNO']
    }))
    return points
  }
  async trajectorys(){
    const points = await this.trajsPoints()
    return pointsToTrajs(points)
  }
}

/**
 * 轨迹点拼接成轨迹
 */
const pointsToTrajs = (ps) => {
  const trajs = []
  let lastCarNo = ''
  ps.map(point => {
    const { lon, lat, time, carNo } = point
    if(carNo != lastCarNo){
      trajs.push({
        carNo,
        points: []
      })
      lastCarNo = carNo
    }
    trajs[trajs.length - 1]['points'].push({
        lon,
        lat,
        time
    })
  })
  return trajs
}
module.exports = TaxiService
