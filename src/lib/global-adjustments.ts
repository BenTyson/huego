// Global color adjustment utilities for HueGo
// Applies uniform adjustments (hue, saturation, temperature) to all colors at once

import type { Color, OKLCH } from "./types";
import { hexToOklch, oklchToHex, forceInGamut, createColor } from "./colors";

export interface GlobalAdjustments {
  hue: number;        // -180 to +180 degrees delta
  saturation: number; // -100 to +100 percentage delta
  temperature: number; // -100 to +100 (cool to warm)
}

export const DEFAULT_ADJUSTMENTS: GlobalAdjustments = {
  hue: 0,
  saturation: 0,
  temperature: 0,
};

/**
 * Check if any adjustments have been made
 */
export function isAdjusted(adjustments: GlobalAdjustments): boolean {
  return (
    adjustments.hue !== 0 ||
    adjustments.saturation !== 0 ||
    adjustments.temperature !== 0
  );
}

/**
 * Normalize hue to 0-360 range
 */
function normalizeHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

/**
 * Calculate the shortest path between two hues
 * Returns a signed value indicating direction and magnitude
 */
function shortestHuePath(from: number, to: number): number {
  const diff = to - from;
  const normalizedDiff = ((diff + 180) % 360) - 180;
  return normalizedDiff;
}

/**
 * Apply temperature shift to a color
 * Temperature > 0: shift toward warm (30° - orange/red)
 * Temperature < 0: shift toward cool (210° - blue/cyan)
 */
export function applyTemperature(oklch: OKLCH, temperature: number): OKLCH {
  if (temperature === 0) return oklch;

  // Target hues for warm (orange) and cool (blue)
  const targetHue = temperature > 0 ? 30 : 210;

  // Calculate shift magnitude (0-1)
  const shiftMagnitude = Math.abs(temperature) / 100;

  // Get shortest path to target hue
  const hueDelta = shortestHuePath(oklch.h, targetHue) * shiftMagnitude * 0.3;

  return {
    ...oklch,
    h: normalizeHue(oklch.h + hueDelta),
  };
}

/**
 * Apply all global adjustments to a single OKLCH color
 */
function applyAdjustmentsToOklch(oklch: OKLCH, adjustments: GlobalAdjustments): OKLCH {
  let result = { ...oklch };

  // 1. Apply hue shift
  if (adjustments.hue !== 0) {
    result.h = normalizeHue(result.h + adjustments.hue);
  }

  // 2. Apply saturation (chroma) adjustment
  if (adjustments.saturation !== 0) {
    // Scale chroma by percentage
    // +100 = double chroma, -100 = zero chroma
    const multiplier = 1 + adjustments.saturation / 100;
    result.c = Math.max(0, Math.min(0.4, result.c * multiplier));
  }

  // 3. Apply temperature shift
  if (adjustments.temperature !== 0) {
    result = applyTemperature(result, adjustments.temperature);
  }

  return result;
}

/**
 * Apply global adjustments to an array of colors
 * Returns new Color objects with adjusted values
 */
export function applyGlobalAdjustments(
  colors: Color[],
  adjustments: GlobalAdjustments
): Color[] {
  // If no adjustments, return original colors
  if (!isAdjusted(adjustments)) {
    return colors;
  }

  return colors.map((color) => {
    // Get OKLCH values
    const oklch = hexToOklch(color.hex);

    // Apply adjustments
    const adjustedOklch = applyAdjustmentsToOklch(oklch, adjustments);

    // Force into gamut and convert back
    const gamutMapped = forceInGamut(adjustedOklch);
    const newHex = oklchToHex(gamutMapped);

    // Create new color object
    return createColor(newHex);
  });
}

/**
 * Generate slider gradient for hue adjustment
 * Shows rainbow spectrum
 */
export function getHueGradient(): string {
  return `linear-gradient(to right,
    hsl(0, 80%, 60%),
    hsl(60, 80%, 60%),
    hsl(120, 80%, 60%),
    hsl(180, 80%, 60%),
    hsl(240, 80%, 60%),
    hsl(300, 80%, 60%),
    hsl(360, 80%, 60%)
  )`;
}

/**
 * Generate slider gradient for saturation adjustment
 * Shows gray to saturated
 */
export function getSaturationGradient(): string {
  return `linear-gradient(to right,
    hsl(210, 5%, 50%),
    hsl(210, 50%, 50%),
    hsl(210, 100%, 50%)
  )`;
}

/**
 * Generate slider gradient for temperature adjustment
 * Shows cool (blue) to warm (orange)
 */
export function getTemperatureGradient(): string {
  return `linear-gradient(to right,
    hsl(210, 80%, 55%),
    hsl(210, 40%, 60%),
    hsl(0, 0%, 70%),
    hsl(30, 50%, 60%),
    hsl(30, 90%, 55%)
  )`;
}
