import React, { useState, useEffect, useReducer } from 'react';
// import { v4 as uuid } from 'uuid';
import api from "./util/request";
import Map from './Map/Controller'
import { LAYER_TYPES, SELECT_EVENT_NAME } from "./Map/config"
import './MapView.scss'
import { TaxiPoint } from './typs'

interface LayerData {
  id?: string,
  type?: string
  data: any,
}

function MapView(){
  const [datas, setDatas] = useState<LayerData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const taxisPoints = await api.getTaxi();
      const obj = {
        data: [{
          points: taxisPoints,
        }],
        type: LAYER_TYPES["TRAJ_LAYER"],
      }
      setDatas(datas.concat(obj));
    }
    fetchData();
  }, [])

  console.log(datas)
  return (
    <div className="map-view">
      <Map datas={datas}/>
    </div>
  )
}

export default MapView;