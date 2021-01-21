import { PathLayer } from '@deck.gl/layers';
import { TaxiPoint, TaxiTrajectory } from '@type/taxi'
import { PhonePoint, PhoneTrajectory } from '@type/phone'

export const  createTrajectoryLayer = ( data: TaxiTrajectory[] |  PhoneTrajectory[]) => {
	return new PathLayer({
    id: 'path-layer',
    data,
    pickable: true,
    widthMinPixels: 2,
	  getPath: (d: TaxiTrajectory | PhoneTrajectory)  => {
      const points: TaxiPoint[] | PhonePoint[] = d['points']
      return points.map(p => [p['longitude'], p['latitude']])
    },
    getColor: (d:any) => [128,163,151, 20],
    getWidth: (d:any) => 1,
	});
}