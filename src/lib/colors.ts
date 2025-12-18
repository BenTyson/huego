// Color conversion utilities for HueGo
// Using OKLCH for perceptually uniform color generation

import type { RGB, HSL, OKLCH, Color } from "./types";

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
function rgbToOklab(rgb: RGB): { L: number; a: number; b: number } {
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
 * Reduce chroma until color is in gamut
 */
export function forceInGamut(oklch: OKLCH): OKLCH {
  const result = { ...oklch };
  while (!isInGamut(result) && result.c > 0) {
    result.c = Math.max(0, result.c - 0.01);
  }
  return result;
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
    name: name || generateColorName(hsl),
    contrastColor,
  };
}

/**
 * Generate a descriptive color name based on HSL
 */
export function generateColorName(hsl: HSL): string {
  const { h, s, l } = hsl;

  // Handle achromatic colors
  if (s < 10) {
    if (l < 15) return "Black";
    if (l < 30) return "Charcoal";
    if (l < 45) return "Dark Gray";
    if (l < 60) return "Gray";
    if (l < 75) return "Silver";
    if (l < 90) return "Light Gray";
    return "White";
  }

  // Determine hue name
  let hueName: string;
  if (h < 15) hueName = "Red";
  else if (h < 45) hueName = "Orange";
  else if (h < 75) hueName = "Yellow";
  else if (h < 105) hueName = "Lime";
  else if (h < 135) hueName = "Green";
  else if (h < 165) hueName = "Teal";
  else if (h < 195) hueName = "Cyan";
  else if (h < 225) hueName = "Sky";
  else if (h < 255) hueName = "Blue";
  else if (h < 285) hueName = "Purple";
  else if (h < 315) hueName = "Magenta";
  else if (h < 345) hueName = "Pink";
  else hueName = "Red";

  // Add lightness modifier
  let lightMod = "";
  if (l < 25) lightMod = "Dark ";
  else if (l > 75) lightMod = "Light ";

  // Add saturation modifier
  let satMod = "";
  if (s < 40) satMod = "Muted ";
  else if (s > 80) satMod = "Vivid ";

  return `${lightMod}${satMod}${hueName}`.trim();
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
