import { describe, expect, it } from 'vitest';
import { GeoPointSchema } from '../../src/shared/types/geo-point.type';

describe('GeoPointSchema', () => {
  it('should validate a correct geo point', () => {
    const valid = { lat: 45, lon: -75, alt: 100 };
    expect(GeoPointSchema.parse(valid)).toEqual(valid);
  });

  it('should fail if latitude is out of range', () => {
    const invalid = { lat: 95, lon: -75, alt: 100 };
    expect(() => GeoPointSchema.parse(invalid)).toThrow();
  });

  it('should fail if longitude is out of range', () => {
    const invalid = { lat: 45, lon: -190, alt: 100 };
    expect(() => GeoPointSchema.parse(invalid)).toThrow();
  });

  it('should fail if a field is missing', () => {
    const invalid = { lat: 45, lon: -75 };
    expect(() => GeoPointSchema.parse(invalid)).toThrow();
  });
});
