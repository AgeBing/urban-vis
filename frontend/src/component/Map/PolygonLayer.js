// import { ScatterplotLayer } from '@deck.gl/layers';
import { PolygonLayer } from '@deck.gl/layers';
import { LAYER_CONSTRUCTOR } from './config'

let colors = [
  [127,201,127],
  [190,174,212],
  [253,192,134],
  [255,255,153],
]
const getColor = () => {
  let idx = Math.floor(Math.random() * 4)
  let color = colors[idx]
  color[3] = 150
  return color
}
const elevationHeight = 200
export const createPolygonLayer = (data)=>{
  return new PolygonLayer({
    id: `${LAYER_CONSTRUCTOR['POLYGON_LAYER']}`,
    data,
    pickable: true,
    stroked: true,
    filled: true,
    wireframe: true,
    lineWidthMinPixels: 1,
    extruded: true,
    getPolygon: d => d.block.map((p) => [p.lng, p.lat]),
    // getElevation: d => d.population / d.area / 10,
    getFillColor: d => getColor(),
    getElevation: d => Math.floor(Math.random() * elevationHeight)
    // getLineColor: [80, 80, 80],
    // getLineWidth: 1
  });
}