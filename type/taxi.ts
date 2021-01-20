export interface TaxiPoint {
  longitude: number;
  latitude: number;
  time: string;
}
export  interface TaxiTrajectory {
  carNo: string;
  points: TaxiPoint[];
}