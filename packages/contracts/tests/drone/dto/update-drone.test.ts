import { describe, expect, it } from 'vitest';
import { UpdateDroneSchema } from '@/drone/dto/update-drone.dto';

describe('UpdateDroneSchema', () => {
  it('should validate a correct update request', () => {
    const valid = {
      _id: '550e8400-e29b-41d4-a716-446655440000',
      _createdAt: '2023-01-01T00:00:00Z',
      _updatedAt: '2023-01-01T00:00:00Z',
      name: 'Updated Name',
      callsign: 'UPD-01',
      serialNumber: 'SN-UPD',
      hardwareVersion: 'v2',
      firmwareVersion: 'v2.1'
    };
    expect(UpdateDroneSchema.parse(valid)).toEqual(valid);
  });

  it('should fail if name is too short', () => {
    const invalid = {
      _id: '550e8400-e29b-41d4-a716-446655440000',
      _createdAt: '2023-01-01T00:00:00Z',
      _updatedAt: '2023-01-01T00:00:00Z',
      name: 'A',
      callsign: 'UPD-01',
      serialNumber: 'SN-UPD',
      hardwareVersion: 'v2',
      firmwareVersion: 'v2.1'
    };
    expect(() => UpdateDroneSchema.parse(invalid)).toThrow();
  });
});
