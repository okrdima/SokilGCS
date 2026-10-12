import { z } from 'zod';

export const DeleteDroneSchema = z.object({
  _id: z.string(),
});
export type DeleteDrone = z.infer<typeof DeleteDroneSchema>;
