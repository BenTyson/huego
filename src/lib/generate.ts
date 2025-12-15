// Palette generation algorithms for HueGo
// Uses OKLCH for perceptually uniform color generation

import type { Color, HarmonyType, OKLCH } from "./types";
import {
  oklchToHex,
  createColor,
  forceInGamut,
  clampOklch,
} from "./colors";

// Default palette size
const PALETTE_SIZE = 5;

// ============================================
// Random number utilities
// ============================================

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomHue(): number {
  return Math.random() * 360;
}

// ============================================
// Core generation function
// ============================================

/**
 * Generate a palette of colors based on harmony type
 */
export function generatePalette(
  harmonyType: HarmonyType = "random",
  locked: (Color | null)[] = [],
  size: number = PALETTE_SIZE
): Color[] {
  const generators: Record<HarmonyType, () => Color[]> = {
    random: () => generateRandom(locked, size),
    analogous: () => generateAnalogous(locked, size),
    complementary: () => generateComplementary(locked, size),
    triadic: () => generateTriadic(locked, size),
    "split-complementary": () => generateSplitComplementary(locked, size),
    monochromatic: () => generateMonochromatic(locked, size),
  };

  return generators[harmonyType]();
}

// ============================================
// Random generation (with aesthetic constraints)
// ============================================

function generateRandom(locked: (Color | null)[], size: number): Color[] {
  const colors: Color[] = [];

  // Generate base hue if not locked
  const baseHue = locked[0]?.hsl.h ?? randomHue();

  for (let i = 0; i < size; i++) {
    // If this position is locked, keep the color
    if (locked[i]) {
      colors.push(locked[i]!);
      continue;
    }

    // Generate color with aesthetic constraints
    let oklch: OKLCH;

    if (i === 0) {
      // First color: random but vibrant
      oklch = {
        l: randomInRange(0.45, 0.7),
        c: randomInRange(0.1, 0.2),
        h: baseHue,
      };
    } else {
      // Subsequent colors: spread across hue wheel with varied lightness
      const hueShift = randomInRange(30, 330);
      const previousHue = colors[i - 1].oklch.h;

      oklch = {
        l: randomInRange(0.3, 0.85),
        c: randomInRange(0.05, 0.2),
        h: (previousHue + hueShift) % 360,
      };
    }

    oklch = forceInGamut(clampOklch(oklch));
    const hex = oklchToHex(oklch);
    colors.push(createColor(hex));
  }

  // Sort by lightness for visual balance
  return sortByLightness(colors, locked);
}

// ============================================
// Analogous (adjacent hues)
// ============================================

function generateAnalogous(locked: (Color | null)[], size: number): Color[] {
  const baseHue = locked.find((c) => c)?.hsl.h ?? randomHue();
  const spread = 30; // degrees between colors
  const colors: Color[] = [];

  for (let i = 0; i < size; i++) {
    if (locked[i]) {
      colors.push(locked[i]!);
      continue;
    }

    const hueOffset = (i - Math.floor(size / 2)) * spread;
    const oklch = forceInGamut(
      clampOklch({
        l: randomInRange(0.35, 0.8),
        c: randomInRange(0.08, 0.18),
        h: (baseHue + hueOffset + 360) % 360,
      })
    );

    colors.push(createColor(oklchToHex(oklch)));
  }

  return sortByLightness(colors, locked);
}

// ============================================
// Complementary (opposite hues)
// ============================================

function generateComplementary(
  locked: (Color | null)[],
  size: number
): Color[] {
  const baseHue = locked.find((c) => c)?.hsl.h ?? randomHue();
  const complementHue = (baseHue + 180) % 360;
  const colors: Color[] = [];

  for (let i = 0; i < size; i++) {
    if (locked[i]) {
      colors.push(locked[i]!);
      continue;
    }

    // Alternate between base and complement, with some variation
    const isComplement = i >= Math.ceil(size / 2);
    const targetHue = isComplement ? complementHue : baseHue;
    const hueVariation = randomInRange(-15, 15);

    const oklch = forceInGamut(
      clampOklch({
        l: randomInRange(0.35, 0.8),
        c: randomInRange(0.08, 0.18),
        h: (targetHue + hueVariation + 360) % 360,
      })
    );

    colors.push(createColor(oklchToHex(oklch)));
  }

  return sortByLightness(colors, locked);
}

// ============================================
// Triadic (evenly spaced, 120° apart)
// ============================================

