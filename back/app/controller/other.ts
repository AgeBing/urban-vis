/**
  未分类
 */

import { Controller } from 'egg';
import { loadCube } from '../utils/stc'
import { CubeConfig, Cube, LocaCell  } from '@type/cube';
import { DS } from '@type/base'
import { HeatMapValue } from '@type/heat'

interface DataSetInfoParam{
  num: number[],
  ids: string[][]
}

export default class OtherController extends Controller {
  
  /**
   * 获取四个数据集的所有 id 和 数量
   */
  public async queryDataSetInfo(){
    const { ctx } = this
    let taxiIds = await ctx.service.stc.getDataSetIds(DS.TaxiTraj)
    let phoneIds = await ctx.service.stc.getDataSetIds(DS.MobileTraj)
    let weibos = await ctx.service.weibo.list()
    let pois = await ctx.service.poi.list()

    console.log("各种类轨迹数目：",{taxi:taxiIds.length,phone:phoneIds.length,weibo:weibos.length,poi:pois.length})

    const dataSetInfo:DataSetInfoParam = {
      'num':[],
      'ids':[]
    }
    let i, idx:number

    idx = Number(DS['MobileTraj'])
    dataSetInfo['ids'][idx] = []
    for(i = 0;i < phoneIds.length;i++){
      dataSetInfo['ids'][idx].push(phoneIds[i])
    }
    dataSetInfo['num'][idx] = phoneIds.length

    idx = Number(DS['TaxiTraj'])
    dataSetInfo['ids'][idx] = []
    for(i = 0;i < taxiIds.length;i++){
      dataSetInfo['ids'][idx].push(taxiIds[i])
    }
    dataSetInfo['num'][idx] = taxiIds.length

    idx = Number(DS['Weibo'])
    dataSetInfo['ids'][idx] = []
    for(i = 0;i < weibos.length;i++){
      dataSetInfo['ids'][idx].push(weibos[i].id)
    }
    dataSetInfo['num'][idx] = weibos.length

    idx = Number(DS['Poi'])
    dataSetInfo['ids'][idx] = []
    for(i = 0;i < pois.length;i++){
      dataSetInfo['ids'][idx].push(pois[i].id)
    }
    dataSetInfo['num'][idx] = pois.length

    return dataSetInfo
    // ctx.body = dataSetIds
  }

  /**
   * 立方体相关配置信息
   */
  public async getSTConfig() {
    const cube:Cube = await loadCube()
    const cfg:CubeConfig = cube.config
    const dataSetInfo:DataSetInfoParam = await this.queryDataSetInfo()
    const config = {
      // ...cfg,
      scubeNum: cfg.scubeNum,
      dataSetInfo
    }
    this.ctx.body = config
  }

  /**
   * 区域概率热力图
   */
  public async scubeHeatMap() {
    const cube:Cube = await loadCube()
    // const cfg:CubeConfig = cube.config
    const locas: LocaCell[] = cube.locas
    // let count = cfg.scubeNum || 100
    let heatMaps: HeatMapValue[] = []
    locas.map((loca:LocaCell) => {
      heatMaps.push({
        // value: Math.random() / count,
        value: 0,
        longitude: loca.lng,
        latitude: loca.lat
      })
    })
    this.ctx.body = heatMaps
  }
}