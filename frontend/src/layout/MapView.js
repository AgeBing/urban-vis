import React, { Component } from "react";
import "./MapView.scss";
import api from "../util/request";
import Event from "../util/event"
import { v4 as uuid } from 'uuid';
import Map  from "../component/Map/Controller";
import { LAYER_TYPES, SELECT_EVENT_NAME } from "../component/Map/config"

import Button from "../component/Widget/Button"
import Timeline from "../component/Time/Timeline"
const TIME_RANGE = { start: "00:00:00",end: "23:59:59"}

export default class MapPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: [],   // datas of layers
      layers: [],
      timeRange: TIME_RANGE,
      region: []
    };
  }
  componentWillMount(){
    Event.on(SELECT_EVENT_NAME['FINISH_SELECT'], this.handleRegionChange, this)
  }
  async componentDidMount() {
    this.layerDataControl()
  }
  handleSelectRegion = () => {
    Event.emit(SELECT_EVENT_NAME['SRART_SELECT'])
  }
  handleRegionChange = (region) => {
    const { timeRange } = this.state
    this.updateTaxiData(timeRange, region)
    this.setState({ region })
  }
  handleTimeChange = (start,end) => {
    start = new Date(start).toTimeString().slice(0,8)
    end = new Date(end).toTimeString().slice(0,8)
    const { region } = this.state
    const timeRange = { start, end }
    this.updateTaxiData( timeRange, region)
    this.setState({ timeRange })
  }
  updateTaxiData = async (time, region) => {
    const DATE = '2020-06-18 '
    let { datas } = this.state
    const taxis = await api.queryTaxi({
      time:[
        DATE + time['start'],
        DATE + time['end']
      ],
      region
    })

    datas = datas.map(d => {
      if(d['type'] === LAYER_TYPES["TRAJ_LAYER"]){
        d['data'] = taxis
      }
      return d
    })
    this.setState({ datas })
  }
  async layerDataControl() {
    const taxis = await api.getTaxi();
    // console.log(`taxis : ${taxis.length}`);
    // const weibo = await api.getWeibo();
    // console.log(`weibos : ${weibo.length}`);
    const pois = await api.getPOI();
    // console.log(`pois : ${pois.length}`);    
    const datas = [
      {
        id: uuid(),
        type: LAYER_TYPES["POI_LAYER"],
        data: pois,
      },
      {
        id: uuid(),
        type: LAYER_TYPES["TRAJ_LAYER"],
        data: taxis,
      }
    ]
    this.setState({ datas })
  }

  render() {
    const { datas } = this.state;
    return (
      <div className="map-view">
        <Map datas={datas} />
        <div className="btn-area">
          <Button onClick={this.handleSelectRegion} type='icon-frame-select'/>
        </div>
        <div className='time-area'>
          <Timeline 
            startTime={ TIME_RANGE['start'] }
            endTime={  TIME_RANGE['end'] }
            width={400}
            height={60}
            onChange={this.handleTimeChange}
          />
        </div>
      </div>
    );
  }
}
