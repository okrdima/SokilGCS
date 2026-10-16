import { describe, expect, it } from 'vitest';
import { EulerAnglesSchema } from '../../src/shared/types/euler-angles.type';

describe('EulerAnglesSchema', () => {
  it('should validate a correct angle', () => {
    const valid = { pitch: 10, roll: -20, yaw: 180 };
    expect(EulerAnglesSchema.parse(valid)).toEqual(valid);
  });

  it('should fail if pitch is out of range', () => {
    const invalid = { pitch: 200, roll: 0, yaw: 0 };
    expect(() => EulerAnglesSchema.parse(invalid)).toThrow();
  });

  it('should fail if roll is out of range', () => {
    const invalid = { pitch: 0, roll: -190, yaw: 0 };
    expect(() => EulerAnglesSchema.parse(invalid)).toThrow();
  });

  it('should fail if yaw is out of range', () => {
    const invalid = { pitch: 0, roll: 0, yaw: 370 };
    expect(() => EulerAnglesSchema.parse(invalid)).toThrow();
  });

  it('should fail if a field is missing', () => {
    const invalid = { pitch: 0, roll: 0 };
    expect(() => EulerAnglesSchema.parse(invalid)).toThrow();
  });
});
