import { z } from 'zod';
import { GeoPointSchema } from '@/shared/types';

export const PositionSchema = z.object({
  point: GeoPointSchema,
  velocity: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
});

export type Position = z.infer<typeof PositionSchema>;
