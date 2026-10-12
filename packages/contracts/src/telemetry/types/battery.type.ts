import { z } from 'zod';

export const BatterySchema = z.object({
  percentage: z.number().min(0).max(100),
  voltage: z.number().min(0),
});

export type Battery = z.infer<typeof BatterySchema>;
