import { z } from 'zod';

export const Vector2DSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export type Vector2D = z.infer<typeof Vector2DSchema>;
