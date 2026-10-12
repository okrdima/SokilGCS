import { z } from 'zod';

export const FlightModeSchema = z.enum([
  'PARKED',
  'TAKEOFF',
  'LOITER',
  'LANDING',
  'MANUAL',
  'AUTO',
]);

export type FlightMode = z.infer<typeof FlightModeSchema>;
