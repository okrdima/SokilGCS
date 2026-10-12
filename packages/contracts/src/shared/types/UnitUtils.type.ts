import { z } from 'zod';

/**
 * Placeholder for unit conversion utilities.
 * The schema is intentionally empty; concrete units are defined in domain modules.
 */
export const UnitUtilsSchema = z.object({});

export type UnitUtils = z.infer<typeof UnitUtilsSchema>;
