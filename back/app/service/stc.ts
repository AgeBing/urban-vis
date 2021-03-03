import { Service } from 'egg';
import { Cube, CubeCell, GeoParams, TimeParams } from '@type/cube'
import { Trajectory, Point, BoolOperate } from '@type/base'
import { query, loadCube, timeToSliceIndex } from '../utils/stc'
const fileUtil = require('../utils/file')

export default class STC extends Service{

  /**
   * 查询符合条件的立方体id
   */
  public async queryCells(): Promise<CubeCell[]>{
    const { ctx } = this
    const cube: Cube = await loadCube()
    // console.log('Load Cube:', cube)

    /**
      *  // geo: [maxlng, minlng, maxlat, minlat]
      *  geo: [120.623029, 120.707524, 28.027669, 27.988246],
      *  // time: [min, max]
      *  time: ["00:06:33", "00:12:56"]
     */
    const { geo, time, boolOp = BoolOperate['Intersection'] } = ctx.request.body
    let geoParams: GeoParams | null = null,
        timeParams:TimeParams | null = null
    if(!geo && !time){  // 为设置参数（调试）
      geoParams = { // https://lbs.qq.com/tool/getpoint/index.html
        MaxLng: 120.707524,
        MinLng: 120.623029,
        MaxLat: 28.027669,
        MinLat: 27.988246
      }
      timeParams = {
        MinTime: 12,
        MaxTime: 50
      }
    }else{
      if(Array.isArray(geo) && geo.length === 4)
        geoParams= {
          MaxLng: ctx.request.body.geo[0],
          MinLng: ctx.request.body.geo[1],
          MaxLat: ctx.request.body.geo[2],
          MinLat: ctx.request.body.geo[3]
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
    }

    query({ cube, geoParams, timeParams, boolOp })
    // console.log('After Filter Cells Length:', cube.cellsInFilter.length)
    return cube.cellsInFilter
  }

  /**
   * 单个立方体内包含的轨迹段
   */
  public async trajectoryInCells(cells: CubeCell[]): Promise<Trajectory[]>{
    // 读取所有轨迹数据，此处需要读取大文件
    const PATH = 'taxi.json'
    let data = await fileUtil.readJson(PATH)
    let allTrajs = {}
    let cellTrajs 
    const cellsId = cells.map(c => c.id.toString())
    // 过滤 data，返回 cell 内的轨迹数据
    Object.keys(data).map(id => {
      if(!cellsId.includes(id)) delete data[id]
      else{
        // 将处于不同cell内的轨迹片段合并
        cellTrajs = data[id]
        Object.keys(cellTrajs).map(trajsId => {
          if(!allTrajs[trajsId]){
            allTrajs[trajsId] = {}
          }
          Object.assign(allTrajs[trajsId], cellTrajs[trajsId])
        })
      }
    })
    const trajectorys:Trajectory[] = []
    // 对每一条轨迹进行排序
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
}