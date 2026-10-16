import { describe, expect, it } from 'vitest';
import { ChannelDefinitionSchema } from '../../src/telemetry/types/channel-definition.type';
import { LimitsSchema } from '../../src/telemetry/types/limits.type';

describe('Channel Definition Schema', () => {
  const validChannel = {
    id: 'battery.voltage',
    name: 'Battery Voltage',
    description: 'Voltage of the main battery',
    valueType: 'NUMBER' as const,
    unit: 'V',
    nominalRateHz: 10,
    limits: {
      yellowLow: 11,
      redLow: 10,
    }
  };

  it('should validate a correct channel definition', () => {
    expect(ChannelDefinitionSchema.parse(validChannel)).toEqual(validChannel);
  });

  it('should fail if id is invalid', () => {
    const invalid = { ...validChannel, id: 'Invalid ID!' };
    expect(() => ChannelDefinitionSchema.parse(invalid)).toThrow();
  });

  it('should fail if description is too long', () => {
    const invalid = { ...validChannel, description: 'a'.repeat(501) };
    expect(() => ChannelDefinitionSchema.parse(invalid)).toThrow();
  });

  it('should fail if limits are provided for non-NUMBER channel', () => {
    const invalid = {
      ...validChannel,
      valueType: 'STRING' as const,
      limits: { yellowLow: 5 }
    };
    expect(() => ChannelDefinitionSchema.parse(invalid)).toThrow();
  });

  describe('LimitsSchema', () => {
    it('should validate correct limits', () => {
      const limits = { redLow: 1, yellowLow: 2, yellowHigh: 3, redHigh: 4 };
      expect(LimitsSchema.parse(limits)).toEqual(limits);
    });

    it('should fail if limits are not ordered', () => {
      const invalid = { redLow: 5, yellowLow: 2 };
      expect(() => LimitsSchema.parse(invalid)).toThrow();
    });
  });
});
