import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { IngestService } from './ingest.service';
import { IngestTokenGuard } from './ingest-token.guard';
import { SessionService } from './session.service';
import { TelemetryBatchDto } from './dto/telemetry-batch.dto';

@Controller('ingest')
@UseGuards(IngestTokenGuard)
export class IngestController {
  constructor(
    private readonly ingestService: IngestService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('batch')
  @HttpCode(HttpStatus.ACCEPTED)
  ingestBatch(@Body() batch: TelemetryBatchDto): { accepted: number } {
    const activeSession = this.sessionService.getActive();

    // 1. Semantic check: session must match active session
    if (!activeSession || batch.sessionId !== activeSession.id) {
      throw new NotFoundException(
        `Session ${batch.sessionId} not found or is not the active session`,
      );
    }

    // Index active channels by ID for fast lookup
    const channelMap = new Map(
      activeSession.channels.map((ch) => [ch.id, ch]),
    );

    // 2. Semantic check: every sample channel must exist and match type
    for (const sample of batch.samples) {
      const channelDef = channelMap.get(sample.channelId);
      if (!channelDef) {
        throw new UnprocessableEntityException(
          `Unknown channel '${sample.channelId}' for session ${activeSession.id}`,
        );
      }

      if (channelDef.valueType === 'NUMBER' && typeof sample.value !== 'number') {
        throw new UnprocessableEntityException(
          `Channel '${sample.channelId}' requires NUMBER value, received ${typeof sample.value}`,
        );
      }

      if (channelDef.valueType === 'BOOLEAN' && typeof sample.value !== 'boolean') {
        throw new UnprocessableEntityException(
          `Channel '${sample.channelId}' requires BOOLEAN value, received ${typeof sample.value}`,
        );
      }

      if (channelDef.valueType === 'STRING' && typeof sample.value !== 'string') {
        throw new UnprocessableEntityException(
          `Channel '${sample.channelId}' requires STRING value, received ${typeof sample.value}`,
        );
      }
    }

    this.ingestService.ingest(batch);

    return { accepted: batch.samples.length };
  }
}
