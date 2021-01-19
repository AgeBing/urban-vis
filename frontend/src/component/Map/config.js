import { createPOILayer } from "./POILayer";
import { createWeiboLayer } from "./WeiboLayer";
import { createTrajectoryLayer } from "./TrajectoryLayer";
import { createAreaSelectLayer } from './AreaSelectLayer'
import { createRoadLayer } from './RoadLayer'
import { createCrossLayer } from './CrossLayer'
import { createHexagonLayer } from './HexagonLayer'
import { createHeatmapLayer } from './HeatmapLayer'
import { createPolygonLayer } from './PolygonLayer'
import { TripLayer } from './TripLayer'

/** 
 * Mapbox 地图配置
 */
// export const MAP_STYLE = 'mapbox://styles/mapbox/dark-v9'
export const MAP_STYLE = 'mapbox://styles/mapbox/light-v9'
export const MAPBOX_TOKEN = 'pk.eyJ1IjoieWtqYWdlIiwiYSI6ImNrNnp5dzZhbjFhMHczbm12OTR5bmU4ankifQ.cOEClSRYNtYFUAFhnUEXhA';
export const MAP_INITIAL_VIEW_STATE = {
  	// longitude: 120.66714, latitude: 28.01308 ,   // 温州 
    latitude: 24.493397, longitude: 118.136673,  // 厦门
  	zoom: 12,
  	maxZoom: 18,
  	pitch: 30,
  	bearing: 0
};

/**
 * 图层 类型
 */
export const LAYER_TYPES = {
  POI_LAYER: "POI_LAYER",
  WEIBO_LAYER: "WEIBO_LAYER",
  TRAJ_LAYER: "TRAJ_LAYER",
  ROAD_LAYER: "ROAD_LAYER",
  CROSS_LAYER: "CROSS_LAYER",
  HEXAGON_LAYER: "HEXAGON_LAYER", 
  HEATMAP_LAYER: "HEATMAP_LAYER",
  POLYGON_LAYER: "POLYGON_LAYER",
  TRIP_LAYER: "TRIP_LAYER",

  SELECT_LAYER: "SELECT_LAYER",
}
export const LAYER_CONSTRUCTOR = {
  POI_LAYER: createPOILayer,
  WEIBO_LAYER: createWeiboLayer,
  TRAJ_LAYER: createTrajectoryLayer,
  ROAD_LAYER: createRoadLayer,
  CROSS_LAYER: createCrossLayer,
  HEXAGON_LAYER: createHexagonLayer,
  HEATMAP_LAYER: createHeatmapLayer,
  POLYGON_LAYER: createPolygonLayer,
  TRIP_LAYER: TripLayer,

  SELECT_LAYER: createAreaSelectLayer,
}

/**
 * 框选 图层
 */
export const SELECT_LAYER_MODE = {
  VIEW: "VIEW",
  DRAW: "DRAW"
}
export const SELECT_EVENT_NAME = {
  SRART_SELECT: "SRART_SELECT",
  FINISH_SELECT: "FINISH_SELECT",
  CANCEL_SELECT: "CANCEL_SELECT",
  CHANGE_VISIBLE: "CHANGE_VISIBLE"
}