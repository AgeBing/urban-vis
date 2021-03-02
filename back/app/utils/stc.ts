import { Cube, CubeConfig, CubeCell, GeoParams, TimeParams } from '@type/cube'
// import { BoolOperate } from '@type/base'
import { BoolOperate } from '@type/base'
const fileUtil = require('./file')
const _ = require('lodash/array');

const FILES_PATH = {
  CUBE_CONFIG: 'STCubeConfig.json',
  CUBE_CELLS: 'STCCube.json'
}

async function _loadSTCConfig(): Promise<CubeConfig>{
  const c = await fileUtil.readJson(FILES_PATH['CUBE_CONFIG'])
  return {
    MaxLng: c.area.maxLng,
    MaxLat: c.area.maxLat,
    MinLng: c.area.minLng,
    MinLat: c.area.minLat,
    m: c.splitLngNum,
    n: c.splitLatNum,
    width: c.gridWidth,
    timeSlice: c.splitInterval,
    t: c.splitTimeNum
  }
}
async function _loaSTCCells(): Promise<CubeCell[]>{
  const cells:CubeCell[] = await fileUtil.readJson(FILES_PATH['CUBE_CELLS'])
  return cells
}

/**
 * 初始化时空立方体
 */
let cubeInstance:Cube
async function loadCube(): Promise<Cube>{
  if(!cubeInstance){
    const config: CubeConfig = await _loadSTCConfig()
    const cells:CubeCell[] = await _loaSTCCells()
    const cube: Cube = {
      config: config,
      cells: cells,
      cellsInFilter: []
    }
    cubeInstance = cube
  }
  return cubeInstance
}

// "00:06:33" ->  6/interval
function timeToSliceIndex(time: string, interval:number){
  return Math.floor(Number(time.slice(3,5)) / interval )
}
function _filterInGeo(cells:CubeCell[], config: CubeConfig, params:GeoParams): CubeCell[]{
  return cells.filter((cell:CubeCell) => (
    (cell.lat <= params.MaxLat) && 
    (cell.lat - config.width >= params.MinLat) && 
    (cell.lng >= params.MinLng) && 
    (cell.lng + config.width <= params.MaxLng)
  ))
}
function _filterInTime(cells:CubeCell[], params:TimeParams): CubeCell[]{
  return cells.filter((cell:CubeCell) => (
    cell.time >= params.MinTime && cell.time <= params.MaxTime
  ))
}

/**
 * 输入时空条件，查询符合条件的时空单元
 */
function query({ cube, geoParams, timeParams, boolOp = BoolOperate['Intersection'] }){
  let filteredCells: CubeCell[] = []
  let filteredCellsArr: CubeCell[][] = []
  if(geoParams){
    filteredCells = _filterInGeo(cube.cells, cube.config, geoParams)
    filteredCellsArr.push( filteredCells )
  }
  if(timeParams){
    filteredCells = _filterInTime(cube.cells, timeParams)
    filteredCellsArr.push( filteredCells )
  }
  console.log("Bool Mode ", boolOp)
  console.log("Befor Bool ", filteredCellsArr[0]?.length,  filteredCellsArr[1]?.length)
  let boolResult = []
  if(boolOp === BoolOperate['Union']){
    // https://lodash.com/docs/4.17.15#union
    // boolResult = _.unionBy( [...filteredCellsArr], 'id')  
    boolResult = _.unionBy(filteredCellsArr[0], filteredCellsArr[1], 'id')  
  }else{
    // boolResult = _.intersectionBy( [...filteredCellsArr], 'id')
    boolResult = _.intersectionBy(filteredCellsArr[0], filteredCellsArr[1], 'id')  
  }
  cube.cellsInFilter = boolResult
  console.log("After Bool ", cube.cellsInFilter.length)
}

export {
  loadCube,
  query,
  timeToSliceIndex
}