import React, { useState, useEffect } from 'react';
// import { v4 as uuid } from 'uuid';
import api from "./util/request";
import Map from './map/Controller'
import { LAYER_TYPES,  } from "./map/config"
import './MapView.scss'

interface LayerData {
  id?: string,
  type?: string
  data: any,
}

function MapView(){
  const [datas, setDatas] = useState<LayerData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const taxis = await api.getTaxi();
      const obj = {
        data: taxis,
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