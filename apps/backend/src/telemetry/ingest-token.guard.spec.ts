import {
  ExecutionContext,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { IngestTokenGuard } from './ingest-token.guard';

describe('IngestTokenGuard', () => {
  let guard: IngestTokenGuard;
  const originalEnv = process.env;

  beforeEach(() => {
    guard = new IngestTokenGuard();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const createMockContext = (headers: Record<string, string | undefined>): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ headers }),
      }),
    } as unknown as ExecutionContext;
  };

  it('passes when valid token is provided in x-api-key', () => {
    process.env.INGEST_TOKEN = 'secret-passphrase-123';
    const ctx = createMockContext({ 'x-api-key': 'secret-passphrase-123' });

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('throws UnauthorizedException (401) on wrong token', () => {
    process.env.INGEST_TOKEN = 'secret-passphrase-123';
    const ctx = createMockContext({ 'x-api-key': 'wrong-passphrase-123' });

    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException (401) on missing x-api-key header', () => {
    process.env.INGEST_TOKEN = 'secret-passphrase-123';
    const ctx = createMockContext({});

    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException (401) when token length differs', () => {
    process.env.INGEST_TOKEN = 'secret-passphrase-123';
    const ctx = createMockContext({ 'x-api-key': 'short' });

    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('throws ServiceUnavailableException (503) when INGEST_TOKEN is not configured', () => {
    delete process.env.INGEST_TOKEN;
    const ctx = createMockContext({ 'x-api-key': 'any-token' });

    expect(() => guard.canActivate(ctx)).toThrow(ServiceUnavailableException);
  });
});
