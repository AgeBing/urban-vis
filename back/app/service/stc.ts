import { Service } from 'egg';
import { Cube, CubeCell, GeoParams, TimeParams } from '@type/cube'
import { query, initCube } from '../utils/stc'
const fileUtil = require('../utils/file')

export default class STC extends Service{

  /**
   * 查询符合条件的立方体id
   */
  public async queryCells(): Promise<CubeCell[]>{
    const cube: Cube = initCube()
    const geoParams: GeoParams = { // https://lbs.qq.com/tool/getpoint/index.html
      MaxLng: 120.644471,
      MinLng: 120.620185,
      MaxLat: 28.422742,
      MinLat: 28.059230
    }
    const timeParams: TimeParams = {
      MinTime: 12,
      MaxTime: 20
    }
    query({ cube, geoParams, timeParams })
    return cube.cellsInFilter
  }

  /**
   * 单个立方体内包含的轨迹段
   */
  public async trajectoryInCells(cells: CubeCell[]){
    // 读取所有轨迹数据，此处需要读取大文件
    const PATH = '/Users/age/Desktop/code/urban-vis/data/data_in_use/xxx.json'
    const data = await fileUtil.readJson(PATH)
    // 过滤 data，返回 cell 内的轨迹数据

  }

  public async mergeTrajs(){
    const cells = await this.queryCells()
    const datas = await this.trajectoryInCells(cells)

    // 合并轨迹段  [ c * t * p ]
    // 1. 从不同的 cells 内挑出原属同一条轨迹的轨迹段 [复杂度 c * t (cell 数量 * 轨迹条数)]
    // 2. 对同一条轨迹的轨迹段开启合并 [复杂度：p（轨迹点数量)]
  }
}