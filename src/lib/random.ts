// Shared random number utilities for HueGo
// Consolidates duplicated random functions across generate.ts, mood.ts, etc.

/**
 * Generate a random number within a range (inclusive)
 */
export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a random hue value (0-360)
 */
export function randomHue(): number {
  return Math.random() * 360;
}

/**
 * Normalize a hue value to 0-360 range
 */
export function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

/**
 * Generate a random hue within a specified range
 * Handles wrap-around (e.g., range from 350 to 10 degrees)
 */
export function randomHueInRange(range: [number, number]): number {
  const [min, max] = range;
  if (min <= max) {
    return randomInRange(min, max);
  }
  // Wrapping case (e.g., 280 to 60 wraps through 0)
  const rangeSize = (360 - min) + max;
  const r = Math.random() * rangeSize;
  return normalizeHue(min + r);
}

/**
 * Generate a random integer within a range (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle an array in place using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Pick a random element from an array
 */
export function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
