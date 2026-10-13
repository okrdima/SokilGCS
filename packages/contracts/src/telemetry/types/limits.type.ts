import { z } from 'zod';

/** Result of checking a value against its limits. */
export const LimitStateSchema = z.enum(['NOMINAL', 'YELLOW', 'RED']);
export type LimitState = z.infer<typeof LimitStateSchema>;

/**
 * Soft (yellow) and hard (red) bounds for a numeric channel.
 * Every bound is optional, so one-sided limits (for example "battery voltage must not
 * drop below X") are allowed.
 */
export const LimitsSchema = z
  .object({
    redLow: z.number().optional(),
    yellowLow: z.number().optional(),
    yellowHigh: z.number().optional(),
    redHigh: z.number().optional(),
  })
  .refine(
    (limits) => {
      const ordered = [limits.redLow, limits.yellowLow, limits.yellowHigh, limits.redHigh].filter(
        (bound): bound is number => bound !== undefined,
      );
      return ordered.every((bound, index) => bound >= (ordered[index - 1] ?? bound));
    },
    { message: 'Limits must satisfy redLow <= yellowLow <= yellowHigh <= redHigh' },
  );

export type Limits = z.infer<typeof LimitsSchema>;
