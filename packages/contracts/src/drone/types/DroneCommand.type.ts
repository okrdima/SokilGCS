import { z } from 'zod';

export const DroneCommandSchema = z.object({
  droneId: z.string(),
  command: z.string(),
  parameters: z.record(z.any(), z.any()).optional(),
});
export type DroneCommand = z.infer<typeof DroneCommandSchema>;
