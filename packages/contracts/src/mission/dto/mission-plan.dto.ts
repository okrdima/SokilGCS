import { WaypointDTO } from './waypoint.dto';

export interface MissionPlanDTO {
  waypoints: WaypointDTO[];
  geofences?: { id: string; points: { lat: number; lon: number; }[] }[];
  rallyPoints?: { lat: number; lon: number; }[];
}
