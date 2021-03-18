import { Point } from "./base";

/**
 * 时空立方体
 */
export interface Cube{
  config: CubeConfig,
  cells: CubeCell[],
  cellsInFilter: CubeCell[],
  locas: LocaCell[]
}

/**
 * 配置项
 */
export interface CubeConfig{
  /**
   *   MinLng,MaxLat  ---------  MaxLng,MaxLat
   *         |                         |
   *         |                         |
   *         |                         |
   *   MinLng,Minlat  ---------  MaxLng,MinLat
   */
  MaxLng: number,
  MaxLat: number,
  MinLng: number,
  MinLat: number,
  
  // 空间上 m * n
  m: number, // 表示 经度范围上有m个cube
  n: number, // 表示 纬度范围上有n个cube
  scubeNum?: number,
  width: number, 

  // 时间 t
  timeSlice: number,  // 时间片大小 单位分
  t: number,  // 1440/t
}

/**
 * 时空立方体单元
 */
export interface CubeCell{
  id: number,
  lat: number, // 左上角 位置
  lng: number,
  time: number, // 开始时间 单位分
  // trajIds: string[],  // 经过该立方体的轨迹id
}

/**
 * 时空立方体最底下一层的单元
 */
export interface LocaCell{
  id: number,
  lat: number, // 中心点 位置
  lng: number,
}

export interface GeoParams{
  MaxLng: number,
  MaxLat: number,
  MinLng: number,
  MinLat: number,
}

export interface TimeParams{
  MinTime: number,
  MaxTime: number
}


export interface STCDataItem{
  id: string,
  data: Point[]
}

export type STCData = STCDataItem[]