import { describe, expect, it } from 'vitest';
import { AlarmSchema } from '../../src/events/types/alarm.type';

describe('AlarmSchema', () => {
  const validAlarm = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    sessionId: '550e8400-e29b-41d4-a716-446655440001',
    channelId: 'battery-level',
    severity: 'RED', // Based on the schema: AlarmSeveritySchema = LimitStateSchema.exclude(['NOMINAL']);
    message: 'Battery low!',
    value: { percentage: 0.1, voltage: 10 },
    raisedAt: 1672531200000,
  };

  it('should validate a correct alarm', () => {
    expect(AlarmSchema.parse(validAlarm)).toEqual(validAlarm);
  });

  it('should fail if message is too long', () => {
    const invalidAlarm = { ...validAlarm, message: 'a'.repeat(301) };
    expect(() => AlarmSchema.parse(invalidAlarm)).toThrow();
  });

  it('should fail if channelId is missing', () => {
    const { channelId, ...invalidAlarm } = validAlarm;
    expect(() => AlarmSchema.parse(invalidAlarm)).toThrow();
  });
});
