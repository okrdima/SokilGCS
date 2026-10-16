import { describe, expect, it } from 'vitest';
import { HeartbeatSchema } from '@/drone/dto/heartbeat.dto';

describe('HeartbeatSchema', () => {
  it('should validate a correct heartbeat', () => {
    const valid = { droneId: 'drone-123', timestamp: 1672531200000 };
    expect(HeartbeatSchema.parse(valid)).toEqual(valid);
  });

  it('should fail if droneId is missing', () => {
    const invalid = { timestamp: 1672531200000 };
    expect(() => HeartbeatSchema.parse(invalid as any)).toThrow();
  });

  it('should fail if timestamp is not a positive integer', () => {
    const invalid = { droneId: 'drone-123', timestamp: -1 };
    expect(() => HeartbeatSchema.parse(invalid)).toThrow();
  });
});
