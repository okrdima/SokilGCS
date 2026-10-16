import { describe, expect, it } from 'vitest';
import { AttitudeSchema } from '../../src/telemetry/types/attitude.type';
import { BatterySchema } from '../../src/telemetry/types/battery.type';

describe('Attitude & Battery Schemas', () => {
  describe('AttitudeSchema', () => {
    it('should validate a correct attitude', () => {
      const valid = { orientation: { roll: 0, pitch: 0, yaw: 0 } };
      expect(AttitudeSchema.parse(valid)).toEqual(valid);
    });

    it('should fail if orientation is missing', () => {
      expect(() => AttitudeSchema.parse({})).toThrow();
    });
  });

  describe('BatterySchema', () => {
    it('should validate a correct battery', () => {
      const valid = { percentage: 50, voltage: 12 };
      expect(BatterySchema.parse(valid)).toEqual(valid);
    });

    it('should fail if percentage is out of range', () => {
      const invalid = { percentage: 150, voltage: 12 };
      expect(() => BatterySchema.parse(invalid)).toThrow();
    });

    it('should fail if voltage is negative', () => {
      const invalid = { percentage: 50, voltage: -1 };
      expect(() => BatterySchema.parse(invalid)).toThrow();
    });
  });
});
