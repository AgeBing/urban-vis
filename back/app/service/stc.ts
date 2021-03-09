import { Service } from 'egg';
import { Cube, CubeCell, GeoParams, TimeParams, STCDataItem } from '@type/cube'
import { BoolOperate, DS, Point } from '@type/base'
import { query, loadCube, timeToSliceIndex } from '../utils/stc'

import { queryRes } from '../controller/py'
import { timeFormat1 } from '../utils/math' 

const fileUtil = require('../utils/file')

enum STCIndexType{
  'data2cube',
  'cube2data'
}
const FILE_PATH = {
  [(DS['MobileTraj']+ 1).toString()]:{
    [STCIndexType['data2cube']]: 'phoneSDATA.json',
    [STCIndexType['cube2data']]: 'phoneSTCube.json',
  },
  [(DS['TaxiTraj']+ 1).toString()]:{
    [STCIndexType['data2cube']]: 'taxiSDATA.json',
    [STCIndexType['cube2data']]: 'taxiSTCube.json',
  }
}

const datas = {
  [(DS['MobileTraj'] + 1).toString()]:{
    [STCIndexType['data2cube']]: null,
    [STCIndexType['cube2data']]: null,
  },
  [(DS['TaxiTraj'] +  1).toString()]:{
    [STCIndexType['data2cube']]: null,
    [STCIndexType['cube2data']]: null,
  }
}

export default class STC extends Service{
  // 数据缓存
  public async getData(source:DS, indexType:STCIndexType){
    const sourceIdx = (source+ 1).toString()
    if(!datas[sourceIdx][indexType]){
      // 读取一次性所有数据，此处需要读取大文件
      let data = await fileUtil.readJson(FILE_PATH[sourceIdx][indexType])
      datas[sourceIdx][indexType] = data
    }
    return datas[sourceIdx][indexType] || {}
  }

  /**
   * 查询符合条件范围的 立方体单元
   */
  public async queryCellsInRange(): Promise<CubeCell[]>{
    const { ctx } = this
    console.time('queryCellsInRange')
    const cube: Cube = await loadCube()

    /**
      *  // geo: [maxlng, minlng, maxlat, minlat]
      *  geo: [120.623029, 120.707524, 28.027669, 27.988246],
      *  // time: [min, max]
      *  time: ["00:06:33", "00:12:56"]
     */
    const { geo, time, boolOp = BoolOperate['Union'] } = ctx.request.body
    let geoParams: GeoParams | null = null,
        timeParams:TimeParams | null = null

    if(Array.isArray(geo) && geo.length === 4){
      geoParams= {
        MaxLng: ctx.request.body.geo[0],
        MinLng: ctx.request.body.geo[1],
        MaxLat: ctx.request.body.geo[2],
        MinLat: ctx.request.body.geo[3]
      }
    }

    if(Array.isArray(time) && time.length === 2){
      let minTime = ctx.request.body.time[0],
          maxTime = ctx.request.body.time[1],
          timeInterval = cube.config.timeSlice
      timeParams= {
        MinTime: timeToSliceIndex(minTime, timeInterval),
        MaxTime:  timeToSliceIndex(maxTime, timeInterval),
      }
    }

    console.log('query', geoParams, timeParams)
    query({ cube, geoParams, timeParams, boolOp })

    console.timeEnd('queryCellsInRange')
    return cube.cellsInFilter
  }

  /**
   * 经过这些立方体单元的数据 ID
   * @param cells 时空立方体单元
   * @param source 数据源
   */
  public async getIdsInCells(cellsId: string[], source:DS): Promise<string[]>{
    console.time(`getIdsInCells`)
    console.time(`getIdsInCells Load`)
    let data = await this.getData(source, STCIndexType['cube2data'])
    console.timeEnd(`getIdsInCells Load`)

    let idArr: Set<string> = new Set(),
        datasIncell = {}
    // console.log(cellsId.length)
    // console.time(`getIdsInCells for`)
    cellsId.forEach((cellId:string) => {
      // console.log(cellId)
      datasIncell = data[cellId] || {}

      Object.keys(datasIncell).forEach(id => {
        idArr.add(id)
      });
      // idArr = idArr.concat(
      //   Object.keys(datasIncell)
      // )
    })
    // console.timeEnd(`getIdsInCells for`)

    console.timeEnd('getIdsInCells')
    return Array.from(idArr)
  }

  /**
   * 经过这些立方体单元的详细数据列表
   * @param cells 时空立方体单元
   * @param source 数据源
   */
  public async getDatasInCells(cellsId: string[], source:DS): Promise<STCDataItem[]>{
    console.time(`getDatasInCells`)
    let data = await this.getData(source, STCIndexType['cube2data'])

    let allData = {},
        datasIncell = {}

    Object.keys(data).map(cellId => {
      // 过滤 data，返回 cell 内的轨迹数据
      if(!cellsId.includes(cellId)) delete data[cellId]
      else{
        // 将处于不同cell内的轨迹片段合并
        datasIncell = data[cellId]
        Object.keys(datasIncell).map((dataId:string) => {
          if(!allData[dataId]){
            allData[dataId] = {}
          }
          Object.assign(allData[dataId], datasIncell[dataId])
        })
      }
    })

    const datasArr:STCDataItem[] = [] 

    // 对每一条轨迹的片段进行排序, 按照下标排序
    Object.keys(allData).map((dataId:string) => {
      // 轨迹片段
      let segments = allData[dataId]
      // 轨迹片段下标
      let segmentIds = Object.keys(segments)
      let sortedSegments:Point[][] = []
      // 排序
      segmentIds.sort((a,b) => Number(a) - Number(b))
      // 合并
      if(segmentIds.length <= 1){
        sortedSegments = Object.values(segments)
      }else{
        sortedSegments.push(segments[segmentIds[0]])
        for(let i = 1; i < segmentIds.length;i++){
          if(1 === (Number(segmentIds[i]) - Number(segmentIds[i-1]))){ // 相邻的
            let lastIdx = sortedSegments.length - 1
            sortedSegments[lastIdx].push(...segments[segmentIds[i]])
          }else{ //  非相邻
            sortedSegments.push(segments[segmentIds[i]])
          }
        }
      }

      // 1. 每段算一条
      sortedSegments.map((segment, i) => {
        datasArr.push({
          id: dataId + '-' + i,
          data: segment
        })
      })

      // 2. 将每一段合成一条
      // sortedSegments.map(segment => {
      //   datasArr.push({
      //       carNo: dataId,
      //       points: segment.reduce((a,b)=> a.concat(b),[])
      //   })
      // })
    })
    console.timeEnd(`getDatasInCells`)
    return datasArr
  }


  /**
   * 获取每个数据的 索引信息
   * @param datasID 数据 id 
   * @param source 数据源
   */
  public async getSTCInfoOfDatas(datasID: string[], source:DS): Promise<queryRes>{
    console.time('getSTCInfoofDatas')
    let data = await this.getData(source, STCIndexType['data2cube'])
    let res: queryRes = []
    res  = datasID.map((id: string) => {
      const { bbx, stcubes } = data[id.toString()] || {}
      if(!bbx || !stcubes){
        this.logger.error(`数据 ${id} 在 data2cube 文件中找不到索引`)
        return { id }
      }

      const { timeRange:t, areaRange:a } = bbx

      return { 
        id, 
        stcubes,
        bbx: {
          timeRange: [timeFormat1(t['min']), timeFormat1(t['max'])],
          areaRange: [a['maxLng'], a['minLng'], a['maxLat'], a['minLat']]
        }
      }
    })

    console.timeEnd('getSTCInfoofDatas')
    return res
  }

  
}