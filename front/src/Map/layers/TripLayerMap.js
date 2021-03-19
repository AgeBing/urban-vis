import {TripsLayer} from '@deck.gl/geo-layers';
import DeckGL from "@deck.gl/react";

import { useTaxiCase } from '../../hook/case-one'


export default function TripLayer() {

  const data = useTaxiCase()
  console.log("TripLayer: ", data);

  const layer = new TripsLayer({
    id: 'trips-layer',
    data,
    getPath:(d)  => {
      const points = d['points']
      return points.map(p => [p['longitude'], p['latitude']])
    },
    // deduct start timestamp from each data point to avoid overflow
    getTimestamps: (d)  => {
      const points = d['points']
      return points.map(p => [p['longitude'], p['latitude']])
    },
    getColor: [253, 128, 93],
    opacity: 0.8,
    widthMinPixels: 5,
    rounded: true,
    trailLength: 200,
    currentTime: 100
  });

  return <DeckGL layers={[layer]} />;
}