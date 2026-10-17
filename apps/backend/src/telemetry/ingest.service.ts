import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import type { TelemetryBatch } from '@sokil/contracts';
import { LatestValueStore } from './latest-values.store';

@Injectable()
export class IngestService {
  readonly batches$ = new Subject<TelemetryBatch>();

  constructor(private readonly store: LatestValueStore) {}

  ingest(batch: TelemetryBatch): void {
    this.store.update(batch);
    this.batches$.next(batch);
  }
}
