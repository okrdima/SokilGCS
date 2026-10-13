import { z } from 'zod';

/**
 * Milliseconds since the Unix epoch (UTC).
 * Integers keep high-rate samples small and cheap to compare, sort and store.
 */
export const TimestampMsSchema = z.number().int().nonnegative();
export type TimestampMs = z.infer<typeof TimestampMsSchema>;
