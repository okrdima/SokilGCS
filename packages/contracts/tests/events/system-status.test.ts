import { describe, expect, it } from 'vitest';
import { SystemStatusSchema } from '../../src/events/dto/system-status.dto';

describe('SystemStatusSchema', () => {
  const validStatus = {
    uptime: 3600,
    loadAverage: 0.5,
    memoryUsage: {
      total: 16,
      used: 8,
      free: 8
    }
  };

  it('should validate a correct system status', () => {
    expect(SystemStatusSchema.parse(validStatus)).toEqual(validStatus);
  });

  it('should fail if uptime is not positive', () => {
    const invalid = { ...validStatus, uptime: -1 };
    expect(() => SystemStatusSchema.parse(invalid)).toThrow();
  });

  it('should fail if loadAverage is negative', () => {
    const invalid = { ...validStatus, loadAverage: -0.1 };
    expect(() => SystemStatusSchema.parse(invalid)).toThrow();
  });

  it('should fail if memoryUsage is missing field', () => {
    const invalid = {
      uptime: 3600,
      loadAverage: 0.5,
      memoryUsage: { total: 16, used: 8 }
    };
    expect(() => SystemStatusSchema.parse(invalid)).toThrow();
  });
});
