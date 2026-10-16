import { describe, expect, it } from 'vitest';
import { UnitUtilsSchema } from '../../src/shared/types/unit-utils.type';

describe('UnitUtilsSchema', () => {
  it('should validate an empty object', () => {
    const valid = {};
    expect(UnitUtilsSchema.parse(valid)).toEqual(valid);
  });

  it('should fail with content as it is an empty object schema', () => {
    const invalid = { someUnit: 'meters' };
    expect(() => UnitUtilsSchema.parse(invalid)).toThrow();
  });
});
