export interface Trajectory{
  id: string, // 轨迹id
  segments: Point[][]
}

export interface Point{
  longitude: number,
  latitude: number,
  time: string
}