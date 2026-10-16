import { describe, expect, it } from 'vitest';
import { Vector3DSchema } from '../../src/shared/types/Vector3D.type';

describe('Vector3DSchema', () => {
  it('should validate a correct vector', () => {
    const validVector = { x: 1, y: 2, z: 3 };
    expect(Vector3DSchema.parse(validVector)).toEqual(validVector);
  });

  it('should fail if a field is missing', () => {
    const invalidVector = { y: 2, z: 3 };
    expect(() => Vector3DSchema.parse(invalidVector)).toThrow();
  });

  it('should fail if a field is not a number', () => {
    const invalidVector = { x: '1', y: 2, z: 3 };
    expect(() => Vector3DSchema.parse(invalidVector)).toThrow();
  });

  it('should fail if an extra field is provided (strictness check)', () => {
    // Since we want our schemas to be strict, extra fields should trigger a ZodError
    const extraVector = { x: 1, y: 2, z: 3, w: 4 };
    expect(() => Vector3DSchema.parse(extraVector)).toThrow();
  });
});
