import { PathLayer } from '@deck.gl/layers';
import { TaxiPoint, TaxiTrajectory } from '@type/taxi'
import { PhonePoint, PhoneTrajectory } from '@type/phone'
import { LayerAttr } from '@type/layer'

export const  createTrajectoryLayer = ( data: TaxiTrajectory[] |  PhoneTrajectory[], attr: LayerAttr) => {
    let { color } = attr || {
      color : [128,163,151, 20],
    }
  console.log(color)
	return new PathLayer({
    id: 'path-layer',
    data,
    pickable: true,
    widthMinPixels: 2,
	  getPath: (d: TaxiTrajectory | PhoneTrajectory)  => {
      const points: TaxiPoint[] | PhonePoint[] = d['points']
      return points.map(p => [p['longitude'], p['latitude']])
    },
    // getColor: (d:any) => [128,163,151, 20],
    getColor: (d:any) => color,
    // getWidth: (d:any) => 1,
    getWidth: (d:any) => 6,
	});
}