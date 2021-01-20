import { PathLayer } from '@deck.gl/layers';
import { TaxiPoint, TaxiTrajectory } from '@type/taxi'

export const  createTrajectoryLayer = ( data: TaxiTrajectory[] ) => {
	return new PathLayer({
    id: 'path-layer',
    data,
    pickable: true,
    widthMinPixels: 2,
	  getPath: (d:TaxiTrajectory)  => {
      const points: TaxiPoint[] = d['points']
      return points.map(p => [p['longitude'], p['latitude']])
    },
    getColor: (d:any) => [128,163,151, 100],
    getWidth: (d:any) => 1,
	});
}