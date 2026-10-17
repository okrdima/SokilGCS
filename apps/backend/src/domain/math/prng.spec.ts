import { mulberry32, hashSeed } from './prng';

describe('prng math utilities', () => {
  it('produces the exact same sequence given the same seed (determinism)', () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(42);

    const seq1 = Array.from({ length: 50 }, () => rng1());
    const seq2 = Array.from({ length: 50 }, () => rng2());

    expect(seq1).toEqual(seq2);
  });

  it('produces different sequences given different seeds', () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(43);

    const seq1 = Array.from({ length: 50 }, () => rng1());
    const seq2 = Array.from({ length: 50 }, () => rng2());

    expect(seq1).not.toEqual(seq2);
  });

  it('generates values strictly in [0, 1) across 1000 iterations', () => {
    const rng = mulberry32(1337);
    for (let i = 0; i < 1000; i++) {
      const val = rng();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });

  it('computes distinct seeds for distinct inputs', () => {
    expect(hashSeed('a', 1)).not.toBe(hashSeed('b', 1));
    expect(hashSeed('channel', 10)).not.toBe(hashSeed('channel', 11));
  });

  it('returns an unsigned 32-bit integer for hashSeed', () => {
    const seed = hashSeed('test', 999999);
    expect(seed).toBeGreaterThanOrEqual(0);
    expect(seed).toBeLessThanOrEqual(0xffffffff);
    expect(Number.isInteger(seed)).toBe(true);
  });
});
