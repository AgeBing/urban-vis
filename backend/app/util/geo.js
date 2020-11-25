const turf = require('@turf/turf')

/**
 * 
 * @param {*} point 
 *    [-46.6318, -23.5523]
 * @param {*} region
 *    [
 *      [-46.653,-23.543],
 *      [-46.634,-23.5346],
 *      [-46.613,-23.543],
 *      [-46.614,-23.559],  需要闭合
 *    ]
 */
function isPointInRegion(point, region){
  var points = turf.points([point]);
  var searchWithin = turf.polygon([region]);
  var ptsWithin = turf.pointsWithinPolygon(points, searchWithin);
  return ptsWithin.features.length == 1
}


function isPointInRegions(point, regions){
  for(i = 0;i < regions.length;i++){
    if(isPointInRegion(point, regions[i]))
      return true
  }
  return false
}

module.exports = {
  isPointInRegion,
  isPointInRegions
}