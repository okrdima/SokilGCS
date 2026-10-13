import { z } from 'zod';
import { ChannelIdSchema } from '@/telemetry/types/channel-definition.type';
import { LimitStateSchema, TelemetryValueSchema } from '@/telemetry/types';
import { TimestampMsSchema } from '@/shared/types';

/** An alarm exists only for YELLOW or RED; NOMINAL clears it. */
export const AlarmSeveritySchema = LimitStateSchema.exclude(['NOMINAL']);
export type AlarmSeverity = z.infer<typeof AlarmSeveritySchema>;

export const AlarmSchema = z.object({
  id: z.uuid(),
  sessionId: z.uuid(),
  channelId: ChannelIdSchema,
  severity: AlarmSeveritySchema,
  message: z.string().min(1).max(300),
  /** The value that raised the alarm. */
  value: TelemetryValueSchema,
  raisedAt: TimestampMsSchema,
  acknowledgedAt: TimestampMsSchema.optional(),
  clearedAt: TimestampMsSchema.optional(),
});
export type Alarm = z.infer<typeof AlarmSchema>;
