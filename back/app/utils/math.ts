import { Point, GeoParam, TimeParam, BBox, TimeExtend } from '@type/base'
import * as moment from 'moment';

/**
 * 判断点是否在矩形范围内
 * @param point 
 *    @param longitude
 *    @param latitude
 * @param geoParam  [maxlng, minlng, maxlat, minlat]
 */
export const isPointWithinRect = (point: Point, geoParam: GeoParam) => {
  if(point && geoParam){
    return (
      point.longitude >= geoParam[1] && point.longitude <= geoParam[0]
      && point.latitude >= geoParam[3] && point.latitude <= geoParam[2] 
    )
  }
  return true
}


/**
 * 计算包围盒
 * @param points
 */
export const bbox = (points: Point[]):BBox => {
  let box:BBox = []
  if(points.length < 1){
    throw Error('包围盒输入值错误！')
  }
  box = [
    points[0].longitude,
    points[0].longitude,
    points[0].latitude,
    points[0].latitude,
  ]
  points.forEach((p:Point) => {
    if(p.longitude > box[0])
      box[0] = p.longitude
    if(p.longitude < box[1])
      box[1] = p.longitude
    if(p.latitude > box[2])
      box[2] = p.latitude
    if(p.latitude < box[3])
      box[3] = p.latitude
  })
  return box
}


/**
 * 判断时间区间（仅判断一天内的时间）
 * @param point 
 *    @param time：2014-01-14 23:57
 * @param timeParam ：["00:06:33", "00:12:56"]
 */
export const isPointWithinInterval = (point: Point, timeParam: TimeParam) => {
  if(point && point.time && timeParam){
    const t = moment(point.time),
          date = t.format("YYYY-MM-DD") + " ",
          start = date + timeParam[0],
          end = date + timeParam[1]
    return (t.isAfter(start) && t.isBefore(end))
  }
  return true
}


// "2014-01-14 23:57:12" => "23:57:12"
export const timeFormat1 = (time:string) => {
  // const t = moment(time)
  // return t.format('HH:mm:ss')
  return time.slice(11, 19)
}
// console.log(timeFormat1("2014-01-14 23:57:12"))

/**
 * 计算时间区间
 */
type MomentExtend = moment.Moment[]
export const timeExtend = (points: Point[]):TimeExtend => {
  let me: MomentExtend = []
  if(points.length < 1){
    throw Error('时间区间输入值错误！')
  }
  let t1 = moment(points[0].time), t2
  me[0] = t1
  me[1] = t1

  points.forEach((p:Point) => {
    t2 = moment(p.time)
    if(t2.isBefore(me[0]))
      me[0] = t2
    if(t2.isAfter(me[1]))
      me[1] = t2
  })

  let extendTime: TimeExtend = [
    me[0].format('HH:mm:ss'),
    me[1].format('HH:mm:ss'),
  ]
  return extendTime
}


// import { Bbx } from '../controller/py'
// export const compareBbx = (bbx: Bbx) => {
//   let point:Point = {
//     time: [bbx.timeRange.min,
//     longitude: bbx.areaRange.minLng,
//   }
//   let a = isPointWithinInterval(point)
// }