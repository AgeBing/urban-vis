// import { ScatterplotLayer } from '@deck.gl/layers';
import { IconLayer } from '@deck.gl/layers';
import { WeiboItem } from '@type/weibo'
import WEIBO_IMG from '../../img/weibo.png'
// const COLOR = [247,129,191, 100]
const COLOR = [247,129,191, 130]
const ICON_MAPPING = {
  marker: {x: 0, y: 0, width: 200, height: 200, mask: true}
};

export const createWeiboLayer = (data: WeiboItem[]) => {
  
  // return new ScatterplotLayer({
  //   id: 'scatterplot-layer-weibo',
  //   data,
  //   pickable: true,
  //   opacity: 0.5,
  //   stroked: true,
  //   filled: true,
  //   radiusScale: 1,
  //   radiusMinPixels: 1,
  //   radiusMaxPixels: 100,
  //   lineWidthMinPixels: 1,
  //   getPosition: (d: any) => [+d.lng, +d.lat],
  //   // getRadius: (d:any) => 40,
  //   getRadius: (d:any) => 50,
  //   getFillColor: (d:any) => COLOR,
  //   getLineColor: (d:any) => COLOR
  // });

  return new IconLayer({
    id: 'weibo-layer',
    data,
    pickable: true,
    // iconAtlas and iconMapping are required
    // getIcon: return a string
    // iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
    iconAtlas: WEIBO_IMG,
    iconMapping: ICON_MAPPING,
    getIcon: (d:any) => 'marker',
    sizeScale: 4,
    getPosition: (d: any) => [+d.lng, +d.lat],
    getSize: (d:any) => 10,
    getColor: (d:any) => COLOR
  });
}