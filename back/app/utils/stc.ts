import { Cube, CubeConfig, CubeCell, GeoParams, TimeParams } from '@type/cube';
import { BoolOperate } from '@type/base';
import { Point, GeoPoint } from '@type/base';
// import { Point } from '@type/base'

import { isPointWithinRect, isPointWithinInterval } from './math';
import * as moment from 'moment';
const fileUtil = require('./file');
const _ = require('lodash/array');

const FILES_PATH = {
  CUBE_CONFIG: 'STCubeConfig.json',
  CUBE_CELLS: 'STCube.json',
};

/**
 * 一、初始化部分
 */
export const DEFAULT_GEO =  [120.747524, 120.593029, 28.027669, 27.958246]
export const DEFAULT_TIME = ['00:00:00','23:59:59']
async function _loadSTCConfig(): Promise<CubeConfig> {
  const c = await fileUtil.readJson(FILES_PATH.CUBE_CONFIG);
  return {
    MaxLng: c.area.maxLng,
    MaxLat: c.area.maxLat,
    MinLng: c.area.minLng,
    MinLat: c.area.minLat,
    m: c.splitLngNum,
    n: c.splitLatNum,
    width: c.gridWidth,
    timeSlice: c.splitInterval,
    t: c.splitTimeNum,
  };
}
async function _loaSTCCells(): Promise<CubeCell[]> {
  const cells:CubeCell[] = await fileUtil.readJson(FILES_PATH.CUBE_CELLS);
  return cells;
}

/**
 * 初始化时空立方体
 */
let cubeInstance:Cube;
async function loadCube(): Promise<Cube> {
  if (!cubeInstance) {
    const config: CubeConfig = await _loadSTCConfig();
    const cells:CubeCell[] = await _loaSTCCells();
    const cube: Cube = {
      config,
      cells,
      cellsInFilter: [],
    };
    cubeInstance = cube;
    console.log('STC Cube Loaded~');
  }
  return cubeInstance;
}
loadCube();


/**
 *  二、计算转换部分
 */


// "00:06:33" ->  6/interval
function timeToSliceIndex(time: string, interval:number) {
  const a = moment(time, 'HH:mm:ss');
  const m = a.hour() * 60 + a.minute();
  return Math.floor(Number(m) / interval);
}

// "2014-02-12 00:06" ->  6/interval
function dateTimeToSliceIndex(time: string, interval:number) {   
  const a = moment(time, 'YYYY-MM-DD HH:mm');
  const m = a.hour() * 60 + a.minute();
  return Math.floor(Number(m) / interval);
}


//  6/interval -> "00:06:33"
function sliceIndexToTime(idx:number, interval:number) {
  const m = idx * interval;
  const hour = Math.floor(m / 60);
  const minute = m % 60;
  return moment().set({ hour, minute, second: 0 }).format('HH:mm:ss');
}


// 计算出该坐标点所处的时空单元下标
async function geoToCubeIndex(point: GeoPoint) {
  const { longitude: lng, latitude: lat } = point;
  const config: CubeConfig = (await loadCube()).config;
  const { MinLat, MinLng, width, m } = config;

  const lngIndex = Math.floor((lng - MinLng) / width);
  const latIndex = Math.floor((lat - MinLat) / width);
  if (lngIndex < 0 || latIndex < 0) { return -1; }
  const idx = latIndex * m + lngIndex;
  return idx;
}

// 获取点的 STC cell 下标
async function pointToCubeIndex(point: Point): Promise<string> {
  const config: CubeConfig = (await loadCube()).config;
  const { timeSlice, m, n } = config;
  const { longitude, latitude, time } = point;
  const geoIdx = await geoToCubeIndex({ longitude, latitude });
  const timeIdx = dateTimeToSliceIndex(time, timeSlice);
  if (geoIdx === -1) return '-1';
  const idx = m * n * timeIdx + geoIdx;
  return idx.toString();
}


// 计算 cube cell 对应的范围信息，若超出范围 范围 null
async function getCubeCellBbx(idx:string) {
  const cube = await loadCube();
  const config:CubeConfig = cube.config;
  const { width, timeSlice } = config;
  const cell: CubeCell | undefined = cube.cells.find(cell => cell.id.toString() === idx);

  if (!cell) {
    return null;
  }

  const { lat = 0, lng = 0, time = 0 } = cell || {};

  const time1 = sliceIndexToTime(time, timeSlice);
  let time2 = sliceIndexToTime(time + 1, timeSlice);
  if (time2 === '00:00:00') time2 = '23:59:59';
  return {
    timeRange: [ time1, time2 ],
    areaRange: [ lng + width, lng, lat + width, lat ],
  };
}

