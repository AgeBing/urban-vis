import { PathLayer } from '@deck.gl/layers';

// https://deck.gl/docs/api-reference/layers/path-layer

/**
 * 出租车轨迹数据
 * @param {Array} data
 *    [{
 *      carNo: "0003cfd5bbad9bc9ce91b39bfc19a45d",
 *      points: [
 *        {
 *          lat: "24.470886",
 *          lon: "118.097338",
 *          time: "2020-06-18 00:00:19",
 *       }
 *      ]
 *    }]
 */

interface TaxiPoint {
  longitude: number;
  latitude: string;
  time: string;
}
interface TaxiTrajectory {
  id: string,
  points: TaxiPoint[],
}

export const  createTrajectoryLayer = ( data: TaxiTrajectory[] ) => {
	return new PathLayer({
    id: 'path-layer',
    data,
    pickable: true,
    widthMinPixels: 2,
	  getPath: (d:TaxiTrajectory)  => {
      console.log(d)
      const points = d['points']
      return points.map(p => [p['longitude'], p['latitude']])
    },
    getColor: (d:any) => [128,163,151, 100],
    getWidth: (d:any) => 1,
	});
}