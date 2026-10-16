import { describe, expect, it } from 'vitest';
import { DroneStatusSchema } from '../../src/drone/types/drone-status.type';

describe('Drone Status Types', () => {
  describe('DroneStatusSchema', () => {
    it('should validate all enum values', () => {
      const statuses = ['OFFLINE', 'ONLINE', 'IN_FLIGHT', 'MAINTENANCE'] as const;
      statuses.forEach(s => {
        expect(DroneStatusSchema.parse(s)).toBe(s);
      });
    });

    it('should fail on invalid status', () => {
      expect(() => DroneStatusSchema.parse('UNKNOWN')).toThrow();
    });
  });
});
