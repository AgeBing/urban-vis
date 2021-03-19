export interface TaxiPoint {
  longitude: number;
  latitude: number;
  time: string;
}
export  interface TaxiTrajectory {
  id: string;
  points: TaxiPoint[];
}