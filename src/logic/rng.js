// Mulberry32 PRNG and helpers
export function mulberry32(a) {
  return function() {
    let t = (a += 0x6D2B79F5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function randomSeed(seed) {
  if (typeof seed !== 'number') {
    seed = Math.floor(Math.random() * 2 ** 32)
  }
  return mulberry32(seed >>> 0)
}

export function oddBetween(min, max, rng) {
  const r = Math.floor((rng?.() ?? Math.random()) * (max - min + 1)) + min
  return r % 2 === 1 ? r : r + 1 <= max ? r + 1 : r - 1
}

