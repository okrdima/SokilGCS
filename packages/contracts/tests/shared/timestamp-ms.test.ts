import { describe, expect, it } from 'vitest';
import { TimestampMsSchema } from '../../src/shared/types/timestamp.type';

describe('TimestampMsSchema', () => {
  it('should validate a positive integer', () => {
    const valid = 1672531200000;
    expect(TimestampMsSchema.parse(valid)).toBe(valid);
  });

  it('should fail on negative numbers', () => {
    const invalid = -1;
    expect(() => TimestampMsSchema.parse(invalid)).toThrow();
  });

  it('should fail on non-integers', () => {
    const invalid = 1672531200000.5;
    expect(() => TimestampMsSchema.parse(invalid)).toThrow();
  });

  it('should fail if type is string', () => {
    const invalid = '1672531200000';
    expect(() => TimestampMsSchema.parse(invalid)).toThrow();
  });
});
