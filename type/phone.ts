export interface PhonePoint {
  longitude: number;
  latitude: number;
  time: string;
}

export  interface PhoneTrajectory {
  IMEI: string;
  points: PhonePoint[];
}