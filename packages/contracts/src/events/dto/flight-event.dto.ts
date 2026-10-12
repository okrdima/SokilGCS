import { z } from 'zod';
import { TelemetryFrameSchema } from '../../telemetry/types';

export const FlightEventSchema = z.object({
  eventType: z.enum(['TAKEOFF', 'LANDING', 'LOITER']),
  timestamp: z.number().int().positive(),
  telemetry: TelemetryFrameSchema,
});
export type FlightEvent = z.infer<typeof FlightEventSchema>;
