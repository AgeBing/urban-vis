/**
  未分类
 */

import { Controller } from 'egg';
import { loadCube } from '../utils/stc'
import { CubeConfig, Cube,  } from '@type/cube';
import { DS } from '@type/base'

export default class OtherController extends Controller {
  
  /**
   * 获取四个数据集的所有 id
   */
  public async queryDataSetIds(){
    const { ctx } = this
    let taxiIds = await ctx.service.stc.getDataSetIds(DS.TaxiTraj)
    let phoneIds = await ctx.service.stc.getDataSetIds(DS.MobileTraj)
    let weibos = await ctx.service.weibo.list()
    let pois = await ctx.service.poi.list()

    let dataSetIds:string[] = []

    let i
    for(i = 0;i < taxiIds.length;i++){
      dataSetIds.push(taxiIds[i])
    }
    for(i = 0;i < phoneIds.length;i++){
      dataSetIds.push(phoneIds[i])
    }
    for(i = 0;i < weibos.length;i++){
      dataSetIds.push(weibos[i].id)
    }
    for(i = 0;i < taxiIds.length;i++){
      dataSetIds.push(pois[i].id)
    }
    ctx.body = dataSetIds
  }

  /**
   * 立方体相关配置信息
   */
  public async getSTConfig() {
    const cube:Cube = await loadCube()
    const cfg:CubeConfig = cube.config

    const config = {
      // ...cfg,
      scubeNum: cfg.m * cfg.n
    }
    this.ctx.body = config
  }
}