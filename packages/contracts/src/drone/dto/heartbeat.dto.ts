export interface HeartbeatDTO {
  status: string;
  boardType: 'Multicopter' | 'FixedWing' | 'VTOL';
  flightController: 'ArduPilot' | 'PX4';
}
