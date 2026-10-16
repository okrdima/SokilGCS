import { z } from 'zod';

export const DeleteDroneSchema = z.object({
  _id: z.string().uuid(),
});
export type DeleteDrone = z.infer<typeof DeleteDroneSchema>;
