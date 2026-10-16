import { describe, expect, it } from 'vitest';
import { DroneStateSchema } from '../../src/drone/types/drone-state.type';
import { FlightModeSchema } from '../../src/drone/types/flight-mode.type';

describe('Drone State Types', () => {
  describe('FlightModeSchema', () => {
    it('should validate all enum values', () => {
      const modes = ['PARKED', 'TAKEOFF', 'LOITER', 'LANDING', 'MANUAL', 'AUTO'] as const;
      modes.forEach(m => {
        expect(FlightModeSchema.parse(m)).toBe(m);
      });
    });

    it('should fail on invalid mode', () => {
      expect(() => FlightModeSchema.parse('FLYING')).toThrow();
    });
  });

  describe('DroneStateSchema', () => {
    const validState = {
      droneId: 'drone-123',
      mode: 'LOITER' as const,
      heartbeat: 100
    };

    it('should validate a correct state', () => {
      expect(DroneStateSchema.parse(validState)).toEqual(validState);
    });

    it('should fail if droneId is missing', () => {
      const { droneId, ...invalid } = validState as any;
      expect(() => DroneStateSchema.parse(invalid)).toThrow();
    });

    it('should fail if mode is missing', () => {
      const { mode, ...invalid } = validState as any;
      expect(() => DroneStateSchema.parse(invalid)).toThrow();
    });

    it('should fail if heartbeat is missing', () => {
      const { heartbeat, ...invalid } = validState as any;
      expect(() => DroneStateSchema.parse(invalid)).toThrow();
    });
  });
});
