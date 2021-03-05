import { Service } from 'egg';
import { BBox } from '@type/base'
import { queryRes, queryResItem } from '../controller/py'
import { Cube, CubeCell, GeoParams, TimeParams } from '@type/cube'
import { Trajectory, Point, BoolOperate } from '@type/base'
import { query, loadCube, timeToSliceIndex } from '../utils/stc'
import { TaxiTrajectory } from '@type/taxi'


const fileUtil = require('../utils/file')
const FILE_PATH = {
  "taxi2cube": 'taxiSDATA.json',
  "cube2taxi": 'taxiSTCube.json'
}

/**
 * Taxi Service
 */
export default class Taxi extends Service {


  /**
    STC  查询逻辑：
    0. 初始化，load 时空立方体
    1. 传入时空条件，过滤得到符合条件的时空立方体id
    2. 根据时空立方体获取符合条件的轨迹段，合并成轨迹
  */
  /**
   * 查询符合条件的立方体id
   */
  public async queryCells(): Promise<CubeCell[]>{
    const { ctx } = this
    console.time('时空立方体范围查询时间: ')
    const cube: Cube = await loadCube()

    /**
      *  // geo: [maxlng, minlng, maxlat, minlat]
      *  geo: [120.623029, 120.707524, 28.027669, 27.988246],
      *  // time: [min, max]
      *  time: ["00:06:33", "00:12:56"]
     */
    const { geo, time, boolOp = BoolOperate['Intersection'] } = ctx.request.body
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

    query({ cube, geoParams, timeParams, boolOp })
    console.timeEnd('时空立方体范围查询时间: ')
    return cube.cellsInFilter
  }

  /**
   *  返回符合范围内的立方体内的完整轨迹
   */
  public async trajectoryInCells(cellsId: string[]): Promise<Trajectory[]>{
    // 读取所有轨迹数据，此处需要读取大文件
    let data = await fileUtil.readJson(FILE_PATH['cube2taxi'])
    let allTrajs = {}
    let cellTrajs 
    // const cellsId = cells.map(c => c.id.toString())

    // 过滤 data，返回 cell 内的轨迹数据
    Object.keys(data).map(cellId => {
      if(!cellsId.includes(cellId)) delete data[cellId]
      else{
        // 将处于不同cell内的轨迹片段合并
        cellTrajs = data[cellId]
        Object.keys(cellTrajs).map(trajsId => {
          if(!allTrajs[trajsId]){
            allTrajs[trajsId] = {}
          }
          Object.assign(allTrajs[trajsId], cellTrajs[trajsId])
        })
      }
    })

    const trajectorys:Trajectory[] = []
    // 对每一条轨迹的片段进行排序
    Object.keys(allTrajs).map(trajId => {
      let segments = allTrajs[trajId]
      let segmentIds = Object.keys(segments)
      let sortedTrajs:Point[][] = []
      // 排序
      segmentIds.sort((a,b) => Number(a) - Number(b))
      // 合并
      if(segmentIds.length <= 1){
        sortedTrajs = Object.values(segments)
      }else{
        sortedTrajs.push(segments[segmentIds[0]])
        for(let i = 1; i < segmentIds.length;i++){
          if(1 === (Number(segmentIds[i]) - Number(segmentIds[i-1]))){ // 相邻的
            let lastIdx = sortedTrajs.length - 1
            sortedTrajs[lastIdx].push(...segments[segmentIds[i]])
          }else{ //  非相邻
            sortedTrajs.push(segments[segmentIds[i]])
          }
        }
      }
      trajectorys.push({
        id: trajId,
        segments: sortedTrajs,
      })
    })
    return trajectorys
  }


  /**
   * 返回经过这些立方体单元的轨迹ID数组
   * @param cells 
   */
  public async trajectoryIdsInCells(cells: CubeCell[]): Promise<string[]>{
    // 读取所有轨迹数据，此处需要读取大文件
    let data = await fileUtil.readJson(FILE_PATH['cube2taxi'])
    let trajIds: string[] = []
    const cellsId = cells.map(c => c.id.toString())
    let trajsIncell 

    // 过滤 data，返回 cell 内的轨迹数据
    Object.keys(data).map(cellId => {
      if(cellsId.includes(cellId)){
        trajsIncell = data[cellId]
        trajIds = trajIds.concat(
          Object.keys(trajsIncell)
        )
      }
    })
    return  Array.from((new Set(trajIds)))
  }

  /**
   * 获取每辆车对应的 索引信息
   * @param trajectoryIds 
   */
  public async trajectoryCells(trajectoryIds: string[]): Promise<queryRes>{
    console.time('轨迹索引查询时间: ')
    let data = await fileUtil.readJson(FILE_PATH['taxi2cube'])    
    let res:queryRes = trajectoryIds.map((id: string) => {
      const { bbx, stcubes } = data[id] || {}
      return { id, stcubes, bbx }
      // return { id, bbx }
    })
    console.timeEnd('轨迹索引查询时间: ')
    return res
  }

  /**
   * Python 端查询
   */
  public async pyQuery(){
    const { ctx }  = this; 
    this.logger.info('py 查询出租车数据...')
    this.logger.info('输入条件: ', ctx.request.body)

    // 0. 设置默认条件
    let { geo, time } = ctx.request.body
    if(!geo || !time){
      ctx.request.body= {
        "geo": [120.707524, 120.623029, 28.027669, 27.988246],
        "time": ["01:06:33", "03:12:56"],
        // "boolOp": 1
      }
    }

    //  1. 过滤 stc cell
    let cells = await this.queryCells();
    console.log('时空立方体数量:', cells.length)

    // 2. 获取范围内经过轨迹 id
    let trajsIds:string[] = await this.trajectoryIdsInCells(cells)
    console.log('返回轨迹数量:', trajsIds.length)

    // 3. 读取 trajId -> cellID 索引的文件
    let res:queryRes = await this.trajectoryCells(trajsIds)
    return res;
  }


  // 输入一个数据源、一个ID、一个box，返回这个源内对应ID的数据是否在box内。
  public async isOneTaxiInBbox(carId, bbox: BBox){
    // 1. 根据 id 取到 轨迹数据
    let res: queryRes = await this.trajectoryCells([carId])
    if(res.length == 0){
      this.logger.error(`ID ${carId} 无对应数据！`)
      return false
    }

    let trajItem: queryResItem = res[0]
    console.log(trajItem,bbox)

    // 2. 比较两个 bbox ？
    // console.log(bbox) 
    return true
  }

  public async getOneTaxi(carId): Promise<TaxiTrajectory[]>{
    // 获取该数据源内该ID对应的数据
    let res: queryRes = await this.trajectoryCells([carId])
    if(res.length == 0){
      this.logger.error(`ID ${carId} 无对应数据！`)
      return []
    }
    let trajItem: queryResItem = res[0]

    let stcTrajs: Trajectory[] =  await this.trajectoryInCells(trajItem.stcubes.map((id) => id.toString()))
    
    let taxiTrajs: TaxiTrajectory[] = []

    stcTrajs.filter((t) => t.id === carId)
      .map((t) => {
        t.segments.map((s, i) => {
          taxiTrajs.push({
            carNo: t.id + '-' + i,
            points: s
          })
        })
      })

    return taxiTrajs
  }
}
