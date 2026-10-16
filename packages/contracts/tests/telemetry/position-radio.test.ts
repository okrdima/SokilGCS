import { describe, expect, it } from 'vitest';
import { PositionSchema } from '../../src/telemetry/types/position.type';
import { RadioSchema } from '../../src/telemetry/types/radio.type';

describe('Position & Radio Schemas', () => {
  describe('PositionSchema', () => {
    it('should validate a correct position', () => {
      const valid = {
        point: { lat: 45, lon: -75, alt: 100 },
        velocity: { x: 1, y: 2, z: 3 }
      };
      expect(PositionSchema.parse(valid)).toEqual(valid);
    });

    it('should fail if point is missing', () => {
      const invalid = { velocity: { x: 1, y: 2, z: 3 } };
      expect(() => PositionSchema.parse(invalid as any)).toThrow();
    });
  });

  describe('RadioSchema', () => {
    it('should validate a correct radio', () => {
      const valid = { rssi: -50 };
      expect(RadioSchema.parse(valid)).toEqual(valid);
    });

    it('should fail if rssi is too low', () => {
      const invalid = { rssi: -130 };
      expect(() => RadioSchema.parse(invalid)).toThrow();
    });

    it('should fail if rssi is too high', () => {
      const invalid = { rssi: 10 };
      expect(() => RadioSchema.parse(invalid)).toThrow();
    });
  });
});
