import { z } from 'zod';

/**
 * Geographic point in meters above mean sea level (MSL).
 * Latitude: [-90, 90]
 * Longitude: [-180, 180]
 */
export const GeoPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  alt: z.number(), // meters MSL, can be negative
});

export type GeoPoint = z.infer<typeof GeoPointSchema>;
