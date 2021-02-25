import { Cube, CubeConfig, CubeCell, GeoParams, TimeParams } from '@type/cube'

/**
 * 初始化时空立方体
 */
function _loadCube(): Cube {
  const config: CubeConfig = {
    MaxLng: 1,
    MaxLat: 1,
    MinLng: 1,
    MinLat: 1,
    m: 1, 
    n: 1, 
    width: 1,
    timeSlice: 1,  
    t: 1, 
  }

  const cube: Cube = {
    config: config,
    cells: [],
    cellsInFilter: []
  }

  return cube
}

function initCube(): Cube{
  const cube = _loadCube()
  const c = cube.config

  const cells: CubeCell[] = []
  let cellId = 0
  for(let _m = 0; _m < c.m; _m++){
    for(let _n = 0; _n < c.n; _n++){
      for(let _t = 0; _t < c.t; _t++){
        cells.push({
          id: ++cellId, // todo  ID生成规则待定
          lng: c.MinLng + _m * c.width,
          lat: c.MaxLat - _n * c.width,
          time: c.timeSlice * _t
        })
      }
    }
  }
  cube.cells = cells
  return cube
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
 * @param param0 
 */
function query({ cube, geoParams, timeParams}){
  let cellsInFilter: CubeCell[] = cube.cells
  geoParams && (cellsInFilter = _filterInGeo(cube, geoParams))
  cube.cellsInFilter = cellsInFilter
  timeParams && (cellsInFilter = _filterInTime(cube, timeParams))
  cube.cellsInFilter = cellsInFilter
}

export {
  initCube,
  query
}