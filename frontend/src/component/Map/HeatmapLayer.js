import { HeatmapLayer } from '@deck.gl/aggregation-layers';

/**
 * 
 * @param {Array} data
 *  [{
 *    lon, lat, count
 *  }]
 *  
 */
export const createHeatmapLayer = (data)=>{
   return  new HeatmapLayer({
      id: 'heatmap-layer',
      data,
      getPosition: d => [d.lon, d.lat],
      getWeight: d => d.count,
      intensity: 0.1,
      radiusPixels: 80
    })
}