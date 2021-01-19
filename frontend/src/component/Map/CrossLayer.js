import { ScatterplotLayer } from '@deck.gl/layers';
import { LAYER_CONSTRUCTOR } from './config'

const COLOR  = [227,26,28,200]
/**
 * 路口数据
 * @param {Array} data
 *    [
 *      [lat, lon],  // 路口点
 *      [lat, lon],
 *      [lat, lon],
 *      ...
 *    ]
 */
export const createCrossLayer = (data)=>{
  return new ScatterplotLayer({
    id: `${LAYER_CONSTRUCTOR['CROSS_LAYER']}`,
    data,
    pickable: true,
    opacity: 1,
    visible: true,
    stroked: true,
    filled: true,
    radiusScale: 1,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
    getPosition: d => d,
    getRadius: d => 10,
    getFillColor: d => COLOR,
    getLineColor: d => COLOR
  });
}