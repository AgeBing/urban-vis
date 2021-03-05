import { Point, GeoParam, TimeParam } from '@type/base'
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