import { z } from 'zod';
import { EulerAnglesSchema } from '../../shared/types';

/**
 * Describes the orientation of the drone in 3D space.
 */
export const AttitudeSchema = z.object({
  orientation: EulerAnglesSchema,
});

export type Attitude = z.infer<typeof AttitudeSchema>;
