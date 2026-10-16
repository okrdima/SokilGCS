import { z } from 'zod';

export const Vector3DSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
}).strict();


export type Vector3D = z.infer<typeof Vector3DSchema>;
