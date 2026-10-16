import { describe, expect, it } from 'vitest';
import { DroneEntitySchema } from '@/drone/entities/drone.entity';

describe('DroneEntitySchema', () => {
  const validDrone = {
    _id: '550e8400-e29b-41d4-a716-446655440000',
    _createdAt: '2023-01-01T00:00:00Z',
    _updatedAt: '2023-01-01T00:00:00Z',
    name: 'Test Drone',
    callsign: 'TEST-01',
    serialNumber: 'SN-12345',
    hardwareVersion: 'v1.0',
    firmwareVersion: 'v1.0.0'
  };

  it('should validate a correct drone entity', () => {
    expect(DroneEntitySchema.parse(validDrone)).toEqual(validDrone);
  });

  it('should fail if name is too short', () => {
    const invalid = { ...validDrone, name: 'A' };
    expect(() => DroneEntitySchema.parse(invalid)).toThrow();
  });

  it('should fail if name is too long', () => {
    const invalid = { ...validDrone, name: 'A'.repeat(51) };
    expect(() => DroneEntitySchema.parse(invalid)).toThrow();
  });

  it('should fail if callsign is too long', () => {
    const invalid = { ...validDrone, callsign: 'A'.repeat(21) };
    expect(() => DroneEntitySchema.parse(invalid)).toThrow();
  });

  it('should fail if required field is missing', () => {
    const { name, ...invalid } = validDrone as any;
    expect(() => DroneEntitySchema.parse(invalid)).toThrow();
  });
});
