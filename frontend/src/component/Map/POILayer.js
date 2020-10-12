import { ScatterplotLayer } from '@deck.gl/layers';



const COLOR  = [166,206,227]
export const createPOILayer = (data)=>{
  // console.log("createPOILayer data", data)
  return new ScatterplotLayer({
    id: 'scatterplot-layer',
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
    getPosition: d => [+d.lon, +d.lat],
    getRadius: d => 2,
    getFillColor: d => COLOR,
    getLineColor: d => COLOR
  });
}