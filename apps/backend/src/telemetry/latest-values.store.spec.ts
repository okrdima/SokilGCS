import { LatestValueStore } from './latest-values.store';
import type { TelemetryBatch } from '@sokil/contracts';

describe('LatestValueStore', () => {
  let store: LatestValueStore;

  const sampleBatch = (samples: TelemetryBatch['samples']): TelemetryBatch => ({
    sessionId: '123e4567-e89b-12d3-a456-426614174000',
    sourceId: 'test-source',
    samples,
  });

  beforeEach(() => {
    store = new LatestValueStore();
  });

  it('returns empty array from snapshot when empty', () => {
    expect(store.snapshot()).toEqual([]);
  });

  it('stores newest sample per channel on update', () => {
    store.update(
      sampleBatch([
        { channelId: 'battery.voltage', t: 100, value: 24.5 },
        { channelId: 'nav.heading', t: 100, value: 90 },
      ]),
    );

    const snap = store.snapshot();
    expect(snap).toHaveLength(2);
    expect(snap.find((s) => s.channelId === 'battery.voltage')?.value).toBe(24.5);
    expect(snap.find((s) => s.channelId === 'nav.heading')?.value).toBe(90);
  });

  it('ignores samples with timestamp older than the stored one', () => {
    store.update(
      sampleBatch([{ channelId: 'battery.voltage', t: 200, value: 24.0 }]),
    );

    // Update with older timestamp
    store.update(
      sampleBatch([{ channelId: 'battery.voltage', t: 150, value: 24.8 }]),
    );

    const snap = store.snapshot();
    expect(snap).toHaveLength(1);
    expect(snap[0].value).toBe(24.0);
    expect(snap[0].t).toBe(200);
  });

  it('replaces stored sample when timestamp equals the stored one', () => {
    store.update(
      sampleBatch([{ channelId: 'battery.voltage', t: 200, value: 24.0 }]),
    );

    // Update with same timestamp
    store.update(
      sampleBatch([{ channelId: 'battery.voltage', t: 200, value: 23.9 }]),
    );

    const snap = store.snapshot();
    expect(snap).toHaveLength(1);
    expect(snap[0].value).toBe(23.9);
  });

  it('snapshot() returns all distinct channels that have received data', () => {
    store.update(
      sampleBatch([
        { channelId: 'battery.voltage', t: 100, value: 24.5 },
        { channelId: 'nav.heading', t: 100, value: 90 },
        { channelId: 'gps.hdop', t: 100, value: 0.9 },
      ]),
    );

    const snap = store.snapshot();
    expect(snap).toHaveLength(3);
    const channelIds = snap.map((s) => s.channelId).sort();
    expect(channelIds).toEqual(['battery.voltage', 'gps.hdop', 'nav.heading']);
  });
});
