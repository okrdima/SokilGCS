export interface SystemStatusDTO {
  cpuLoad: number;
  sensors: {
    IMU: boolean;
    Baro: boolean;
    Compass: boolean;
  };
}
