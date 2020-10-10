import React, { Component } from "react";
import "./MapView.scss";
import api from "../util/request";
import BaseMap from "../component/Map/BaseMap";
import { createPOILayer } from "../component/Map/POILayer";
import { createTrajectoryLayer } from "../component/Map/TrajectoryLayer";
import { createWeiboLayer } from "../component/Map/WeiboLayer";

export default class MapPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: [],
    };
  }
  async componentDidMount() {
    this.layerControl()

  }
  async layerControl() {
    // const poi = await api.getPOI();
    // console.log(`pois : ${poi.length}`);
    // const poiLayer = createPOILayer(poi);
    const taxis = await api.getTaxi();
    console.log(`taxis : ${taxis.length}`);
    const trajectoryPoints = taxis.map((taxi) => taxi["points"]);
    const taxiLayer = createTrajectoryLayer(trajectoryPoints);
    // const weibo = await api.getWeibo();
    // const weiboLayer = createWeiboLayer(weibo);
    // console.log(`weibos : ${weibo.length}`);
    this.setState({
      layers: [
        // poiLayer, 
        taxiLayer,
        // weiboLayer
      ],
    });    
  }
  render() {
    const { layers } = this.state;
    return (
      <div className="map-view">
        <BaseMap layers={layers} />
      </div>
    );
  }
}
