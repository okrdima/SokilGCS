import { z } from 'zod';
import { TimestampMsSchema } from '@/shared/types';

/**
 * Command lifecycle:
 *   PENDING -> SENT -> ACKNOWLEDGED
 *                   -> REJECTED   (the vehicle refused)
 *                   -> FAILED     (the link or the adapter failed)
 *                   -> TIMED_OUT  (no answer within timeoutMs)
 * ACKNOWLEDGED, REJECTED, FAILED and TIMED_OUT are final.
 */
export const CommandStatusSchema = z.enum([
  'PENDING',
  'SENT',
  'ACKNOWLEDGED',
  'REJECTED',
  'FAILED',
  'TIMED_OUT',
]);
export type CommandStatus = z.infer<typeof CommandStatusSchema>;

export const CommandArgValueSchema = z.union([z.number(), z.boolean(), z.string().max(200)]);

/** A command the operator wants to send, for example "ARM", "SET_MODE" or "RETURN_TO_BASE". */
export const CommandRequestSchema = z.object({
  id: z.uuid(),
  sessionId: z.uuid(),
  name: z.string().min(1).max(64),
  args: z.record(z.string(), CommandArgValueSchema).optional(),
  requestedAt: TimestampMsSchema,
  /** The service applies a default when omitted. */
  timeoutMs: z.number().int().positive().max(60_000).optional(),
});
export type CommandRequest = z.infer<typeof CommandRequestSchema>;

/** One step in a command's lifecycle. Store every update to keep an audit trail. */
export const CommandStatusUpdateSchema = z.object({
  commandId: z.uuid(),
  status: CommandStatusSchema,
  at: TimestampMsSchema,
  detail: z.string().max(300).optional(),
});
export type CommandStatusUpdate = z.infer<typeof CommandStatusUpdateSchema>;
