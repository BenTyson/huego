// Tailwind Shade Scale Generation
// Generates Tailwind-compatible 50-950 shade scales from any base color using OKLCH

import type { ShadeScale, ShadeLevel } from "./types";
import { hexToOklch, oklchToHex, forceInGamut } from "./colors";

// Tailwind shade levels with their target lightness values (OKLCH L: 0-1)
// These values are derived from analyzing Tailwind's default color palette
const SHADE_LIGHTNESS: Record<ShadeLevel, number> = {
  50: 0.97,
  100: 0.93,
  200: 0.87,
  300: 0.77,
  400: 0.65,
  500: 0.55,
  600: 0.45,
  700: 0.37,
  800: 0.28,
  900: 0.20,
  950: 0.13,
};

// Chroma adjustment factors - lighter shades need lower chroma, darker shades preserve more
const SHADE_CHROMA_FACTOR: Record<ShadeLevel, number> = {
  50: 0.25,
  100: 0.35,
  200: 0.55,
  300: 0.75,
  400: 0.90,
  500: 1.0,
  600: 0.95,
  700: 0.85,
  800: 0.70,
  900: 0.55,
  950: 0.45,
};

/**
 * All available shade levels in order
 */
export const SHADE_LEVELS: ShadeLevel[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/**
 * Detect which Tailwind shade level (50-950) a color most closely matches
 * based on its OKLCH lightness value
 */
export function detectShadeLevel(hex: string): ShadeLevel {
  const oklch = hexToOklch(hex);
  const lightness = oklch.l;

  let closestShade: ShadeLevel = 500;
  let closestDiff = Infinity;

  for (const [shade, targetL] of Object.entries(SHADE_LIGHTNESS)) {
    const diff = Math.abs(lightness - targetL);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestShade = parseInt(shade) as ShadeLevel;
    }
  }

  return closestShade;
}

/**
 * Generate a full Tailwind-compatible shade scale from a base color
 * Uses OKLCH for perceptually uniform color generation
 */
export function generateShadeScale(hex: string): ShadeScale {
  const baseOklch = hexToOklch(hex);
  const baseChroma = baseOklch.c;
  const hue = baseOklch.h;

  const shades: Partial<ShadeScale> = {};

  for (const shade of SHADE_LEVELS) {
    const targetLightness = SHADE_LIGHTNESS[shade];
    const chromaFactor = SHADE_CHROMA_FACTOR[shade];

    // Calculate chroma - adjust based on shade level while preserving relative saturation
    // For very light/dark shades, reduce chroma to keep colors in gamut
    const targetChroma = baseChroma * chromaFactor;

    // Create the shade color in OKLCH
    const shadeOklch = {
      l: targetLightness,
      c: targetChroma,
      h: hue,
    };

    // Force into sRGB gamut (reduce chroma if necessary)
    const gamutClamped = forceInGamut(shadeOklch);

    // Convert to hex
    shades[shade] = oklchToHex(gamutClamped);
  }

  return shades as ShadeScale;
}

/**
 * Generate shade scale and include info about which shade the original color maps to
 */
export function generateShadeScaleWithBase(hex: string): {
  scale: ShadeScale;
  baseShade: ShadeLevel;
  baseHex: string;
} {
  const scale = generateShadeScale(hex);
  const baseShade = detectShadeLevel(hex);

  return {
    scale,
    baseShade,
    baseHex: hex.toUpperCase(),
  };
}

/**
 * Get a specific shade from a base color
 */
export function getShade(baseHex: string, shade: ShadeLevel): string {
  const scale = generateShadeScale(baseHex);
  return scale[shade];
}

/**
 * Get contrasting shades for text on a given shade background
 * Returns light text shade and dark text shade options
 */
export function getContrastingShades(
  scale: ShadeScale,
  backgroundShade: ShadeLevel
): { light: ShadeLevel; dark: ShadeLevel } {
  const bgLightness = SHADE_LIGHTNESS[backgroundShade];

  if (bgLightness > 0.5) {
    // Light background - use dark text
    return { light: 50, dark: 900 };
  } else {
    // Dark background - use light text
    return { light: 100, dark: 950 };
  }
}

/**
 * Generate CSS custom properties for a shade scale
 */
export function shadeScaleToCSS(scale: ShadeScale, prefix: string): string {
  const lines: string[] = [];
  for (const [shade, hex] of Object.entries(scale)) {
    lines.push(`  --${prefix}-${shade}: ${hex};`);
  }
  return lines.join("\n");
}
