import { createZodDto } from 'nestjs-zod';
import { TelemetryBatchSchema } from '@sokil/contracts';

export class TelemetryBatchDto extends createZodDto(TelemetryBatchSchema) {}
