/**
 * Color Name Search Module
 * Finds the closest named color using OKLab Euclidean distance
 */

import { rgbToOklab } from "../colors";
import type { RGB, HSL } from "../types";
import { namedColors } from "./database";

/** Maximum distance threshold for a "close enough" match */
const DISTANCE_THRESHOLD = 0.12;

/**
 * Find the closest named color by OKLab Euclidean distance
 */
export function findClosestColorName(rgb: RGB): { name: string; distance: number } {
  const lab = rgbToOklab(rgb);

  let closestName = "";
  let closestDistance = Infinity;

  for (const color of namedColors) {
    // Calculate Euclidean distance in OKLab space
    const dL = lab.L - color.lab.L;
    const da = lab.a - color.lab.a;
    const db = lab.b - color.lab.b;
    const distance = Math.sqrt(dL * dL + da * da + db * db);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestName = color.name;

      // Early exit for exact matches
      if (distance === 0) break;
    }
  }

  return { name: closestName, distance: closestDistance };
}

/**
 * Get a color name using two-tier lookup:
 * 1. Try Name That Color database for exact/close matches
 * 2. Fall back to enhanced algorithmic naming
 *
 * @param rgb - RGB values for database lookup
 * @param algorithmicName - Pre-computed algorithmic name as fallback
 */
export function getColorName(rgb: RGB, algorithmicName: string): string {
  const { name, distance } = findClosestColorName(rgb);

  // Use database name if close enough
  if (distance <= DISTANCE_THRESHOLD) {
    return name;
  }

  // Otherwise use algorithmic fallback
  return algorithmicName;
}
