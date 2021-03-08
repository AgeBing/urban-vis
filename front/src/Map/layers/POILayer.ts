// import { ScatterplotLayer } from '@deck.gl/layers';
import { IconLayer } from '@deck.gl/layers';
import { POIItem } from '@type/poi'
import POI_IMG from '../../img/poi.png'
// const COLOR = [247,129,191, 100]
const COLOR = [55,126,184, 180]
const ICON_MAPPING = {
  marker: {x: 0, y: 0, width: 200, height: 200, mask: true}
};

export const createPOILayer = (data: POIItem[]) => {
  return new IconLayer({
    id: 'poi-layer',
    data,
    pickable: true,
    iconAtlas: POI_IMG,
    iconMapping: ICON_MAPPING,
    getIcon: (d:any) => 'marker',
    sizeScale: 5,
    getPosition: (d: any) => [+d.longitude, +d.latitude],
    getSize: (d:any) => 10,
    getColor: (d:any) => COLOR
  });
}