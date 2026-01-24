// Color factory utilities for HueGo
// Consolidates the common OKLCH → Hex → Color pattern

import type { Color, OKLCH } from "./types";
import { createColor, oklchToHex, forceInGamut, clampOklch } from "./colors";

/**
 * Create a Color object from OKLCH values
 * Handles clamping, gamut mapping, and conversion in one step
 */
export function colorFromOklch(oklch: OKLCH): Color {
  const clamped = clampOklch(oklch);
  const gamutMapped = forceInGamut(clamped);
  const hex = oklchToHex(gamutMapped);
  return createColor(hex);
}

/**
 * Create a Color object from OKLCH values without clamping
 * Use when values are already validated
 */
export function colorFromOklchUnclamped(oklch: OKLCH): Color {
  const gamutMapped = forceInGamut(oklch);
  const hex = oklchToHex(gamutMapped);
  return createColor(hex);
}

/**
 * Adjust a color's lightness and return new Color
 */
export function adjustLightness(color: Color, delta: number): Color {
  const newL = Math.max(0, Math.min(1, color.oklch.l + delta));
  return colorFromOklchUnclamped({
    ...color.oklch,
    l: newL,
  });
}

/**
 * Adjust a color's chroma (saturation) and return new Color
 */
export function adjustChroma(color: Color, delta: number): Color {
  const newC = Math.max(0, Math.min(0.4, color.oklch.c + delta));
  return colorFromOklchUnclamped({
    ...color.oklch,
    c: newC,
  });
}

/**
 * Shift a color's hue and return new Color
 */
export function shiftHue(color: Color, degrees: number): Color {
  const newH = (color.oklch.h + degrees + 360) % 360;
  return colorFromOklchUnclamped({
    ...color.oklch,
    h: newH,
  });
}

/**
 * Invert a color's lightness
 */
export function invertLightness(color: Color): Color {
  return colorFromOklchUnclamped({
    l: 1 - color.oklch.l,
    c: color.oklch.c,
    h: color.oklch.h,
  });
}

/**
 * Get the complementary color (180° hue shift)
 */
export function getComplement(color: Color): Color {
  return shiftHue(color, 180);
}

/**
 * Create a tint (lighter version) of a color
 */
export function createTint(color: Color, amount: number = 0.2): Color {
  return adjustLightness(color, amount);
}

/**
 * Create a shade (darker version) of a color
 */
export function createShade(color: Color, amount: number = 0.2): Color {
  return adjustLightness(color, -amount);
}
