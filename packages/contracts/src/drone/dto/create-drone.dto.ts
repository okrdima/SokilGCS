import type { z } from 'zod';
import { DroneEntitySchema } from '../entities';

export const CreateDroneSchema = DroneEntitySchema.omit({
  _id: true,
  _createdAt: true,
  _updatedAt: true,
  _createdBy: true,
  _updatedBy: true,
});


export type CreateDrone = z.infer<typeof CreateDroneSchema>;
