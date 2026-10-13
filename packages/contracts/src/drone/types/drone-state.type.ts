import { z } from 'zod';
import { FlightModeSchema } from './flight-mode.type';

export const DroneStateSchema = z.object({
  droneId: z.string(),
  mode: FlightModeSchema,
  heartbeat: z.number().int().positive(),
});
export type DroneState = z.infer<typeof DroneStateSchema>;
