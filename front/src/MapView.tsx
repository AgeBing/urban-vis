import React, { useState, useEffect } from 'react';
// import { v4 as uuid } from 'uuid';
import api from "./util/request";
import Map from './map/Controller'
// import { LAYER_TYPES,  } from "./map/config"
import './MapView.scss'
// import { LayerData } from '@type/layer'
import {TaxiTrajectory} from '@type/taxi'
// import { useVAUDCase1 } from './hook/case'

import ParticleLayer from './tripLayer/ParticleLayer'

function MapView(){
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      // dataObjs:TaxiTrajectory[] = []
      let startTime = "2014-01-01 07:30:00"
      // let startTime = "2014-01-14 07:30:00"

      let startDateTime:any = new Date(startTime)
      // let endDateTime:Date = new Date(endTime)
      const taxis:TaxiTrajectory[] = await api.queryTaxi( {time:["07:30:00", "07:59:59"]} )
      console.log('taxis', taxis)
      let dataObjs:any = taxis.map(taxi=>{
        let points:any = []
        let timestamps:any = []
        taxi.points.forEach(p=>{
          points.push([p.longitude,p.latitude])
          let time:any = new Date(p.time)
          timestamps.push(Math.floor((time-startDateTime)/1000))
        })
        return {
          vector:taxi.id,
          path:points,
          timestamps
        }
      })
      // dataObjs.push({
      //   data: taxis,
      //   type: LAYER_TYPES["TRAJ_LAYER"],
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
      setData(dataObjs);
    }
    fetchData();
  }, [])

  // console.log(datas)
  return (
    <div className="map-view">
      <ParticleLayer trips={data}/>
    </div>
  )
}

export default MapView;