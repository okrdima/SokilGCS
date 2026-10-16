import { describe, expect, it } from 'vitest';
import { TelemetryFrameSchema } from '../../src/telemetry/types/telemetry-frame.type';
import { AttitudeSchema } from '../../src/telemetry/types/attitude.type';
import { BatterySchema } from '../../src/telemetry/types/battery.type';
import { PositionSchema } from '../../src/telemetry/types/position.type';
import { RadioSchema } from '../../src/telemetry/types/radio.type';

describe('TelemetryFrameSchema', () => {
  const validFrame = {
    timestamp: 1672531200000,
    droneId: 'drone-123',
    attitude: AttitudeSchema.parse({ orientation: { roll: 0, pitch: 0, yaw: 0 } }),
    battery: BatterySchema.parse({ percentage: 0.8, voltage: 12 }),
    position: PositionSchema.parse({
      point: { lat: 45, lon: -75, alt: 0 },
      velocity: { x: 0, y: 0, z: 0 },
    }),
    radio: RadioSchema.parse({ rssi: -50 }),
    missionId: 'mission-456',
  };

  it('should validate a correct telemetry frame', () => {
    expect(TelemetryFrameSchema.parse(validFrame)).toEqual(validFrame);
  });

  it('should fail if droneId is missing', () => {
    const { droneId, ...invalidFrame } = validFrame;
    expect(() => TelemetryFrameSchema.parse(invalidFrame)).toThrow();
  });

  it('should fail if timestamp is not a number', () => {
    const invalidFrame = { ...validFrame, timestamp: 'not-a-number' };
    expect(() => TelemetryFrameSchema.parse(invalidFrame)).toThrow();
  });
});
