import { z } from 'zod';
import { GeoPointSchema } from '../../shared/types';

export const GeoOverlaySchema = z.object({
  id: z.string(),
  name: z.string(),
  coordinates: z.array(GeoPointSchema),
});
export type GeoOverlay = z.infer<typeof GeoOverlaySchema>;
