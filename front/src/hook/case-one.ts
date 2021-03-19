import { useState, useEffect } from 'react';
import { LayerData } from '@type/layer'
import { LAYER_TYPES } from "../map/config"
import api from "../util/request";

const useTaxiCase = () => {
  const [data, setData] = useState<[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const taxis = await api.queryTaxi({
        // geo: [120.713996, 120.699313, 28.005634, 27.98762],
        // geo: [ 120.702495, 120.682583, 28.000021, 27.989316],
        geo: [120.69844,120.694706,27.999263,27.989922],
        // time: ["06:30:00", "10:00:00"]
        time: ["07:00:00", "7:29:00"],
        boolOp: 1
      });
      setData(taxis);
    }

    fetchData()

    return () => {
      setData([])
    }
  },[])

  return data
}



export {
  useTaxiCase
}