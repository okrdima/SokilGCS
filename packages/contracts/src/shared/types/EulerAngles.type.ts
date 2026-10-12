import { z } from 'zod';

/**
 * Euler angles in degrees.
 * Pitch & Roll: [-180, 180]
 * Yaw: [0, 360]
 */
export const EulerAnglesSchema = z.object({
  pitch: z.number().min(-180).max(180),
  roll: z.number().min(-180).max(180),
  yaw: z.number().min(0).max(360),
});

export type EulerAngles = z.infer<typeof EulerAnglesSchema>;
