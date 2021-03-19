import { useState, useEffect } from 'react';
import { LayerData } from '@type/layer'
import { LAYER_TYPES } from "../map/config"
import api from "../util/request";

const useNomalCase = () => {
  const [datas, setDatas] = useState<LayerData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      let objs = [], dataObj

      const taxis = await api.queryTaxi({
        // geo: [120.713996, 120.699313, 28.005634, 27.98762],
        // geo: [ 120.702495, 120.682583, 28.000021, 27.989316],
        geo: [120.69844,120.694706,27.999263,27.989922],
        // time: ["06:30:00", "10:00:00"]
        time: ["07:00:00", "7:29:00"],
        boolOp: 1
      });
      console.log('taxis length:', taxis.length)
      dataObj = {
        // data: taxis.slice(0, 100),
        data: taxis,
        type: LAYER_TYPES["TRAJ_LAYER"],
        attr: {
          color: [103 ,181, 150, 10],
          strokeWidth: 4
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
  useNomalCase
}