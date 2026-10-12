import { z } from 'zod';

export const WaypointSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  altitude: z.number(),
  holdTime: z.number().min(0).optional(),
});
export type Waypoint = z.infer<typeof WaypointSchema>;

export const MissionPlanSchema = z.object({
  missionId: z.string(),
  waypoints: z.array(WaypointSchema),
  description: z.string().optional(),
});
export type MissionPlan = z.infer<typeof MissionPlanSchema>;
