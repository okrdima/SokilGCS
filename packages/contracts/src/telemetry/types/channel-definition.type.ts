import { z } from 'zod';
import { LimitsSchema } from './limits.type';

/** Dotted, lowercase-friendly identifier, for example "battery.voltage" or "nav.groundspeed". */
export const ChannelIdSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[A-Za-z0-9_.:-]+$/, 'Use letters, digits, ".", "_", ":" or "-"');
export type ChannelId = z.infer<typeof ChannelIdSchema>;

export const ChannelValueTypeSchema = z.enum(['NUMBER', 'BOOLEAN', 'STRING']);
export type ChannelValueType = z.infer<typeof ChannelValueTypeSchema>;

/**
 * Describes one telemetry channel: what it is, its unit and how fast it normally updates.
 * The same definition works for any vehicle (multirotor, fixed-wing, rover, simulator).
 */
export const ChannelDefinitionSchema = z
  .object({
    id: ChannelIdSchema,
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    valueType: ChannelValueTypeSchema,
    /** Unit label such as "V", "m/s" or "deg". */
    unit: z.string().max(20).optional(),
    nominalRateHz: z.number().positive().max(1000).optional(),
    limits: LimitsSchema.optional(),
  })
  .refine((channel) => channel.limits === undefined || channel.valueType === 'NUMBER', {
    message: 'Limits are only allowed on NUMBER channels',
    path: ['limits'],
  });
export type ChannelDefinition = z.infer<typeof ChannelDefinitionSchema>;
