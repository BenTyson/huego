// Accessibility utilities for HueGo
// WCAG contrast checking and color blindness simulation

import type { Color, RGB } from "./types";
import { getContrastRatio, hexToRgb, rgbToHex } from "./colors";

// ============================================
// WCAG Contrast Checking
// ============================================

export type WCAGLevel = "AAA" | "AA" | "AA-large" | "fail";

export interface ContrastResult {
  ratio: number;
  level: WCAGLevel;
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
}

/**
 * Check contrast between two colors
 */
export function checkContrast(color1: Color, color2: Color): ContrastResult {
  const ratio = getContrastRatio(color1.rgb, color2.rgb);

  return {
    ratio: Math.round(ratio * 100) / 100,
    level: getWCAGLevel(ratio),
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
    passesAALarge: ratio >= 3,
  };
}

function getWCAGLevel(ratio: number): WCAGLevel {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA-large";
  return "fail";
}

/**
 * Get all contrast combinations in a palette
 */
export interface ContrastPair {
  color1Index: number;
  color2Index: number;
  color1: Color;
  color2: Color;
  result: ContrastResult;
}

export function getPaletteContrasts(colors: Color[]): ContrastPair[] {
  const pairs: ContrastPair[] = [];

  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      pairs.push({
        color1Index: i,
        color2Index: j,
        color1: colors[i],
        color2: colors[j],
        result: checkContrast(colors[i], colors[j]),
      });
    }
  }

  // Sort by contrast ratio (highest first)
  return pairs.sort((a, b) => b.result.ratio - a.result.ratio);
}

/**
 * Check contrast against white and black
 */
export interface ColorAccessibility {
  color: Color;
  onWhite: ContrastResult;
  onBlack: ContrastResult;
  bestBackground: "white" | "black";
}

export function checkColorAccessibility(color: Color): ColorAccessibility {
  const white: RGB = { r: 255, g: 255, b: 255 };
  const black: RGB = { r: 0, g: 0, b: 0 };

  const onWhiteRatio = getContrastRatio(color.rgb, white);
  const onBlackRatio = getContrastRatio(color.rgb, black);

  return {
    color,
    onWhite: {
      ratio: Math.round(onWhiteRatio * 100) / 100,
      level: getWCAGLevel(onWhiteRatio),
      passesAA: onWhiteRatio >= 4.5,
      passesAAA: onWhiteRatio >= 7,
      passesAALarge: onWhiteRatio >= 3,
    },
    onBlack: {
      ratio: Math.round(onBlackRatio * 100) / 100,
      level: getWCAGLevel(onBlackRatio),
      passesAA: onBlackRatio >= 4.5,
      passesAAA: onBlackRatio >= 7,
      passesAALarge: onBlackRatio >= 3,
    },
    bestBackground: onWhiteRatio > onBlackRatio ? "white" : "black",
  };
}

// ============================================
// Color Blindness Simulation
// ============================================

export type ColorBlindnessType =
  | "normal"
  | "protanopia"    // Red-blind
  | "deuteranopia"  // Green-blind
  | "tritanopia"    // Blue-blind
  | "achromatopsia"; // Complete color blindness

export interface ColorBlindnessOption {
  id: ColorBlindnessType;
  name: string;
  description: string;
  prevalence: string;
}

export const colorBlindnessOptions: ColorBlindnessOption[] = [
  {
    id: "normal",
    name: "Normal Vision",
    description: "No color vision deficiency",
    prevalence: "~92%",
  },
  {
    id: "protanopia",
    name: "Protanopia",
    description: "Red-blind (no red cones)",
    prevalence: "~1% of males",
  },
  {
    id: "deuteranopia",
    name: "Deuteranopia",
    description: "Green-blind (no green cones)",
    prevalence: "~6% of males",
  },
  {
    id: "tritanopia",
    name: "Tritanopia",
    description: "Blue-blind (no blue cones)",
    prevalence: "~0.01%",
  },
  {
    id: "achromatopsia",
    name: "Achromatopsia",
    description: "Complete color blindness",
    prevalence: "~0.003%",
  },
];

// Color blindness transformation matrices
// Based on scientific models of color vision deficiency

const matrices: Record<ColorBlindnessType, number[][]> = {
  normal: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
};

/**
 * Simulate how a color appears with color blindness
 */
export function simulateColorBlindness(
  rgb: RGB,
  type: ColorBlindnessType
): RGB {
  if (type === "normal") return rgb;

  const matrix = matrices[type];
  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255];

  const newR = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
  const newG = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
  const newB = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;

  return {
    r: Math.round(Math.max(0, Math.min(255, newR * 255))),
    g: Math.round(Math.max(0, Math.min(255, newG * 255))),
    b: Math.round(Math.max(0, Math.min(255, newB * 255))),
  };
}

/**
 * Simulate how a hex color appears with color blindness
 */
export function simulateColorBlindnessHex(
  hex: string,
  type: ColorBlindnessType
): string {
  const rgb = hexToRgb(hex);
  const simulated = simulateColorBlindness(rgb, type);
  return rgbToHex(simulated);
}

/**
 * Simulate an entire palette for color blindness
 */
export function simulatePaletteColorBlindness(
  colors: Color[],
  type: ColorBlindnessType
): string[] {
  return colors.map((color) => simulateColorBlindnessHex(color.hex, type));
}

/**
 * Check if colors are distinguishable for a color blindness type
 * Returns pairs that may be hard to distinguish
 */
export interface ConfusablePair {
  index1: number;
  index2: number;
  originalColors: [string, string];
  simulatedColors: [string, string];
  similarity: number; // 0-1, higher = more similar (harder to distinguish)
}

export function findConfusablePairs(
  colors: Color[],
  type: ColorBlindnessType,
  threshold: number = 0.9 // Similarity threshold
): ConfusablePair[] {
  const simulated = simulatePaletteColorBlindness(colors, type);
  const confusable: ConfusablePair[] = [];

  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const sim1 = hexToRgb(simulated[i]);
      const sim2 = hexToRgb(simulated[j]);

      // Calculate color similarity using Euclidean distance
      const distance = Math.sqrt(
        Math.pow(sim1.r - sim2.r, 2) +
        Math.pow(sim1.g - sim2.g, 2) +
        Math.pow(sim1.b - sim2.b, 2)
      );

      // Max distance is sqrt(3 * 255^2) ≈ 441.67
      const similarity = 1 - distance / 441.67;

      if (similarity >= threshold) {
        confusable.push({
          index1: i,
          index2: j,
          originalColors: [colors[i].hex, colors[j].hex],
          simulatedColors: [simulated[i], simulated[j]],
          similarity,
        });
      }
    }
  }

  return confusable.sort((a, b) => b.similarity - a.similarity);
}
