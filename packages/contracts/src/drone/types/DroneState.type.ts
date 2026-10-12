import { z } from 'zod';
import { DroneCommandSchema } from './DroneCommand.type';
import { FlightModeSchema } from './FlightMode.type';

export const DroneStateSchema = z.object({
  droneId: z.string(),
  mode: FlightModeSchema,
  heartbeat: z.number().int().positive(),
  lastCommand: DroneCommandSchema.optional(),
});
export type DroneState = z.infer<typeof DroneStateSchema>;
