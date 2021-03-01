import { ScatterplotLayer } from '@deck.gl/layers';
import { WeiboItem } from '@type/weibo'
// const COLOR = [247,129,191, 100]
const COLOR = [247,129,191, 200]

export const createWeiboLayer = (data: WeiboItem[]) => {
  
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
    getPosition: (d: any) => [+d.lng, +d.lat],
    // getRadius: (d:any) => 40,
    getRadius: (d:any) => 50,
    getFillColor: (d:any) => COLOR,
    getLineColor: (d:any) => COLOR
  });
}