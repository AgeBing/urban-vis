export interface Trajectory{
  id: string, // 轨迹id
  segments: Point[][]
}
export interface Point{
  longitude: number,
  latitude: number,
  time: string
}

// 原子操作 的 布尔组合
export const enum BoolOperate{
  Union = 1 ,  // 并集（只需满足其一）
  Intersection = 2,  // 交集 （同时满足）
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