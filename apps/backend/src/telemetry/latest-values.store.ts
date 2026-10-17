import { Injectable } from '@nestjs/common';
import type { ChannelId, TelemetryBatch, TelemetrySample } from '@sokil/contracts';

@Injectable()
export class LatestValueStore {
  private readonly store = new Map<ChannelId, TelemetrySample>();

  /**
   * Updates store with batch samples.
   * If no stored sample exists or sample.t >= stored.t, updates the store.
   * Older samples (sample.t < stored.t) are ignored.
   */
  update(batch: TelemetryBatch): void {
    for (const sample of batch.samples) {
      const stored = this.store.get(sample.channelId);
      if (!stored || sample.t >= stored.t) {
        this.store.set(sample.channelId, sample);
      }
    }
  }

  /**
   * Returns a snapshot of the latest sample for every channel that has received data.
   */
  snapshot(): TelemetrySample[] {
    return Array.from(this.store.values());
  }

  /**
   * Clears all values (useful for tests or session resets).
   */
  clear(): void {
    this.store.clear();
  }
}
