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
      let dataObjs = []
      const taxis = await api.getTaxiSTC();
      dataObjs.push({
        data: taxis,
        type: LAYER_TYPES["TRAJ_LAYER"],
      })
      // const weibos = await api.getWeibo();
      // dataObjs.push({
      //   data: weibos,
      //   type: LAYER_TYPES["WEIBO_LAYER"],
      // })
      // dataObjs.push({
      //   data: weibos,
      //   type: LAYER_TYPES["HEATMAP_LAYER"],
      // })

      // const phones = await api.getPhone();
      // dataObjs.push({
      //   data: phones,
      //   type: LAYER_TYPES["TRAJ_LAYER"],
      // })

      setDatas(datas.concat(dataObjs));
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