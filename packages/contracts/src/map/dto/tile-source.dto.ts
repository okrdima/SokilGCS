import { z } from 'zod';

export const TileSourceSchema = z.object({
  urlTemplate: z.string(),
  minZoom: z.number().min(0),
  maxZoom: z.number().min(0),
});
export type TileSource = z.infer<typeof TileSourceSchema>;
