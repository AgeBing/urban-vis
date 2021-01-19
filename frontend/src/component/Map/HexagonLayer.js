import { HexagonLayer } from '@deck.gl/aggregation-layers';


const COLOR_RANGE = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];
export const createHexagonLayer = (data)=>{
   return  new HexagonLayer({
      id: 'hexagon-layer',
      data,
      pickable: true,
      extruded: true,
      colorRange: COLOR_RANGE,
      radius: 20,
      elevationScale: 4,
      getPosition: d => d,
      transitions: {
        elevationScale: 3000
      }
    })
}