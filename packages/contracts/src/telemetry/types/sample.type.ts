import { z } from 'zod';
import { ChannelIdSchema } from './channel-definition.type';
import { TimestampMsSchema } from '@/shared';

/** GOOD when omitted. */
export const SampleQualitySchema = z.enum(['GOOD', 'STALE', 'INVALID']);
export type SampleQuality = z.infer<typeof SampleQualitySchema>;

export const TelemetryValueSchema = z.union([z.number(), z.boolean(), z.string().max(200)]);
export type TelemetryValue = z.infer<typeof TelemetryValueSchema>;

/** One measurement of one channel at one moment. */
export const TelemetrySampleSchema = z.object({
  channelId: ChannelIdSchema,
  /** Time the value was measured (not the time it was received). */
  t: TimestampMsSchema,
  value: TelemetryValueSchema,
  quality: SampleQualitySchema.optional(),
});
export type TelemetrySample = z.infer<typeof TelemetrySampleSchema>;

/**
 * A group of samples from one source. Validate batches once, at the boundary
 * (adapter output, uploaded files). Inside the backend and over the WebSocket, use the
 * TypeScript types without re-validating every sample.
 */
export const TelemetryBatchSchema = z.object({
  sessionId: z.uuid(),
  sourceId: z.string().min(1).max(100),
  samples: z.array(TelemetrySampleSchema).min(1).max(5000),
});
export type TelemetryBatch = z.infer<typeof TelemetryBatchSchema>;
