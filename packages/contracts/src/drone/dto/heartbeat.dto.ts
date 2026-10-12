import { z } from 'zod';

export const HeartbeatSchema = z.object({
  droneId: z.string(),
  timestamp: z.number().int().positive(),
});
export type Heartbeat = z.infer<typeof HeartbeatSchema>;
