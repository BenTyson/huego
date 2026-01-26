// Mood to color mapping for HueGo
// Maps emotional/aesthetic moods to color generation parameters

import type { Color, OKLCH } from "./types";
import { oklchToHex, createColor, forceInGamut, clampOklch } from "./colors";
import { randomInRange, normalizeHue, randomHueInRange } from "./random";

export type MoodCategory =
  | "emotions"
  | "seasons"
  | "nature"
  | "aesthetics"
  | "industry"
  | "cultural"
  | "abstract";

export const MOOD_CATEGORIES: { id: MoodCategory; name: string; icon: string }[] = [
  { id: "emotions", name: "Emotions", icon: "heart" },
  { id: "seasons", name: "Seasons", icon: "sun" },
  { id: "nature", name: "Nature", icon: "leaf" },
  { id: "aesthetics", name: "Aesthetics", icon: "palette" },
  { id: "industry", name: "Industry", icon: "briefcase" },
  { id: "cultural", name: "Cultural", icon: "globe" },
  { id: "abstract", name: "Abstract", icon: "shapes" },
];

export interface MoodProfile {
  id: string;
  name: string;
  description: string;
  category: MoodCategory;
  hueRange: [number, number]; // [min, max] in degrees
  saturationRange: [number, number]; // [min, max] as OKLCH chroma (0-0.4)
  lightnessRange: [number, number]; // [min, max] as OKLCH lightness (0-1)
  hueVariance: number; // How much hue can vary within the palette
}

