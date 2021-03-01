import React, { useState, useEffect } from 'react';
// import { v4 as uuid } from 'uuid';
import api from "./util/request";
import Map from './map/Controller'
import { LAYER_TYPES,  } from "./map/config"
import './MapView.scss'
import { LayerData } from '@type/layer'

function MapView(){
  const [datas, setDatas] = useState<LayerData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      let dataObjs = []
      // const taxis = await api.getTaxiSTC();
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


      /**
       * Case 部分
       */
      const weibos = await api.caseWeibos();
      dataObjs.push({
        data: weibos,
        type: LAYER_TYPES["WEIBO_LAYER"],
      })

      const twoTaxis = await api.caseTaxis();
      dataObjs.push({
        data: twoTaxis,
        type: LAYER_TYPES["TRAJ_LAYER"],
        attr: {
          color: [103 ,181, 150, 170]
        }
      })

      const taxiPhone = await api.caseTaxiPhone();
      dataObjs.push({
        data: taxiPhone,
        type: LAYER_TYPES["TRAJ_LAYER"],
        attr: {
          color: [251, 130, 115, 200]
        }
      })

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