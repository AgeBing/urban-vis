/**
 * 坐标系转换
 */
const coordt = require('coordtransform');

const gcj02towgs84 = (point) => {
  const { lon,lat } = point
  const lnglat = coordt.gcj02towgs84(lon, lat)
  return {
    ...point,
    lon: lnglat[0],
    lat: lnglat[1]
  }
}

module.exports = {
  gcj02towgs84
}