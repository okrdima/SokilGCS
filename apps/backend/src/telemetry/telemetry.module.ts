import { Module } from '@nestjs/common';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';
import { IngestTokenGuard } from './ingest-token.guard';
import { LatestValueStore } from './latest-values.store';
import { SessionService } from './session.service';
import { SimulatorSource } from './sources/simulator.source';
import { TelemetryGateway } from './gateway/telemetry.gateway';

import { SessionController } from './session.controller';

@Module({
  controllers: [IngestController, SessionController],
  providers: [
    SessionService,
    LatestValueStore,
    IngestService,
    SimulatorSource,
    IngestTokenGuard,
    TelemetryGateway,
  ],
  exports: [IngestService, SessionService, LatestValueStore],
})
export class TelemetryModule {}
