export enum DroneMode {
  ARMED = 'ARMED',
  DISARMED = 'DISARMED',
  GUIDED = 'GUIDED',
  AUTO = 'AUTO',
  RTL = 'RTL',
}

export interface DroneState {
  mode: DroneMode;
  armed: boolean;
  batteryLevel?: number; // percentage
}
