import { createPOILayer } from "./POILayer";
import { createWeiboLayer } from "./WeiboLayer";
import { createTrajectoryLayer } from "./TrajectoryLayer";
import { createAreaSelectLayer } from './AreaSelectLayer'

export const MAP_STYLE = 'mapbox://styles/mapbox/dark-v9'
// export const MAP_STYLE = 'mapbox://styles/mapbox/light-v9'
export const MAPBOX_TOKEN = 'pk.eyJ1IjoieWtqYWdlIiwiYSI6ImNrNnp5dzZhbjFhMHczbm12OTR5bmU4ankifQ.cOEClSRYNtYFUAFhnUEXhA';
export const MAP_INITIAL_VIEW_STATE = {
  	// longitude: 120.66714, latitude: 28.01308 ,   // 温州 
    latitude: 24.493397, longitude: 118.136673,  // 厦门
  	zoom: 12,
  	maxZoom: 18,
  	pitch: 30,
  	bearing: 0
};

export const LAYER_TYPES = {
  POI_LAYER: "POI_LAYER",
  WEIBO_LAYER: "WEIBO_LAYER",
  TRAJ_LAYER: "TRAJ_LAYER",
  
  SELECT_LAYER: "SELECT_LAYER"
}
export const LAYER_CONSTRUCTOR = {
  POI_LAYER: createPOILayer,
  WEIBO_LAYER: createWeiboLayer,
  TRAJ_LAYER: createTrajectoryLayer,

  SELECT_LAYER: createAreaSelectLayer,
}

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