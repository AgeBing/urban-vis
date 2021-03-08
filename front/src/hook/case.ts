import { useState, useEffect } from 'react';
import { LayerData } from '@type/layer'
import { LAYER_TYPES } from "../map/config"
import api from "../util/request";

const useVAUDCase1 = () => {
  const [datas, setDatas] = useState<LayerData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      let objs = [], dataObj

      // 微博
      const weibos = await api.caseWeibos();
      dataObj = {
        data: weibos,
        type: LAYER_TYPES["WEIBO_LAYER"],
      }
      objs.push(dataObj)

      // POI
      const pois = await api.casePois();
      dataObj = {
        data: pois,
        type: LAYER_TYPES["POI_LAYER"],
      }
      objs.push(dataObj)

      // 出租车
      const twoTaxis = await api.caseTaxis();
      dataObj = {
        data: twoTaxis,
        type: LAYER_TYPES["TRAJ_LAYER"],
        attr: {
          color: [103 ,181, 150, 170],
          strokeWidth: 20
        }
      }
      objs.push(dataObj)


      // 手机
      const taxiPhone = await api.caseTaxiPhone();

      dataObj = {
        data: taxiPhone,
        type: LAYER_TYPES["TRAJ_LAYER"],
        attr: {
          color: [251, 130, 115, 200]
        }
      }
      objs.push(dataObj)

      setDatas(datas.concat(objs));
    }
    fetchData()

    return () => {
      setDatas([])
    }
  },[])

  return datas
}



export {
  useVAUDCase1
}