export const moodProfiles: MoodProfile[] = [
  // ============================================
  // EMOTIONS & FEELINGS (10 moods)
  // ============================================
  {
    id: "calm",
    name: "Calm",
    description: "Peaceful, serene",
    category: "emotions",
    hueRange: [180, 240],
    saturationRange: [0.04, 0.12],
    lightnessRange: [0.6, 0.85],
    hueVariance: 30,
  },
  {
    id: "bold",
    name: "Bold",
    description: "Strong, confident",
    category: "emotions",
    hueRange: [0, 360],
    saturationRange: [0.15, 0.25],
    lightnessRange: [0.4, 0.65],
    hueVariance: 120,
  },
  {
    id: "playful",
    name: "Playful",
    description: "Fun, whimsical",
    category: "emotions",
    hueRange: [280, 60],
    saturationRange: [0.12, 0.22],
    lightnessRange: [0.55, 0.75],
    hueVariance: 90,
  },
  {
    id: "energetic",
    name: "Energetic",
    description: "Dynamic, vibrant",
    category: "emotions",
    hueRange: [0, 60],
    saturationRange: [0.15, 0.28],
    lightnessRange: [0.5, 0.7],
    hueVariance: 45,
  },
  {
    id: "serene",
    name: "Serene",
    description: "Tranquil, meditative",
    category: "emotions",
    hueRange: [160, 220],
    saturationRange: [0.02, 0.08],
    lightnessRange: [0.65, 0.88],
    hueVariance: 25,
  },
  {
    id: "mysterious",
    name: "Mysterious",
    description: "Intriguing, dark",
    category: "emotions",
    hueRange: [260, 320],
    saturationRange: [0.08, 0.18],
    lightnessRange: [0.2, 0.45],
    hueVariance: 35,
  },
  {
    id: "romantic",
    name: "Romantic",
    description: "Passionate, tender",
    category: "emotions",
    hueRange: [320, 20],
    saturationRange: [0.1, 0.2],
    lightnessRange: [0.45, 0.7],
    hueVariance: 40,
  },
  {
    id: "melancholy",
    name: "Melancholy",
    description: "Wistful, reflective",
    category: "emotions",
    hueRange: [200, 260],
    saturationRange: [0.04, 0.1],
    lightnessRange: [0.35, 0.55],
    hueVariance: 30,
  },
  {
    id: "joyful",
    name: "Joyful",
    description: "Happy, uplifting",
    category: "emotions",
    hueRange: [40, 80],
    saturationRange: [0.15, 0.25],
    lightnessRange: [0.6, 0.8],
    hueVariance: 35,
  },
  {
    id: "hopeful",
    name: "Hopeful",
    description: "Optimistic, bright",
    category: "emotions",
    hueRange: [80, 180],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.55, 0.75],
    hueVariance: 50,
  },

  // ============================================
  // SEASONS & TIME (10 moods)
  // ============================================
  {
    id: "spring",
    name: "Spring",
    description: "Fresh, renewal",
    category: "seasons",
    hueRange: [80, 160],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.6, 0.8],
    hueVariance: 45,
  },
  {
    id: "summer",
    name: "Summer",
    description: "Bright, warm",
    category: "seasons",
    hueRange: [20, 60],
    saturationRange: [0.15, 0.25],
    lightnessRange: [0.6, 0.85],
    hueVariance: 40,
  },
  {
    id: "autumn",
    name: "Autumn",
    description: "Cozy, harvest",
    category: "seasons",
    hueRange: [10, 50],
    saturationRange: [0.12, 0.2],
    lightnessRange: [0.4, 0.65],
    hueVariance: 35,
  },
  {
    id: "winter",
    name: "Winter",
    description: "Crisp, cool",
    category: "seasons",
    hueRange: [180, 240],
    saturationRange: [0.03, 0.1],
    lightnessRange: [0.7, 0.9],
    hueVariance: 30,
  },
  {
    id: "sunrise",
    name: "Sunrise",
    description: "Dawn, awakening",
    category: "seasons",
    hueRange: [10, 60],
    saturationRange: [0.12, 0.22],
    lightnessRange: [0.55, 0.8],
    hueVariance: 45,
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Golden, dramatic",
    category: "seasons",
    hueRange: [0, 40],
    saturationRange: [0.15, 0.25],
    lightnessRange: [0.4, 0.65],
    hueVariance: 40,
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Warm glow",
    category: "seasons",
    hueRange: [25, 55],
    saturationRange: [0.12, 0.2],
    lightnessRange: [0.5, 0.75],
    hueVariance: 25,
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep, nocturnal",
    category: "seasons",
    hueRange: [220, 280],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.15, 0.35],
    hueVariance: 35,
  },
  {
    id: "twilight",
    name: "Twilight",
    description: "Dusky, transitional",
    category: "seasons",
    hueRange: [240, 300],
    saturationRange: [0.08, 0.16],
    lightnessRange: [0.3, 0.55],
    hueVariance: 40,
  },
  {
    id: "overcast",
    name: "Overcast",
    description: "Muted, soft",
    category: "seasons",
    hueRange: [0, 360],
    saturationRange: [0.01, 0.04],
    lightnessRange: [0.5, 0.75],
    hueVariance: 60,
  },

  // ============================================
  // NATURE & ELEMENTS (10 moods)
  // ============================================
  {
    id: "natural",
    name: "Natural",
    description: "Organic, earthy",
    category: "nature",
    hueRange: [60, 150],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.4, 0.7],
    hueVariance: 45,
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Aquatic, deep",
    category: "nature",
    hueRange: [180, 220],
    saturationRange: [0.08, 0.18],
    lightnessRange: [0.35, 0.7],
    hueVariance: 35,
  },
  {
    id: "forest",
    name: "Forest",
    description: "Woodland, lush",
    category: "nature",
    hueRange: [90, 150],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.3, 0.6],
    hueVariance: 40,
  },
  {
    id: "desert",
    name: "Desert",
    description: "Arid, sandy",
    category: "nature",
    hueRange: [25, 50],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.5, 0.75],
    hueVariance: 25,
  },
  {
    id: "tropical",
    name: "Tropical",
    description: "Exotic, vibrant",
    category: "nature",
    hueRange: [80, 180],
    saturationRange: [0.15, 0.25],
    lightnessRange: [0.45, 0.7],
    hueVariance: 60,
  },
  {
    id: "arctic",
    name: "Arctic",
    description: "Icy, pristine",
    category: "nature",
    hueRange: [180, 220],
    saturationRange: [0.02, 0.08],
    lightnessRange: [0.75, 0.95],
    hueVariance: 25,
  },
  {
    id: "mountain",
    name: "Mountain",
    description: "Rugged, majestic",
    category: "nature",
    hueRange: [200, 260],
    saturationRange: [0.04, 0.1],
    lightnessRange: [0.4, 0.65],
    hueVariance: 35,
  },
  {
    id: "meadow",
    name: "Meadow",
    description: "Pastoral, gentle",
    category: "nature",
    hueRange: [70, 130],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.55, 0.8],
    hueVariance: 40,
  },
  {
    id: "volcanic",
    name: "Volcanic",
    description: "Intense, molten",
    category: "nature",
    hueRange: [0, 30],
    saturationRange: [0.12, 0.22],
    lightnessRange: [0.25, 0.55],
    hueVariance: 30,
  },
  {
    id: "coastal",
    name: "Coastal",
    description: "Beach, breezy",
    category: "nature",
    hueRange: [170, 210],
    saturationRange: [0.08, 0.16],
    lightnessRange: [0.55, 0.8],
    hueVariance: 35,
  },

  // ============================================
  // AESTHETICS & ERAS (12 moods)
  // ============================================
  {
    id: "retro",
    name: "Retro",
    description: "Nostalgic, vintage",
    category: "aesthetics",
    hueRange: [20, 60],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.45, 0.7],
    hueVariance: 60,
  },
  {
    id: "futuristic",
    name: "Futuristic",
    description: "Sci-fi, tech",
    category: "aesthetics",
    hueRange: [240, 300],
    saturationRange: [0.1, 0.2],
    lightnessRange: [0.35, 0.65],
    hueVariance: 80,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, simple",
    category: "aesthetics",
    hueRange: [0, 360],
    saturationRange: [0.01, 0.06],
    lightnessRange: [0.5, 0.95],
    hueVariance: 20,
  },
  {
    id: "art-deco",
    name: "Art Deco",
    description: "Glamorous, geometric",
    category: "aesthetics",
    hueRange: [40, 60],
    saturationRange: [0.12, 0.2],
    lightnessRange: [0.35, 0.65],
    hueVariance: 80,
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Neon, dystopian",
    category: "aesthetics",
    hueRange: [280, 340],
    saturationRange: [0.18, 0.3],
    lightnessRange: [0.25, 0.6],
    hueVariance: 60,
  },
  {
    id: "cottagecore",
    name: "Cottagecore",
    description: "Rustic, cozy",
    category: "aesthetics",
    hueRange: [30, 90],
    saturationRange: [0.06, 0.12],
    lightnessRange: [0.55, 0.8],
    hueVariance: 45,
  },
  {
    id: "y2k",
    name: "Y2K",
    description: "Bright, futuristic",
    category: "aesthetics",
    hueRange: [280, 60],
    saturationRange: [0.18, 0.28],
    lightnessRange: [0.5, 0.75],
    hueVariance: 100,
  },
  {
    id: "scandinavian",
    name: "Scandinavian",
    description: "Nordic, hygge",
    category: "aesthetics",
    hueRange: [0, 360],
    saturationRange: [0.02, 0.08],
    lightnessRange: [0.7, 0.92],
    hueVariance: 30,
  },
  {
    id: "mid-century",
    name: "Mid-Century",
    description: "50s-60s modern",
    category: "aesthetics",
    hueRange: [30, 180],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.4, 0.65],
    hueVariance: 90,
  },
  {
    id: "bohemian",
    name: "Bohemian",
    description: "Eclectic, free",
    category: "aesthetics",
    hueRange: [0, 60],
    saturationRange: [0.12, 0.2],
    lightnessRange: [0.4, 0.65],
    hueVariance: 120,
  },
  {
    id: "industrial",
    name: "Industrial",
    description: "Raw, urban",
    category: "aesthetics",
    hueRange: [20, 50],
    saturationRange: [0.02, 0.08],
    lightnessRange: [0.25, 0.5],
    hueVariance: 25,
  },
  {
    id: "vaporwave",
    name: "Vaporwave",
    description: "Retro-digital",
    category: "aesthetics",
    hueRange: [260, 340],
    saturationRange: [0.15, 0.25],
    lightnessRange: [0.45, 0.7],
    hueVariance: 50,
  },

  // ============================================
  // INDUSTRY & BRAND (10 moods)
  // ============================================
  {
    id: "professional",
    name: "Professional",
    description: "Corporate, trustworthy",
    category: "industry",
    hueRange: [200, 260],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.35, 0.7],
    hueVariance: 40,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Clinical, caring",
    category: "industry",
    hueRange: [160, 200],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.55, 0.8],
    hueVariance: 30,
  },
  {
    id: "tech-startup",
    name: "Tech Startup",
    description: "Modern, innovative",
    category: "industry",
    hueRange: [200, 280],
    saturationRange: [0.1, 0.2],
    lightnessRange: [0.4, 0.7],
    hueVariance: 50,
  },
  {
    id: "fashion",
    name: "Fashion",
    description: "Stylish, bold",
    category: "industry",
    hueRange: [320, 40],
    saturationRange: [0.12, 0.22],
    lightnessRange: [0.35, 0.65],
    hueVariance: 60,
  },
  {
    id: "food-beverage",
    name: "Food & Beverage",
    description: "Appetizing, warm",
    category: "industry",
    hueRange: [10, 60],
    saturationRange: [0.12, 0.2],
    lightnessRange: [0.45, 0.7],
    hueVariance: 45,
  },
  {
    id: "finance",
    name: "Finance",
    description: "Stable, trustworthy",
    category: "industry",
    hueRange: [200, 240],
    saturationRange: [0.06, 0.12],
    lightnessRange: [0.25, 0.55],
    hueVariance: 30,
  },
  {
    id: "creative-agency",
    name: "Creative Agency",
    description: "Expressive, dynamic",
    category: "industry",
    hueRange: [0, 360],
    saturationRange: [0.15, 0.25],
    lightnessRange: [0.45, 0.7],
    hueVariance: 150,
  },
  {
    id: "wellness",
    name: "Wellness",
    description: "Calming, natural",
    category: "industry",
    hueRange: [100, 180],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.55, 0.8],
    hueVariance: 45,
  },
  {
    id: "education",
    name: "Education",
    description: "Approachable, smart",
    category: "industry",
    hueRange: [200, 260],
    saturationRange: [0.08, 0.16],
    lightnessRange: [0.45, 0.7],
    hueVariance: 40,
  },
  {
    id: "luxury-brand",
    name: "Luxury Brand",
    description: "Premium, exclusive",
    category: "industry",
    hueRange: [40, 60],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.3, 0.55],
    hueVariance: 60,
  },

  // ============================================
  // CULTURAL & REGIONAL (8 moods)
  // ============================================
  {
    id: "japanese",
    name: "Japanese",
    description: "Zen, refined",
    category: "cultural",
    hueRange: [0, 40],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.5, 0.8],
    hueVariance: 40,
  },
  {
    id: "mediterranean",
    name: "Mediterranean",
    description: "Sun-drenched, warm",
    category: "cultural",
    hueRange: [20, 60],
    saturationRange: [0.12, 0.2],
    lightnessRange: [0.5, 0.75],
    hueVariance: 60,
  },
  {
    id: "nordic",
    name: "Nordic",
    description: "Cool, minimal",
    category: "cultural",
    hueRange: [200, 240],
    saturationRange: [0.02, 0.08],
    lightnessRange: [0.6, 0.85],
    hueVariance: 30,
  },
  {
    id: "moroccan",
    name: "Moroccan",
    description: "Rich, spiced",
    category: "cultural",
    hueRange: [10, 50],
    saturationRange: [0.14, 0.22],
    lightnessRange: [0.35, 0.6],
    hueVariance: 50,
  },
  {
    id: "parisian",
    name: "Parisian",
    description: "Elegant, chic",
    category: "cultural",
    hueRange: [330, 30],
    saturationRange: [0.04, 0.12],
    lightnessRange: [0.5, 0.75],
    hueVariance: 35,
  },
  {
    id: "tropical-paradise",
    name: "Tropical Paradise",
    description: "Vibrant, exotic",
    category: "cultural",
    hueRange: [60, 180],
    saturationRange: [0.18, 0.28],
    lightnessRange: [0.5, 0.75],
    hueVariance: 70,
  },
  {
    id: "southwestern",
    name: "Southwestern",
    description: "Desert, earthy",
    category: "cultural",
    hueRange: [10, 50],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.4, 0.65],
    hueVariance: 45,
  },
  {
    id: "coastal-new-england",
    name: "Coastal New England",
    description: "Maritime, classic",
    category: "cultural",
    hueRange: [200, 240],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.35, 0.65],
    hueVariance: 40,
  },

  // ============================================
  // ABSTRACT & CONCEPTUAL (4 moods)
  // ============================================
  {
    id: "urban",
    name: "Urban",
    description: "City life, modern",
    category: "abstract",
    hueRange: [0, 360],
    saturationRange: [0.02, 0.1],
    lightnessRange: [0.25, 0.6],
    hueVariance: 180,
  },
  {
    id: "luxurious",
    name: "Luxurious",
    description: "Opulent, rich",
    category: "abstract",
    hueRange: [260, 320],
    saturationRange: [0.08, 0.16],
    lightnessRange: [0.25, 0.55],
    hueVariance: 40,
  },
  {
    id: "warm",
    name: "Warm",
    description: "Inviting, cozy",
    category: "abstract",
    hueRange: [15, 50],
    saturationRange: [0.08, 0.18],
    lightnessRange: [0.5, 0.75],
    hueVariance: 35,
  },
  {
    id: "cool",
    name: "Cool",
    description: "Refreshing, calm",
    category: "abstract",
    hueRange: [170, 250],
    saturationRange: [0.06, 0.16],
    lightnessRange: [0.5, 0.8],
    hueVariance: 50,
  },
];

// Helper to get moods by category
export function getMoodsByCategory(category: MoodCategory): MoodProfile[] {
  return moodProfiles.filter((mood) => mood.category === category);
}

// Helper to get all categories with their moods
export function getMoodsGroupedByCategory(): Map<MoodCategory, MoodProfile[]> {
  const grouped = new Map<MoodCategory, MoodProfile[]>();
  for (const category of MOOD_CATEGORIES) {
    grouped.set(category.id, getMoodsByCategory(category.id));
  }
  return grouped;
}

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
 * @deprecated Use getMoodsByCategory instead
 */
export function getMoodGrid(): MoodProfile[][] {
  return [
    moodProfiles.slice(0, 4),
    moodProfiles.slice(4, 8),
    moodProfiles.slice(8, 12),
  ];
}
