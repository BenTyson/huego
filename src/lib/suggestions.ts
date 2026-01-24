// Smart color suggestions for HueGo
// Generates intelligent color variations for discovery

import { oklchToHex, forceInGamut } from "./colors";
import type { Color, OKLCH } from "./types";

export interface ColorSuggestion {
  hex: string;
  label: string;
  category: SuggestionCategory;
}

export type SuggestionCategory =
  | "lighter"
  | "darker"
  | "saturated"
  | "muted"
  | "hue"
  | "complement";

export interface SuggestionGroup {
  category: SuggestionCategory;
  label: string;
  suggestions: ColorSuggestion[];
}

/**
 * Generate color suggestions for a given color
 */
export function generateSuggestions(color: Color): SuggestionGroup[] {
  const oklch = color.oklch;
  const groups: SuggestionGroup[] = [];

  // Lighter variations
  groups.push({
    category: "lighter",
    label: "Lighter",
    suggestions: generateLighterVariations(oklch),
  });

  // Darker variations
  groups.push({
    category: "darker",
    label: "Darker",
    suggestions: generateDarkerVariations(oklch),
  });

  // More saturated
  groups.push({
    category: "saturated",
    label: "More Vibrant",
    suggestions: generateSaturatedVariations(oklch),
  });

  // Less saturated (muted)
  groups.push({
    category: "muted",
    label: "More Muted",
    suggestions: generateMutedVariations(oklch),
  });

  // Adjacent hues
  groups.push({
    category: "hue",
    label: "Adjacent Hues",
    suggestions: generateHueVariations(oklch),
  });

  // Complementary
  groups.push({
    category: "complement",
    label: "Complementary",
    suggestions: generateComplementaryVariations(oklch),
  });

  return groups;
}

/**
 * Generate lighter variations (10% steps)
 */
function generateLighterVariations(oklch: OKLCH): ColorSuggestion[] {
  const suggestions: ColorSuggestion[] = [];
  const steps = [0.1, 0.2, 0.3];

  for (const step of steps) {
    const newL = Math.min(0.95, oklch.l + step);
    if (newL !== oklch.l) {
      const newColor = forceInGamut({ ...oklch, l: newL });
      const hex = oklchToHex(newColor);
      suggestions.push({
        hex,
        label: `+${Math.round(step * 100)}%`,
        category: "lighter",
      });
    }
  }

  return suggestions;
}

/**
 * Generate darker variations (10% steps)
 */
function generateDarkerVariations(oklch: OKLCH): ColorSuggestion[] {
  const suggestions: ColorSuggestion[] = [];
  const steps = [0.1, 0.2, 0.3];

  for (const step of steps) {
    const newL = Math.max(0.05, oklch.l - step);
    if (newL !== oklch.l) {
      const newColor = forceInGamut({ ...oklch, l: newL });
      const hex = oklchToHex(newColor);
      suggestions.push({
        hex,
        label: `-${Math.round(step * 100)}%`,
        category: "darker",
      });
    }
  }

  return suggestions;
}

/**
 * Generate more saturated (vibrant) variations
 */
function generateSaturatedVariations(oklch: OKLCH): ColorSuggestion[] {
  const suggestions: ColorSuggestion[] = [];
  const steps = [0.05, 0.1, 0.15];

  for (const step of steps) {
    const newC = Math.min(0.4, oklch.c + step);
    if (newC !== oklch.c) {
      const newColor = forceInGamut({ ...oklch, c: newC });
      const hex = oklchToHex(newColor);
      suggestions.push({
        hex,
        label: `+${Math.round(step * 100)}%`,
        category: "saturated",
      });
    }
  }

  return suggestions;
}

/**
 * Generate less saturated (muted) variations
 */
function generateMutedVariations(oklch: OKLCH): ColorSuggestion[] {
  const suggestions: ColorSuggestion[] = [];
  const steps = [0.05, 0.1, 0.15];

  for (const step of steps) {
    const newC = Math.max(0, oklch.c - step);
    const newColor = forceInGamut({ ...oklch, c: newC });
    const hex = oklchToHex(newColor);
    suggestions.push({
      hex,
      label: `-${Math.round(step * 100)}%`,
      category: "muted",
    });
  }

  return suggestions;
}

/**
 * Generate adjacent hue variations
 */
function generateHueVariations(oklch: OKLCH): ColorSuggestion[] {
  const suggestions: ColorSuggestion[] = [];
  const offsets = [-30, -15, 15, 30];

  for (const offset of offsets) {
    const newH = (oklch.h + offset + 360) % 360;
    const newColor = forceInGamut({ ...oklch, h: newH });
    const hex = oklchToHex(newColor);
    const sign = offset > 0 ? "+" : "";
    suggestions.push({
      hex,
      label: `${sign}${offset}°`,
      category: "hue",
    });
  }

  return suggestions;
}

/**
 * Generate complementary variations
 */
function generateComplementaryVariations(oklch: OKLCH): ColorSuggestion[] {
  const suggestions: ColorSuggestion[] = [];

  // Direct complement (180°)
  const complement = forceInGamut({ ...oklch, h: (oklch.h + 180) % 360 });
  suggestions.push({
    hex: oklchToHex(complement),
    label: "180°",
    category: "complement",
  });

  // Split complements (150° and 210°)
  const splitA = forceInGamut({ ...oklch, h: (oklch.h + 150) % 360 });
  suggestions.push({
    hex: oklchToHex(splitA),
    label: "150°",
    category: "complement",
  });

  const splitB = forceInGamut({ ...oklch, h: (oklch.h + 210) % 360 });
  suggestions.push({
    hex: oklchToHex(splitB),
    label: "210°",
    category: "complement",
  });

  return suggestions;
}

/**
 * Get a flat list of all suggestions
 */
export function getAllSuggestions(color: Color): ColorSuggestion[] {
  return generateSuggestions(color).flatMap((group) => group.suggestions);
}

/**
 * Category labels for display
 */
export const categoryLabels: Record<SuggestionCategory, string> = {
  lighter: "Lighter",
  darker: "Darker",
  saturated: "More Vibrant",
  muted: "More Muted",
  hue: "Shift Hue",
  complement: "Complementary",
};

/**
 * Category icons (as SVG path data)
 */
export const categoryIcons: Record<SuggestionCategory, string> = {
  lighter: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41",
  darker: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  saturated: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  muted: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
  hue: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M2 12h20",
  complement: "M12 2v20M2 12h20",
};
