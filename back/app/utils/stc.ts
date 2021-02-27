import { Cube, CubeConfig, CubeCell, GeoParams, TimeParams } from '@type/cube'
const fileUtil = require('./file')

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


function _filterInGeo(cube:Cube, params:GeoParams): CubeCell[]{
  return cube.cellsInFilter.filter((cell:CubeCell) => (
    (cell.lat <= params.MaxLat) && 
    (cell.lat - cube.config.width >= params.MinLat) && 
    (cell.lng >= params.MinLng) && 
    (cell.lng + cube.config.width <= params.MaxLng)
  ))
}
function _filterInTime(cube:Cube, params:TimeParams): CubeCell[]{
  return cube.cellsInFilter.filter((cell:CubeCell) => (
    cell.time >= params.MinTime && cell.time <= params.MaxTime
  ))
}

/**
 * 输入时空条件，查询符合条件的时空单元
 */
function query({ cube, geoParams, timeParams}){
  cube.cellsInFilter = cube.cells
  if(geoParams) cube.cellsInFilter = _filterInGeo(cube, geoParams)
  if(timeParams) cube.cellsInFilter = _filterInTime(cube, timeParams)
}

export {
  loadCube,
  query
}