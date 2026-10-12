import type { z } from 'zod';

import { WaypointSchema } from './mission-plan.dto';
export const WaypointDTOSchema = WaypointSchema;
export type WaypointDTO = z.infer<typeof WaypointDTOSchema>;
