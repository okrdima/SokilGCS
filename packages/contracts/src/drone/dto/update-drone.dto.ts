import type { z } from 'zod';
import { DroneEntitySchema } from '../entities';

export const UpdateDroneSchema = DroneEntitySchema;

export type UpdateDrone = z.infer<typeof UpdateDroneSchema>;
