import { IngestService } from './ingest.service';
import { LatestValueStore } from './latest-values.store';
import type { TelemetryBatch } from '@sokil/contracts';

describe('IngestService', () => {
  let store: LatestValueStore;
  let service: IngestService;

  const sampleBatch = (t: number, value: number): TelemetryBatch => ({
    sessionId: '123e4567-e89b-12d3-a456-426614174000',
    sourceId: 'test-source',
    samples: [{ channelId: 'battery.voltage', t, value }],
  });

  beforeEach(() => {
    store = new LatestValueStore();
    service = new IngestService(store);
  });

  it('calls store.update with the batch on ingest', () => {
    const updateSpy = jest.spyOn(store, 'update');
    const batch = sampleBatch(100, 24.5);

    service.ingest(batch);

    expect(updateSpy).toHaveBeenCalledWith(batch);
    expect(store.snapshot()[0].value).toBe(24.5);
  });

  it('publishes every batch on batches$, even if store ignores older timestamp', () => {
    const emitted: TelemetryBatch[] = [];
    service.batches$.subscribe((b) => emitted.push(b));

    const batch1 = sampleBatch(200, 24.0);
    const batch2 = sampleBatch(100, 25.0); // older timestamp

    service.ingest(batch1);
    service.ingest(batch2);

    expect(emitted).toHaveLength(2);
    expect(emitted[0]).toEqual(batch1);
    expect(emitted[1]).toEqual(batch2);
    // Store should retain newer timestamp 200
    expect(store.snapshot()[0].t).toBe(200);
  });

  it('does not replay batches to late subscribers (Subject behaviour)', () => {
    const batch1 = sampleBatch(100, 24.5);
    service.ingest(batch1);

    const emittedLate: TelemetryBatch[] = [];
    service.batches$.subscribe((b) => emittedLate.push(b));

    const batch2 = sampleBatch(200, 24.2);
    service.ingest(batch2);

    expect(emittedLate).toHaveLength(1);
    expect(emittedLate[0]).toEqual(batch2);
  });
});
