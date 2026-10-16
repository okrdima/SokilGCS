import { describe, expect, it } from 'vitest';
import { TelemetrySampleSchema } from '../../src/telemetry/types/sample.type';
import { SessionSchema } from '../../src/telemetry/types/session.type';

describe('Sample & Session Schemas', () => {
  describe('TelemetrySampleSchema', () => {
    it('should validate a correct sample', () => {
      const valid = {
        channelId: 'battery.voltage',
        t: 1672531200000,
        value: 12.5,
        quality: 'GOOD'
      };
      expect(TelemetrySampleSchema.parse(valid)).toEqual(valid);
    });

    it('should validate a complex value (object)', () => {
      const valid = {
        channelId: 'gps.position',
        t: 1672531200000,
        value: { lat: 45, lon: -75 }
      };
      expect(TelemetrySampleSchema.parse(valid)).toEqual(valid);
    });

    it('should fail on missing channelId', () => {
      const invalid = { t: 1672531200000, value: 10 };
      expect(() => TelemetrySampleSchema.parse(invalid as any)).toThrow();
    });
  });

  describe('SessionSchema', () => {
    const validSession = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Test Session',
      sourceKind: 'SIMULATOR' as const,
      vehicleKind: 'MULTIROTOR' as const,
      startedAt: 1672531200000,
      channels: []
    };

    it('should validate a correct session', () => {
      expect(SessionSchema.parse(validSession)).toEqual(validSession);
    });

    it('should fail if endedAt is before startedAt', () => {
      const invalid = {
        ...validSession,
        endedAt: 1672531100000 // before startedAt
      };
      expect(() => SessionSchema.parse(invalid)).toThrow();
    });

    it('should fail if name is too long', () => {
      const invalid = { ...validSession, name: 'a'.repeat(101) };
      expect(() => SessionSchema.parse(invalid)).toThrow();
    });
  });
});
