import { z } from 'zod';

export const DroneStatusSchema = z.enum(['OFFLINE', 'ONLINE', 'IN_FLIGHT', 'MAINTENANCE']);

export type DroneStatus = z.infer<typeof DroneStatusSchema>;
