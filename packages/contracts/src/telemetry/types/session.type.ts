import { z } from 'zod';
import { ChannelDefinitionSchema } from './channel-definition.type';
import { TimestampMsSchema } from '@/shared';

export const SourceKindSchema = z.enum(['SIMULATOR', 'MAVLINK', 'LOG_FILE']);
export type SourceKind = z.infer<typeof SourceKindSchema>;

export const VehicleKindSchema = z.enum(['MULTIROTOR', 'FIXED_WING', 'ROVER', 'OTHER']);
export type VehicleKind = z.infer<typeof VehicleKindSchema>;

/** One recording: where the data came from and which channels it contains. */
export const SessionSchema = z
  .object({
    id: z.uuid(),
    name: z.string().min(1).max(100),
    sourceKind: SourceKindSchema,
    vehicleKind: VehicleKindSchema,
    startedAt: TimestampMsSchema,
    endedAt: TimestampMsSchema.optional(),
    channels: z.array(ChannelDefinitionSchema),
  })
  .refine((session) => session.endedAt === undefined || session.endedAt >= session.startedAt, {
    message: 'endedAt must not be before startedAt',
    path: ['endedAt'],
  });
export type Session = z.infer<typeof SessionSchema>;
