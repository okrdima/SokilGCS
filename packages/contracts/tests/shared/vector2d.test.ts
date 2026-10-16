import { describe, expect, it } from 'vitest';
import { Vector2DSchema } from '../../src/shared/types/Vector2D.type';

describe('Vector2DSchema', () => {
  it('should validate a correct vector', () => {
    const validVector = { x: 1, y: 2 };
    expect(Vector2DSchema.parse(validVector)).toEqual(validVector);
  });

  it('should fail if a field is missing', () => {
    const invalidVector = { x: 1 };
    expect(() => Vector2DSchema.parse(invalidVector)).toThrow();
  });

  it('should fail if a field is not a number', () => {
    const invalidVector = { x: '1', y: 2 };
    expect(() => Vector2DSchema.parse(invalidVector)).toThrow();
  });
});