// 找到某个点所对应的 cube
async function getCubeCellOfPoint(point: Point): Promise<CubeCell | undefined> {
  const cube = await loadCube();
  const cells = cube.cells;

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const areaRange = {
        minLat: cell.lat,
        maxLat: cell.lat + cube.config.width,
        minLng: cell.lng,
        maxLng: cell.lng + cube.config.width,
      },
      timeRange = {
        min: sliceIndexToTime(cell.time, cube.config.timeSlice),
        max: sliceIndexToTime(cell.time + 1, cube.config.timeSlice),
      };

    const boolA = isPointWithinRect(
        point,
        [
          areaRange.maxLng,
          areaRange.minLng,
          areaRange.maxLat,
          areaRange.minLat,
        ],
      ),
      boolB = isPointWithinInterval(
        point,
        [
          timeRange.min,
          timeRange.max,
        ],
      );

    if (boolA && boolB) {
      return cell;
    }
  }
}


/**
 *  三、查询部分
 */


/**
 * 用正方形来框选时空立方体单元
 * 精确比较范围
 * @param cells
 * @param config
 * @param params
 * @return
 */
function _filterInGeo(cells:CubeCell[], c: CubeConfig, p:GeoParams): CubeCell[] {
  return cells.filter((cell:CubeCell) => (
    (
      (cell.lng >= p.MinLng && cell.lng <= p.MaxLng) ||
      (cell.lng <= p.MinLng && (cell.lng + c.width) >= p.MinLng)
    ) &&
    (
      (cell.lat >= p.MinLat && cell.lat <= p.MaxLat) ||
      (cell.lat <= p.MinLat && (cell.lat + c.width) >= p.MinLat)
    )
  ),
    // (cell.lat <= params.MaxLat) &&
    // (cell.lat - config.width >= params.MinLat) &&
    // (cell.lng >= params.MinLng) &&
    // (cell.lng + config.width <= params.MaxLng)
  );
}

// 比较 cell id index
function _filterInTime(cells:CubeCell[], p:TimeParams): CubeCell[] {
  return cells.filter((cell:CubeCell) => (
    // cell.time >= params.MinTime && cell.time <= params.MaxTime
    cell.time >= p.MinTime && cell.time <= p.MaxTime
  ));
}

/**
 * 输入时空条件，查询符合条件的时空单元
 */
function query({ cube, geoParams, timeParams, boolOp = BoolOperate.Intersection }) {
  let filteredCells: CubeCell[] = [];
  const filteredCellsArr: CubeCell[][] = [];
  if (geoParams) {
    filteredCells = _filterInGeo(cube.cells, cube.config, geoParams);
    // console.log('_filterInGeo', filteredCells.length);
    filteredCellsArr.push(filteredCells);
  }
  if (timeParams) {
    filteredCells = _filterInTime(cube.cells, timeParams);
    // console.log('_filterInTime', filteredCells.length);
    filteredCellsArr.push(filteredCells);
  }


  let boolResult = [];
  if (boolOp === BoolOperate.Union) {
    // https://lodash.com/docs/4.17.15#union
    // boolResult = _.unionBy( [...filteredCellsArr], 'id')
    boolResult = _.unionBy(filteredCellsArr[0], filteredCellsArr[1], 'id');
  } else {
    // boolResult = _.intersectionBy( [...filteredCellsArr], 'id')
    boolResult = _.intersectionBy(filteredCellsArr[0], filteredCellsArr[1], 'id');
  }
  cube.cellsInFilter = boolResult;
  console.log('布尔操作 ', " geo:", filteredCellsArr[0]?.length, " time:", filteredCellsArr[1]?.length, boolOp, " 最后返回:", cube.cellsInFilter.length);
}

export {
  loadCube,
  query,
  timeToSliceIndex,
  dateTimeToSliceIndex,
  sliceIndexToTime,
  getCubeCellOfPoint,
  geoToCubeIndex,
  pointToCubeIndex,
  getCubeCellBbx,
};
