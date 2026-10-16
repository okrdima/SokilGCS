import { describe, expect, it } from 'vitest';
import { BaseEntitySchema } from '../../src/shared/types/base-entity.type';

describe('BaseEntitySchema', () => {
  const validEntity = {
    _id: '550e8400-e29b-41d4-a716-446655440000',
    _createdAt: '2023-01-01T00:00:00Z',
    _updatedAt: '2023-01-01T00:00:00Z',
    _createdBy: '550e8400-e29b-41d4-a716-446655440001',
    _updatedBy: '550e8400-e29b-41d4-a716-446655440002'
  };

  it('should validate a correct entity', () => {
    expect(BaseEntitySchema.parse(validEntity)).toEqual(validEntity);
  });

  it('should fail if _id is not a UUID', () => {
    const invalid = { ...validEntity, _id: 'not-a-uuid' };
    expect(() => BaseEntitySchema.parse(invalid)).toThrow();
  });

  it('should fail if _createdAt is not a valid ISO string or date', () => {
    const invalid = { ...validEntity, _createdAt: 'invalid-date' };
    expect(() => BaseEntitySchema.parse(invalid)).toThrow();
  });

  it('should fail if required field is missing', () => {
    const { _id, ...invalid } = validEntity as any;
    expect(() => BaseEntitySchema.parse(invalid)).toThrow();
  });
});
