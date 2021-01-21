import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { WeiboItem } from '@type/weibo'
const LAYER_NAME = 'HEATMAP_LAYER'


export const createHeatmapLayer = (data :WeiboItem[]) =>{
  const intensity = 1,
		threshold = 0.3,
		radiusPixels = 30,
		visible = true

	return new HeatmapLayer({
	    id: `${LAYER_NAME}-${Math.random()}`,
	    data,
	    visible,
	    pickable: false,
		  getPosition: (d: any) => [+d['lng'] , +d['lat']],
	    getWeight: 1,
	    radiusPixels,
	    intensity,
	    threshold,
	    colorRange: colorRange
	 })
}


// https://colorbrewer2.org/#type=sequential&scheme=Blues&n=6
const colorRange = [
	[239,243,255],
	[198,219,239],
	[158,202,225],
	[107,174,214],
	[49,130,189],
	[8,81,156]
]