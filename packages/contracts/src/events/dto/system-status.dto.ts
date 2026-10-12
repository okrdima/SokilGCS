import { z } from 'zod';

export const SystemStatusSchema = z.object({
  uptime: z.number().positive(),
  loadAverage: z.number().min(0),
  memoryUsage: z.object({
    total: z.number().positive(),
    used: z.number().positive(),
    free: z.number().positive(),
  }),
});
export type SystemStatus = z.infer<typeof SystemStatusSchema>;
