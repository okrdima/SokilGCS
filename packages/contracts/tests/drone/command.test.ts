import { describe, expect, it } from 'vitest';
import { 
  CommandRequestSchema, 
  CommandStatusUpdateSchema,
  CommandStatusSchema,
  CommandArgValueSchema
} from '../../src/drone/types/drone-command.type';

describe('Command Types', () => {
  describe('CommandRequestSchema', () => {
    const validCommand = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      sessionId: '550e8400-e29b-41d4-a716-446655440001',
      name: 'ARM',
      args: {
        mode: 'AUTONOMOUS'
      },
      requestedAt: 1672531200000,
      timeoutMs: 5000
    };

    it('should validate a correct command request', () => {
      expect(CommandRequestSchema.parse(validCommand)).toEqual(validCommand);
    });

    it('should fail if name is too long', () => {
      const invalidCommand = { ...validCommand, name: 'a'.repeat(65) };
      expect(() => CommandRequestSchema.parse(invalidCommand)).toThrow();
    });

    it('should fail if timeoutMs is too high', () => {
      const invalidCommand = { ...validCommand, timeoutMs: 60001 };
      expect(() => CommandRequestSchema.parse(invalidCommand)).toThrow();
    });
  });

  describe('CommandStatusSchema', () => {
    it('should validate all enum values', () => {
      const statuses = ['PENDING', 'SENT', 'ACKNOWLEDGED', 'REJECTED', 'FAILED', 'TIMED_OUT'] as const;
      statuses.forEach(s => {
        expect(CommandStatusSchema.parse(s)).toBe(s);
      });
    });

    it('should fail on invalid status', () => {
      expect(() => CommandStatusSchema.parse('UNKNOWN')).toThrow();
    });
  });

  describe('CommandArgValueSchema', () => {
    it('should validate number', () => {
      expect(CommandArgValueSchema.parse(10)).toBe(10);
    });
    it('should validate boolean', () => {
      expect(CommandArgValueSchema.parse(true)).toBe(true);
    });
    it('should validate string', () => {
      expect(CommandArgValueSchema.parse('hello')).toBe('hello');
    });
    it('should fail on too long string', () => {
      expect(() => CommandArgValueSchema.parse('a'.repeat(201))).toThrow();
    });
  });

  describe('CommandStatusUpdateSchema', () => {
    const validUpdate = {
      commandId: '550e8400-e29b-41d4-a716-446655440000',
      status: 'ACKNOWLEDGED',
      at: 1672531200000,
      detail: 'All systems go'
    };

    it('should validate a correct update', () => {
      expect(CommandStatusUpdateSchema.parse(validUpdate)).toEqual(validUpdate);
    });

    it('should fail if commandId is missing', () => {
      const { commandId, ...invalid } = validUpdate as any;
      expect(() => CommandStatusUpdateSchema.parse(invalid)).toThrow();
    });
  });
});
