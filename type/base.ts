export interface Trajectory{
  id: string, // 轨迹id
  segments: Point[][]
}

export interface GeoPoint{
  longitude: number,
  latitude: number,
}

export interface Point{
  longitude: number,
  latitude: number,
  time: string
}

export interface Traj{
  id: string,
  points: Point[]
}

// 原子操作 的 布尔组合
export const enum BoolOperate{
  Union = 1 ,  // 并集（只需满足其一）
  Intersection = 2,  // 交集 （同时满足）
}

// 数据源类型 DataSource
export const enum DS{  
  MobileTraj = 0,
  TaxiTraj = 1,
  Weibo = 2,
  Poi = 3,
}

export const enum QueryDataByMode {
  STCubes = 0,
  Time = 1,
  Geo = 2
}

export interface SpaceTimeParam {
  geo?: GeoParam,
  time?: TimeParam
}
/** 条件格式 */
export type GeoParam = number[] // [maxlng, minlng, maxlat, minlat]
export type TimeParam = string[] // [min, max]
// 空间包围盒
export type BBox = GeoParam // [maxlng, minlng, maxlat, minlat]
// 时间范围
export type TimeExtend = TimeParam // ["00:06:33", "00:12:56"]