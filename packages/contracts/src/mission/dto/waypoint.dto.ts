export interface WaypointDTO {
  coordinate: { lat: number; lon: number; alt: number };
  speed: number;
  action: 'Loiter' | 'Land' | 'Photo' | 'None';
}
