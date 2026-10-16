import { describe, expect, it } from 'vitest';
import { CreateDroneSchema } from '@/drone/dto/create-drone.dto';

describe('CreateDroneSchema', () => {
  const validCreateRequest = {
    name: 'New Drone',
    callsign: 'NEW-01',
    serialNumber: 'SN-NEW',
    hardwareVersion: 'v2',
    firmwareVersion: 'v2.1'
  };

  it('should validate a correct creation request', () => {
    expect(CreateDroneSchema.parse(validCreateRequest)).toEqual(validCreateRequest);
  });

  it('should fail if required field is missing', () => {
    const { name, ...invalid } = validCreateRequest as any;
    expect(() => CreateDroneSchema.parse(invalid)).toThrow();
  });

  it('should fail if name is too long', () => {
    const invalid = { ...validCreateRequest, name: 'a'.repeat(51) };
    expect(() => CreateDroneSchema.parse(invalid)).toThrow();
  });
});
