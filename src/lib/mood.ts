// Mood to color mapping for HueGo
// Maps emotional/aesthetic moods to color generation parameters

import type { Color, OKLCH } from "./types";
import { oklchToHex, createColor, forceInGamut, clampOklch } from "./colors";

export interface MoodProfile {
  id: string;
  name: string;
  description: string;
  hueRange: [number, number]; // [min, max] in degrees
  saturationRange: [number, number]; // [min, max] as OKLCH chroma (0-0.4)
  lightnessRange: [number, number]; // [min, max] as OKLCH lightness (0-1)
  hueVariance: number; // How much hue can vary within the palette
}

export const moodProfiles: MoodProfile[] = [
  // Row 1
  {
    id: "calm",
    name: "Calm",
    description: "Peaceful, serene, tranquil",
    hueRange: [180, 240],
    saturationRange: [0.04, 0.12],
    lightnessRange: [0.6, 0.85],
    hueVariance: 30,
  },
  {
    id: "bold",
    name: "Bold",
    description: "Strong, confident, striking",
    hueRange: [0, 360],
    saturationRange: [0.15, 0.25],
    lightnessRange: [0.4, 0.65],
    hueVariance: 120,
  },
  {
    id: "playful",
    name: "Playful",
    description: "Fun, energetic, youthful",
    hueRange: [280, 60], // Wraps around (pink to yellow)
    saturationRange: [0.12, 0.22],
    lightnessRange: [0.55, 0.75],
    hueVariance: 90,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Corporate, trustworthy, refined",
    hueRange: [200, 260],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.35, 0.7],
    hueVariance: 40,
  },
  // Row 2
  {
    id: "warm",
    name: "Warm",
    description: "Cozy, inviting, comfortable",
    hueRange: [15, 50],
    saturationRange: [0.08, 0.18],
    lightnessRange: [0.5, 0.75],
    hueVariance: 35,
  },
  {
    id: "cool",
    name: "Cool",
    description: "Fresh, modern, crisp",
    hueRange: [170, 250],
    saturationRange: [0.06, 0.16],
    lightnessRange: [0.5, 0.8],
    hueVariance: 50,
  },
  {
    id: "retro",
    name: "Retro",
    description: "Vintage, nostalgic, classic",
    hueRange: [20, 60],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.45, 0.7],
    hueVariance: 60,
  },
  {
    id: "futuristic",
    name: "Futuristic",
    description: "Tech, innovative, cutting-edge",
    hueRange: [240, 300],
    saturationRange: [0.1, 0.2],
    lightnessRange: [0.35, 0.65],
    hueVariance: 80,
  },
  // Row 3
  {
    id: "natural",
    name: "Natural",
    description: "Earthy, organic, grounded",
    hueRange: [60, 150],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.4, 0.7],
    hueVariance: 45,
  },
  {
    id: "urban",
    name: "Urban",
    description: "Metropolitan, edgy, contemporary",
    hueRange: [0, 360],
    saturationRange: [0.02, 0.1],
    lightnessRange: [0.25, 0.6],
    hueVariance: 180,
  },
  {
    id: "luxurious",
    name: "Luxurious",
    description: "Premium, elegant, sophisticated",
    hueRange: [260, 320],
    saturationRange: [0.08, 0.16],
    lightnessRange: [0.25, 0.55],
    hueVariance: 40,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, simple, understated",
    hueRange: [0, 360],
    saturationRange: [0.01, 0.06],
    lightnessRange: [0.5, 0.95],
    hueVariance: 20,
  },
];

// Refinement slider types
export interface RefinementValues {
  temperature: number; // -1 (cooler) to 1 (warmer)
  vibrancy: number; // -1 (subtle) to 1 (vibrant)
  brightness: number; // -1 (dark) to 1 (light)
}

const defaultRefinements: RefinementValues = {
  temperature: 0,
  vibrancy: 0,
  brightness: 0,
};

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

function randomHueInRange(range: [number, number]): number {
  const [min, max] = range;
  if (min <= max) {
    return randomInRange(min, max);
  }
  // Wrapping case
  const rangeSize = (360 - min) + max;
  const r = Math.random() * rangeSize;
  return normalizeHue(min + r);
}

/**
 * Generate a palette based on mood profile and refinements
 */
export function generateMoodPalette(
  moodId: string,
  refinements: RefinementValues = defaultRefinements,
  size: number = 5
): Color[] {
  const profile = moodProfiles.find((m) => m.id === moodId);
  if (!profile) {
    throw new Error(`Unknown mood: ${moodId}`);
  }

  // Apply refinements to profile parameters
  const adjustedProfile = applyRefinements(profile, refinements);

  const colors: Color[] = [];
  const baseHue = randomHueInRange(adjustedProfile.hueRange);

  for (let i = 0; i < size; i++) {
    // Calculate hue with variance
    const hueOffset = (i - Math.floor(size / 2)) * (adjustedProfile.hueVariance / size);
    const hue = normalizeHue(baseHue + hueOffset);

    // Vary lightness across the palette
    const lightnessStep = (adjustedProfile.lightnessRange[1] - adjustedProfile.lightnessRange[0]) / (size - 1);
    const lightness = adjustedProfile.lightnessRange[0] + (i * lightnessStep);

    // Random saturation within range
    const saturation = randomInRange(
      adjustedProfile.saturationRange[0],
      adjustedProfile.saturationRange[1]
    );

    const oklch: OKLCH = forceInGamut(
      clampOklch({
        l: lightness,
        c: saturation,
        h: hue,
      })
    );

    colors.push(createColor(oklchToHex(oklch)));
  }

  // Sort by lightness
  return colors.sort((a, b) => a.oklch.l - b.oklch.l);
}

/**
 * Apply refinement sliders to a mood profile
 */
function applyRefinements(
  profile: MoodProfile,
  refinements: RefinementValues
): MoodProfile {
  const { temperature, vibrancy, brightness } = refinements;

  // Adjust hue range based on temperature
  // Warmer = shift toward red/orange, Cooler = shift toward blue
  const hueShift = temperature * 30;
  const adjustedHueRange: [number, number] = [
    normalizeHue(profile.hueRange[0] + hueShift),
    normalizeHue(profile.hueRange[1] + hueShift),
  ];

  // Adjust saturation based on vibrancy
  const saturationMultiplier = 1 + vibrancy * 0.5;
  const adjustedSaturationRange: [number, number] = [
    Math.max(0.01, profile.saturationRange[0] * saturationMultiplier),
    Math.min(0.35, profile.saturationRange[1] * saturationMultiplier),
  ];

  // Adjust lightness based on brightness
  const lightnessShift = brightness * 0.15;
  const adjustedLightnessRange: [number, number] = [
    Math.max(0.15, Math.min(0.85, profile.lightnessRange[0] + lightnessShift)),
    Math.max(0.2, Math.min(0.95, profile.lightnessRange[1] + lightnessShift)),
  ];

  return {
    ...profile,
    hueRange: adjustedHueRange,
    saturationRange: adjustedSaturationRange,
    lightnessRange: adjustedLightnessRange,
  };
}

/**
 * Get mood profiles organized in grid rows
 */
export function getMoodGrid(): MoodProfile[][] {
  return [
    moodProfiles.slice(0, 4),
    moodProfiles.slice(4, 8),
    moodProfiles.slice(8, 12),
  ];
}
