import { z } from 'zod';

export const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  WEB_ORIGIN: z.string().default('http://localhost:3000'),
  SIMULATOR_ENABLED: z
    .preprocess((val) => {
      if (val === undefined || val === '') return undefined;
      if (val === 'true' || val === true) return true;
      if (val === 'false' || val === false) return false;
      return val;
    }, z.boolean())
    .default(true),
  SIMULATOR_SEED: z.coerce.number().default(42),
  SIMULATOR_BATTERY_DRAIN_SECONDS: z.coerce.number().default(600),
  INGEST_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(rawEnv: Record<string, unknown> = process.env): Env {
  const result = EnvSchema.safeParse(rawEnv);
  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Environment validation failed:\n${errorDetails}`);
  }
  return result.data;
}
