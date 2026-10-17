/**
 * Mulberry32 is a fast, high-quality 32-bit pseudorandom number generator.
 * Given a seed, returns a function that produces uniform pseudorandom floats in [0, 1).
 */
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Computes a deterministic 32-bit unsigned integer seed from string and numeric components.
 * Uses 32-bit FNV-1a hashing algorithm.
 */
export function hashSeed(...parts: Array<number | string>): number {
  let h = 0x811c9dc5 >>> 0; // FNV-1a offset basis
  for (const part of parts) {
    const str = String(part);
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0; // FNV-1a prime
    }
  }
  return h >>> 0;
}
