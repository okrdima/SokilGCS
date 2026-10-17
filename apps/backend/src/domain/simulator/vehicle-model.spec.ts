import { createVehicleModel, DEFAULT_VEHICLE_MODEL_CONFIG } from './vehicle-model';
import { haversineM } from '../math/geo';
import { ChannelIdSchema } from '@sokil/contracts';

describe('createVehicleModel', () => {
  it('maintains distance from center equal to radius (within 0.5 m) across 100 ticks', () => {
    const model = createVehicleModel();
    const center = DEFAULT_VEHICLE_MODEL_CONFIG.center;
    const radius = DEFAULT_VEHICLE_MODEL_CONFIG.radiusM;

    for (let tick = 0; tick < 100; tick++) {
      const samples = model.samplesAt(tick, 1000 + tick * 100);
      const lat = samples.find((s) => s.channelId === 'position.lat')?.value as number;
      const lon = samples.find((s) => s.channelId === 'position.lon')?.value as number;

      const dist = haversineM(center, { lat, lon });
      expect(Math.abs(dist - radius)).toBeLessThan(0.5);
    }
  });

  it('returns to start position (within 0.5 m) after one full circular lap', () => {
    const model = createVehicleModel();
    // One lap duration: 2 * pi * radius / speed seconds
    // At 10 ticks/sec: 2 * pi * 150 / 4 * 10 ≈ 2356.19 ticks
    const lapTicks = Math.round(
      ((2 * Math.PI * DEFAULT_VEHICLE_MODEL_CONFIG.radiusM) /
        DEFAULT_VEHICLE_MODEL_CONFIG.speedMps) *
        10,
    );

    const startSamples = model.samplesAt(0, 0);
    const startLat = startSamples.find((s) => s.channelId === 'position.lat')?.value as number;
    const startLon = startSamples.find((s) => s.channelId === 'position.lon')?.value as number;

    const lapSamples = model.samplesAt(lapTicks, lapTicks * 100);
    const lapLat = lapSamples.find((s) => s.channelId === 'position.lat')?.value as number;
    const lapLon = lapSamples.find((s) => s.channelId === 'position.lon')?.value as number;

    const dist = haversineM({ lat: startLat, lon: startLon }, { lat: lapLat, lon: lapLon });
    expect(dist).toBeLessThan(0.5);
  });

  it('computes heading tangent to the circle (perpendicular to radius vector)', () => {
    // Model with 0 noise for this check
    const model = createVehicleModel();
    // At tick 0: vehicle is at North (theta = 0), heading east (approx 90 deg)
    const samples0 = model.samplesAt(0, 0);
    const heading0 = samples0.find((s) => s.channelId === 'nav.heading')?.value as number;
    expect(heading0).toBeGreaterThanOrEqual(89);
    expect(heading0).toBeLessThanOrEqual(91);

    // At quarter lap: vehicle is at East (theta = pi/2), heading south (approx 180 deg)
    const quarterLap = Math.round((DEFAULT_VEHICLE_MODEL_CONFIG.radiusM * Math.PI) / 2 / 4 * 10);
    const samplesQ = model.samplesAt(quarterLap, quarterLap * 100);
    const headingQ = samplesQ.find((s) => s.channelId === 'nav.heading')?.value as number;
    expect(headingQ).toBeGreaterThanOrEqual(179);
    expect(headingQ).toBeLessThanOrEqual(181);
  });

  it('guarantees deterministic output for the same seed and tickIndex', () => {
    const model1 = createVehicleModel({ seed: 1234 });
    const model2 = createVehicleModel({ seed: 1234 });

    const samples1 = model1.samplesAt(42, 10000);
    const samples2 = model2.samplesAt(42, 10000);

    expect(samples1).toEqual(samples2);
  });

  it('decreases battery voltage over time (tick 100 is lower than tick 0)', () => {
    const model = createVehicleModel();
    const v0 = model.samplesAt(0, 0).find((s) => s.channelId === 'battery.voltage')?.value as number;
    const v100 = model.samplesAt(100, 10000).find((s) => s.channelId === 'battery.voltage')?.value as number;

    expect(v0).toBeCloseTo(25.0, 1);
    expect(v100).toBeLessThan(v0);
  });

  it('reaches approximately 21.2 V at tick 5430 (543 s)', () => {
    const model = createVehicleModel();
    const v5430 = model.samplesAt(5430, 543000).find((s) => s.channelId === 'battery.voltage')?.value as number;
    expect(v5430).toBeCloseTo(21.2, 1);
  });

  it('ensures all emitted channel IDs are valid against ChannelIdSchema', () => {
    const model = createVehicleModel();
    // Check tick 0 where all channels are emitted
    const samples = model.samplesAt(0, 0);
    expect(samples.length).toBe(9);
    for (const s of samples) {
      expect(ChannelIdSchema.safeParse(s.channelId).success).toBe(true);
      expect(typeof s.value).toBe('number');
      expect(Number.isFinite(s.value)).toBe(true);
    }
  });

  it('emits channels matching multi-rate schedule (FR-M6)', () => {
    const model = createVehicleModel();

    // Tick 0: all 9 channels
    const tick0 = model.samplesAt(0, 0);
    expect(tick0.length).toBe(9);

    // Tick 1: only 6 channels (10 Hz)
    const tick1 = model.samplesAt(1, 100);
    expect(tick1.length).toBe(6);
    expect(tick1.some((s) => s.channelId === 'gps.hdop')).toBe(false);
    expect(tick1.some((s) => s.channelId === 'link.rssi')).toBe(false);
    expect(tick1.some((s) => s.channelId === 'gps.satellites')).toBe(false);

    // Tick 2: 6 (10 Hz) + 1 (5 Hz hdop) = 7 channels
    const tick2 = model.samplesAt(2, 200);
    expect(tick2.length).toBe(7);
    expect(tick2.some((s) => s.channelId === 'gps.hdop')).toBe(true);
    expect(tick2.some((s) => s.channelId === 'link.rssi')).toBe(false);

    // Tick 5: 6 (10 Hz) + 1 (2 Hz rssi) = 7 channels
    const tick5 = model.samplesAt(5, 500);
    expect(tick5.length).toBe(7);
    expect(tick5.some((s) => s.channelId === 'link.rssi')).toBe(true);
    expect(tick5.some((s) => s.channelId === 'gps.hdop')).toBe(false);

    // Tick 10: all 9 channels again
    const tick10 = model.samplesAt(10, 1000);
    expect(tick10.length).toBe(9);
  });

  it('guarantees gps.satellites is always an integer', () => {
    const model = createVehicleModel();
    for (let tick = 0; tick <= 100; tick += 10) {
      const samples = model.samplesAt(tick, tick * 100);
      const sats = samples.find((s) => s.channelId === 'gps.satellites')?.value as number;
      expect(Number.isInteger(sats)).toBe(true);
      expect(sats).toBeGreaterThanOrEqual(16);
      expect(sats).toBeLessThanOrEqual(20);
    }
  });
});
