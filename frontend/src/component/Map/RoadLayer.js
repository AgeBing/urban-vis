import { PathLayer } from '@deck.gl/layers';
import { LAYER_CONSTRUCTOR } from './config'
/**
 * 道路数据
 * @param {Array} data
 *    [
 *      [  // 一条轨迹
 *       [lat, lon],  // 轨迹点
 *       [lat, lon],
 *       [lat, lon],
 *      ]
 *      ...
 *    ]
 */
export const createRoadLayer = ( data ) => {
	return new PathLayer({
    id: `${LAYER_CONSTRUCTOR['ROAD_LAYER']}`,
    data,
    pickable: true,
    widthMinPixels: 2,
	  getPath: path => path,
    getColor: d => [255, 140, 0, 100],
	});
}