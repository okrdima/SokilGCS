import { offsetLatLon } from '../math/geo';
import { hashSeed, mulberry32 } from '../math/prng';
import type { TelemetrySample } from '@sokil/contracts';

export interface VehicleModelConfig {
  center: { lat: number; lon: number };
  radiusM: number;
  speedMps: number;
  batteryStartV: number;
  batteryEndV: number;
  batteryDrainSeconds: number;
  seed: number;
}

export const DEFAULT_VEHICLE_MODEL_CONFIG: VehicleModelConfig = {
  center: { lat: 34.2045, lon: -118.1723 },
  radiusM: 150,
  speedMps: 4,
  batteryStartV: 25.0,
  batteryEndV: 20.8,
  batteryDrainSeconds: 600,
  seed: 42,
};

export interface VehicleModel {
  samplesAt(tickIndex: number, timestampMs: number): TelemetrySample[];
}

export function createVehicleModel(
  config: Partial<VehicleModelConfig> = {},
): VehicleModel {
  const cfg: VehicleModelConfig = {
    ...DEFAULT_VEHICLE_MODEL_CONFIG,
    ...config,
    center: {
      ...DEFAULT_VEHICLE_MODEL_CONFIG.center,
      ...(config.center ?? {}),
    },
  };

  function getNoise(channelId: string, tickIndex: number, amplitude: number): number {
    const seedVal = hashSeed(cfg.seed, channelId, tickIndex);
    const rng = mulberry32(seedVal);
    // rng() is in [0, 1) -> (rng * 2 - 1) is in [-1, 1)
    return (rng() * 2 - 1) * amplitude;
  }

  return {
    samplesAt(tickIndex: number, timestampMs: number): TelemetrySample[] {
      const samples: TelemetrySample[] = [];

      // 1. Circular track geometry
      const tSec = tickIndex * 0.1;
      const theta = (cfg.speedMps / cfg.radiusM) * tSec; // radians clockwise from North
      const east = cfg.radiusM * Math.sin(theta);
      const north = cfg.radiusM * Math.cos(theta);
      const pos = offsetLatLon(cfg.center.lat, cfg.center.lon, east, north);

      // Tangent heading (clockwise from North): (theta_deg + 90) % 360
      const thetaDeg = (theta * 180) / Math.PI;
      const rawHeading = (thetaDeg + 90) % 360;
      const headingWithNoise = rawHeading + getNoise('nav.heading', tickIndex, 0.5);
      const heading = ((headingWithNoise % 360) + 360) % 360;

      // 2. Battery linear drain
      const drainFraction = Math.min(tSec / cfg.batteryDrainSeconds, 1);
      const baseVoltage =
        cfg.batteryStartV - (cfg.batteryStartV - cfg.batteryEndV) * drainFraction;
      const voltage = baseVoltage + getNoise('battery.voltage', tickIndex, 0.02);

      const current = 18.6 + getNoise('battery.current', tickIndex, 0.5);
      const speed = cfg.speedMps + getNoise('nav.groundspeed', tickIndex, 0.1);

      // 10 Hz channels (emitted every tick)
      samples.push(
        { channelId: 'position.lat', t: timestampMs, value: pos.lat },
        { channelId: 'position.lon', t: timestampMs, value: pos.lon },
        { channelId: 'nav.groundspeed', t: timestampMs, value: speed },
        { channelId: 'nav.heading', t: timestampMs, value: heading },
        { channelId: 'battery.voltage', t: timestampMs, value: voltage },
        { channelId: 'battery.current', t: timestampMs, value: current },
      );

      // 5 Hz channels (every 2nd tick)
      if (tickIndex % 2 === 0) {
        const hdop = 0.9 + getNoise('gps.hdop', tickIndex, 0.15);
        samples.push({ channelId: 'gps.hdop', t: timestampMs, value: hdop });
      }

      // 2 Hz channels (every 5th tick)
      if (tickIndex % 5 === 0) {
        const rssi = -68 + getNoise('link.rssi', tickIndex, 3);
        samples.push({ channelId: 'link.rssi', t: timestampMs, value: Math.round(rssi) });
      }

      // 1 Hz channels (every 10th tick)
      if (tickIndex % 10 === 0) {
        const satsNoise = getNoise('gps.satellites', tickIndex, 1);
        const satellites = Math.round(18 + satsNoise);
        samples.push({
          channelId: 'gps.satellites',
          t: timestampMs,
          value: satellites,
        });
      }

      return samples;
    },
  };
}
