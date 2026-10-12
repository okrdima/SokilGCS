import { z } from 'zod';
import { BaseEntitySchema } from '../../shared';
import { DroneStateSchema, FlightModeSchema } from '../types';

export const DroneEntitySchema = BaseEntitySchema.extend({
  name: z.string().min(2).max(50),
  callsign: z.string().min(2).max(20),
  serialNumber: z.string(),
  hardwareVersion: z.string(),
  firmwareVersion: z.string(),
  status: DroneStateSchema,
  currentMode: FlightModeSchema,
});

export type DroneEntity = z.infer<typeof DroneEntitySchema>;
