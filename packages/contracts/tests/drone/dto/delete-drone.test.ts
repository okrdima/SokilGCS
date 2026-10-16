import { describe, expect, it } from 'vitest';
import { DeleteDroneSchema } from '@/drone/dto/delete-drone.dto';

describe('DeleteDroneSchema', () => {
  it('should validate a correct delete request', () => {
    const valid = { _id: '550e8400-e29b-41d4-a716-446655440000' };
    expect(DeleteDroneSchema.parse(valid)).toEqual(valid);
  });

  it('should fail if _id is not a UUID', () => {
    const invalid = { _id: 'not-a-uuid' };
    expect(() => DeleteDroneSchema.parse(invalid)).toThrow();
  });
});
