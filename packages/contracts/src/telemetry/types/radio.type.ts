import { z } from 'zod';

export const RadioSchema = z.object({
  rssi: z.number().min(-120).max(0),
});

export type Radio = z.infer<typeof RadioSchema>;
