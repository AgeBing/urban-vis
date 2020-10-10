import { PathLayer } from '@deck.gl/layers';

// https://deck.gl/docs/api-reference/layers/path-layer

export const  createTrajectoryLayer = ( data ) => {
	return new PathLayer({
    id: 'path-layer',
    data,
    pickable: true,
    widthMinPixels: 2,
	  getPath: d => d.map((p)=>[p['lon'], p['lat']]),
    getColor: d => [255, 140, 0, 30],
    getWidth: d => 1,
	});
}