import { z } from 'zod';
import { AttitudeSchema } from './attitude.type';
import { RadioSchema } from './radio.type';
import { BatterySchema } from './battery.type';
import { PositionSchema } from './position.type';

export const TelemetryFrameSchema = z.object({
  timestamp: z.union([
    z.number().int().positive(),
    z.string().refine((s) => !isNaN(Date.parse(s)))
  ]),
  droneId: z.string(),
  attitude: AttitudeSchema,
  battery: BatterySchema,
  position: PositionSchema,
  radio: RadioSchema,
  missionId: z.string().optional(),
  raw: z.unknown().optional(),
});
export type TelemetryFrame = z.infer<typeof TelemetryFrameSchema>;