function generateTriadic(locked: (Color | null)[], size: number): Color[] {
  const baseHue = locked.find((c) => c)?.hsl.h ?? randomHue();
  const hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
  const colors: Color[] = [];

  for (let i = 0; i < size; i++) {
    if (locked[i]) {
      colors.push(locked[i]!);
      continue;
    }

    const targetHue = hues[i % 3];
    const hueVariation = randomInRange(-10, 10);

    const oklch = forceInGamut(
      clampOklch({
        l: randomInRange(0.35, 0.8),
        c: randomInRange(0.08, 0.18),
        h: (targetHue + hueVariation + 360) % 360,
      })
    );

    colors.push(createColor(oklchToHex(oklch)));
  }

  return sortByLightness(colors, locked);
}

// ============================================
// Split-complementary
// ============================================

function generateSplitComplementary(
  locked: (Color | null)[],
  size: number
): Color[] {
  const baseHue = locked.find((c) => c)?.hsl.h ?? randomHue();
  // Base hue + two colors 150° and 210° away (30° from complement)
  const hues = [baseHue, (baseHue + 150) % 360, (baseHue + 210) % 360];
  const colors: Color[] = [];

  for (let i = 0; i < size; i++) {
    if (locked[i]) {
      colors.push(locked[i]!);
      continue;
    }

    const targetHue = hues[i % 3];
    const hueVariation = randomInRange(-10, 10);

    const oklch = forceInGamut(
      clampOklch({
        l: randomInRange(0.35, 0.8),
        c: randomInRange(0.08, 0.18),
        h: (targetHue + hueVariation + 360) % 360,
      })
    );

    colors.push(createColor(oklchToHex(oklch)));
  }

  return sortByLightness(colors, locked);
}

// ============================================
// Monochromatic (single hue, varied lightness/chroma)
// ============================================

function generateMonochromatic(
  locked: (Color | null)[],
  size: number
): Color[] {
  const baseHue = locked.find((c) => c)?.hsl.h ?? randomHue();
  const colors: Color[] = [];

  // Generate evenly spaced lightness values
  const lightnessSteps = Array.from(
    { length: size },
    (_, i) => 0.2 + (i * 0.6) / (size - 1)
  );

  for (let i = 0; i < size; i++) {
    if (locked[i]) {
      colors.push(locked[i]!);
      continue;
    }

    const oklch = forceInGamut(
      clampOklch({
        l: lightnessSteps[i],
        c: randomInRange(0.05, 0.15),
        h: baseHue + randomInRange(-5, 5),
      })
    );

    colors.push(createColor(oklchToHex(oklch)));
  }

  return colors; // Already sorted by lightness
}

// ============================================
// Utility functions
// ============================================

/**
 * Sort colors by lightness while preserving locked positions
 */
function sortByLightness(
  colors: Color[],
  locked: (Color | null)[]
): Color[] {
  // Get unlocked colors and their indices
  const unlockedIndices: number[] = [];
  const unlockedColors: Color[] = [];

  colors.forEach((color, i) => {
    if (!locked[i]) {
      unlockedIndices.push(i);
      unlockedColors.push(color);
    }
  });

  // Sort unlocked colors by lightness (dark to light)
  unlockedColors.sort((a, b) => a.oklch.l - b.oklch.l);

  // Reconstruct array with sorted unlocked colors
  const result = [...colors];
  unlockedIndices.forEach((originalIndex, sortedIndex) => {
    result[originalIndex] = unlockedColors[sortedIndex];
  });

  return result;
}

/**
 * Generate a single random color
 */
export function generateRandomColor(): Color {
  const oklch = forceInGamut(
    clampOklch({
      l: randomInRange(0.35, 0.75),
      c: randomInRange(0.08, 0.2),
      h: randomHue(),
    })
  );
  return createColor(oklchToHex(oklch));
}

/**
 * Adjust a color's lightness
 */
export function adjustLightness(color: Color, amount: number): Color {
  const oklch = forceInGamut(
    clampOklch({
      ...color.oklch,
      l: color.oklch.l + amount,
    })
  );
  return createColor(oklchToHex(oklch));
}

/**
 * Adjust a color's chroma (saturation)
 */
export function adjustChroma(color: Color, amount: number): Color {
  const oklch = forceInGamut(
    clampOklch({
      ...color.oklch,
      c: color.oklch.c + amount,
    })
  );
  return createColor(oklchToHex(oklch));
}

/**
 * Adjust a color's hue
 */
export function adjustHue(color: Color, degrees: number): Color {
  const oklch = forceInGamut(
    clampOklch({
      ...color.oklch,
      h: (color.oklch.h + degrees + 360) % 360,
    })
  );
  return createColor(oklchToHex(oklch));
}

/**
 * Generate unique ID for palettes
 */
export function generatePaletteId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
