// Color conversion utilities for HueGo
// Using OKLCH for perceptually uniform color generation

import type { RGB, HSL, OKLCH, Color } from "./types";
import { getColorName } from "./color-names";

// ============================================
// HEX conversions
// ============================================

export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

// ============================================
// HSL conversions
// ============================================

export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: l * 100 };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    case b:
      h = ((r - g) / d + 4) / 6;
      break;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex));
}

export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

// ============================================
// OKLCH conversions (for perceptually uniform colors)
// ============================================

// Linear RGB helpers
function srgbToLinear(c: number): number {
  c = c / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  c = Math.max(0, Math.min(1, c));
  return Math.round(
    (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055) * 255
  );
}

// RGB to OKLab
export function rgbToOklab(rgb: RGB): { L: number; a: number; b: number } {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

// OKLab to RGB
function oklabToRgb(lab: { L: number; a: number; b: number }): RGB {
  const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
  const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
  const s_ = lab.L - 0.0894841775 * lab.a - 1.291485548 * lab.b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return {
    r: linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  };
}

export function rgbToOklch(rgb: RGB): OKLCH {
  const lab = rgbToOklab(rgb);
  const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  let h = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;
  if (h < 0) h += 360;

  return {
    l: lab.L,
    c: c,
    h: h,
  };
}

export function oklchToRgb(oklch: OKLCH): RGB {
  const hRad = (oklch.h * Math.PI) / 180;
  const lab = {
    L: oklch.l,
    a: oklch.c * Math.cos(hRad),
    b: oklch.c * Math.sin(hRad),
  };
  return oklabToRgb(lab);
}

export function hexToOklch(hex: string): OKLCH {
  return rgbToOklch(hexToRgb(hex));
}

export function oklchToHex(oklch: OKLCH): string {
  return rgbToHex(oklchToRgb(oklch));
}

// ============================================
// Utility functions
// ============================================

/**
 * Calculate relative luminance for WCAG contrast calculations
 */
export function getLuminance(rgb: RGB): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(rgb1: RGB, rgb2: RGB): number {
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determine if white or black text has better contrast
 */
export function getContrastColor(rgb: RGB): "white" | "black" {
  const luminance = getLuminance(rgb);
  return luminance > 0.179 ? "black" : "white";
}

/**
 * Check WCAG contrast levels
 */
export function getContrastLevel(
  ratio: number
): "fail" | "AA-large" | "AA" | "AAA" {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA-large";
  return "fail";
}

/**
 * Clamp OKLCH values to valid ranges and ensure in-gamut RGB
 */
export function clampOklch(oklch: OKLCH): OKLCH {
  return {
    l: Math.max(0, Math.min(1, oklch.l)),
    c: Math.max(0, Math.min(0.4, oklch.c)),
    h: ((oklch.h % 360) + 360) % 360,
  };
}

/**
 * Check if OKLCH color is within sRGB gamut
 */
export function isInGamut(oklch: OKLCH): boolean {
  const rgb = oklchToRgb(oklch);
  return (
    rgb.r >= 0 && rgb.r <= 255 && rgb.g >= 0 && rgb.g <= 255 && rgb.b >= 0 && rgb.b <= 255
  );
}

/**
 * Reduce chroma until color is in gamut using binary search
 * O(log n) vs O(n) for linear reduction
 */
export function forceInGamut(oklch: OKLCH): OKLCH {
  // If already in gamut, return as-is
  if (isInGamut(oklch)) {
    return oklch;
  }

  // Binary search for maximum in-gamut chroma
  let low = 0;
  let high = oklch.c;
  const epsilon = 0.001; // Precision threshold

  while (high - low > epsilon) {
    const mid = (low + high) / 2;
    const testColor = { ...oklch, c: mid };

    if (isInGamut(testColor)) {
      low = mid; // Can try higher chroma
    } else {
      high = mid; // Need lower chroma
    }
  }

  return { ...oklch, c: low };
}

/**
 * Create a full Color object from a hex value
 */
export function createColor(hex: string, name?: string): Color {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  const oklch = rgbToOklch(rgb);
  const contrastColor = getContrastColor(rgb);

  return {
    hex: hex.toUpperCase(),
    rgb,
    hsl,
    oklch,
    name: name || generateColorName(hsl, rgb),
    contrastColor,
  };
}

// ============================================
// Enhanced Algorithmic Color Naming
// ============================================

/**
 * Get enhanced grayscale name based on lightness
 */
function getGrayscaleName(l: number): string {
  if (l < 8) return "Jet";
  if (l < 18) return "Charcoal";
  if (l < 30) return "Slate";
  if (l < 45) return "Pewter";
  if (l < 60) return "Gray";
  if (l < 75) return "Silver";
  if (l < 88) return "Pearl";
  return "Snow";
}

/**
 * Get enhanced hue name with 24+ options based on narrower degree ranges
 */
function getEnhancedHueName(h: number, s: number, l: number): string {
  // Reds (345-15)
  if (h >= 345 || h < 8) return l < 35 ? "Crimson" : s > 70 ? "Scarlet" : "Red";
  if (h < 15) return l < 40 ? "Ruby" : "Cherry";

  // Oranges (15-45)
  if (h < 22) return l > 65 ? "Peach" : "Coral";
  if (h < 32) return l > 60 ? "Apricot" : "Tangerine";
  if (h < 45) return "Orange";

  // Yellows (45-75)
  if (h < 52) return s > 60 ? "Amber" : "Gold";
  if (h < 62) return l > 70 ? "Lemon" : "Honey";
  if (h < 75) return "Yellow";

  // Yellow-Greens (75-105)
  if (h < 85) return "Chartreuse";
  if (h < 95) return "Lime";
  if (h < 105) return "Apple";

  // Greens (105-150)
  if (h < 120) return l < 40 ? "Forest" : "Emerald";
  if (h < 135) return s < 50 ? "Sage" : "Green";
  if (h < 150) return l > 60 ? "Mint" : "Green";

  // Teals (150-180)
  if (h < 160) return "Jade";
  if (h < 170) return "Teal";
  if (h < 180) return "Seafoam";

  // Cyans (180-200)
  if (h < 188) return "Aqua";
  if (h < 195) return "Cyan";
  if (h < 200) return "Turquoise";

  // Blues (200-255)
  if (h < 210) return "Azure";
  if (h < 220) return l > 60 ? "Sky" : "Cerulean";
  if (h < 235) return l < 35 ? "Navy" : "Cobalt";
  if (h < 248) return s > 70 ? "Sapphire" : "Blue";
  if (h < 255) return "Blue";

  // Purples (255-290)
  if (h < 268) return l < 40 ? "Indigo" : "Violet";
  if (h < 280) return s < 50 ? "Plum" : "Purple";
  if (h < 290) return "Purple";

  // Magentas (290-320)
  if (h < 300) return s > 70 ? "Fuchsia" : "Magenta";
  if (h < 310) return "Berry";
  if (h < 320) return "Magenta";

  // Pinks (320-345)
  if (h < 328) return l > 70 ? "Blush" : "Rose";
  if (h < 338) return l > 60 ? "Salmon" : "Pink";
  return "Pink";
}

/**
 * Get lightness modifier based on lightness and saturation
 */
function getLightnessModifier(l: number, s: number): string {
  if (l < 20) return "Deep";
  if (l < 35) return s > 60 ? "Rich" : "Dark";
  if (l > 80) return s < 40 ? "Pastel" : "Pale";
  if (l > 65) return "Soft";
  return "";
}

/**
 * Get saturation modifier based on saturation and lightness
 */
function getSaturationModifier(s: number, l: number): string {
  // Don't add saturation modifiers for very dark or very light colors
  if (l < 20 || l > 85) return "";

  if (s < 25) return "Dusty";
  if (s < 40) return "Faded";
  if (s < 55) return "Muted";
  if (s > 90) return "Electric";
  if (s > 75) return "Vivid";
  if (s > 60) return "Bright";
  return "";
}

/**
 * Combine modifiers with hue name to create natural-sounding names
 */
function combineModifiers(
  lightMod: string,
  satMod: string,
  hueName: string
): string {
  // Avoid awkward double modifiers - pick the more descriptive one
  if (lightMod && satMod) {
    // Certain combinations work well together
    const goodCombos = [
      ["Deep", "Rich"],
      ["Soft", "Muted"],
      ["Pale", "Dusty"],
      ["Pastel", "Faded"],
    ];

    const isGoodCombo = goodCombos.some(
      ([a, b]) =>
        (lightMod === a && satMod === b) || (lightMod === b && satMod === a)
    );

    if (!isGoodCombo) {
      // Prefer the more specific modifier
      if (["Deep", "Rich", "Pastel"].includes(lightMod)) {
        return `${lightMod} ${hueName}`;
      }
      if (["Electric", "Vivid", "Dusty"].includes(satMod)) {
        return `${satMod} ${hueName}`;
      }
      // Default to lightness modifier
      return `${lightMod} ${hueName}`;
    }
  }

  // Single modifier or good combo
  if (lightMod && satMod) {
    return `${satMod} ${hueName}`;
  }
  if (lightMod) {
    return `${lightMod} ${hueName}`;
  }
  if (satMod) {
    return `${satMod} ${hueName}`;
  }

  return hueName;
}

/**
 * Generate enhanced algorithmic color name
 */
function generateAlgorithmicName(hsl: HSL): string {
  const { h, s, l } = hsl;

  // Handle achromatic colors (low saturation)
  if (s < 8) {
    return getGrayscaleName(l);
  }

  // Get fine-grained hue name
  const hueName = getEnhancedHueName(h, s, l);

  // Get contextual modifiers
  const lightMod = getLightnessModifier(l, s);
  const satMod = getSaturationModifier(s, l);

  // Combine intelligently
  return combineModifiers(lightMod, satMod, hueName);
}

/**
 * Generate a descriptive color name based on HSL and RGB
 * Uses two-tier system:
 * 1. Try Name That Color database for close matches
 * 2. Fall back to enhanced algorithmic naming
 */
export function generateColorName(hsl: HSL, rgb?: RGB): string {
  // Get the algorithmic name first (used as fallback)
  const algorithmicName = generateAlgorithmicName(hsl);

  // If RGB is provided, try database lookup
  if (rgb) {
    return getColorName(rgb, algorithmicName);
  }

  // Otherwise just use algorithmic naming
  return algorithmicName;
}

/**
 * Get text colors for a given background based on contrast requirements
 * Returns primary and muted text color values
 */
export function getTextColorsForBackground(contrastColor: "white" | "black"): {
  textColor: string;
  textColorMuted: string;
} {
  return {
    textColor: contrastColor === "white" ? "#ffffff" : "#000000",
    textColorMuted:
      contrastColor === "white" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
  };
}

/**
 * Parse any color format to hex
 */
export function parseColor(input: string): string | null {
  // Already hex
  if (/^#?[a-f\d]{6}$/i.test(input)) {
    return input.startsWith("#") ? input.toUpperCase() : `#${input.toUpperCase()}`;
  }

  // RGB format: rgb(255, 128, 0)
  const rgbMatch = input.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  if (rgbMatch) {
    return rgbToHex({
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    });
  }

  // HSL format: hsl(180, 50%, 50%)
  const hslMatch = input.match(
    /hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/i
  );
  if (hslMatch) {
    return hslToHex({
      h: parseInt(hslMatch[1]),
      s: parseInt(hslMatch[2]),
      l: parseInt(hslMatch[3]),
    });
  }

  return null;
}
