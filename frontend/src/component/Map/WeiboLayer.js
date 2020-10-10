import { ScatterplotLayer } from '@deck.gl/layers';

const COLOR = [247,129,191]
export const createWeiboLayer = (data)=>{
  return new ScatterplotLayer({
    id: 'scatterplot-layer-weibo',
    data,
    pickable: true,
    opacity: 0.5,
    stroked: true,
    filled: true,
    radiusScale: 1,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
    getPosition: d => [+d.lon, +d.lat],
    getRadius: d => 40,
    getFillColor: d => COLOR,
    getLineColor: d => COLOR
  });
}