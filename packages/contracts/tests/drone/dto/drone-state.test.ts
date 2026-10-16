import { describe, expect, it } from 'vitest';
import { validateDroneState, toWireFormat } from '@/drone/dto/drone-state.dto';

describe('DroneState Adapter', () => {
  const validState = {
    droneId: 'drone-123',
    mode: 'LOITER' as const,
    heartbeat: 100
  };

  describe('validateDroneState', () => {
    it('should validate a correct state', () => {
      expect(validateDroneState(validState)).toEqual(validState);
    });

    it('should fail with invalid input', () => {
      expect(() => validateDroneState({ droneId: '123' } as any)).toThrow();
    });
  });

  describe('toWireFormat', () => {
    it('should convert state to wire format', () => {
      const wire = toWireFormat(validState);
      expect(wire).toEqual({
        id: 'drone-123',
        mode: 'LOITER',
        heart: 100
      });
    });
  });
});
