import { validateEnv } from './env';

describe('validateEnv', () => {
  it('should use default values when env is empty', () => {
    const env = validateEnv({});
    expect(env.PORT).toBe(3000);
    expect(env.WEB_ORIGIN).toBe('http://localhost:3000');
    expect(env.SIMULATOR_ENABLED).toBe(true);
    expect(env.SIMULATOR_SEED).toBe(42);
    expect(env.SIMULATOR_BATTERY_DRAIN_SECONDS).toBe(600);
    expect(env.INGEST_TOKEN).toBeUndefined();
  });

  it('should parse valid string overrides', () => {
    const env = validateEnv({
      PORT: '4000',
      WEB_ORIGIN: 'http://localhost:5173',
      SIMULATOR_ENABLED: 'false',
      SIMULATOR_SEED: '123',
      SIMULATOR_BATTERY_DRAIN_SECONDS: '300',
      INGEST_TOKEN: 'secret-token',
    });
    expect(env.PORT).toBe(4000);
    expect(env.WEB_ORIGIN).toBe('http://localhost:5173');
    expect(env.SIMULATOR_ENABLED).toBe(false);
    expect(env.SIMULATOR_SEED).toBe(123);
    expect(env.SIMULATOR_BATTERY_DRAIN_SECONDS).toBe(300);
    expect(env.INGEST_TOKEN).toBe('secret-token');
  });

  it('should throw when invalid types are passed', () => {
    expect(() => validateEnv({ PORT: 'not-a-number' })).toThrow('Environment validation failed');
  });
});
