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
  // EMOTIONS & FEELINGS (13 moods)
  // ============================================
  {
    id: "calm",
    name: "Still Waters",
    description: "Hushed blues",
    category: "emotions",
    hueRange: [180, 240],
    saturationRange: [0.04, 0.12],
    lightnessRange: [0.6, 0.85],
    hueVariance: 30,
  },
  {
    id: "bold",
    name: "Thunderclap",
    description: "Unapologetic saturation",
    category: "emotions",
    hueRange: [0, 360],
    saturationRange: [0.15, 0.25],
    lightnessRange: [0.4, 0.65],
    hueVariance: 120,
  },
  {
    id: "playful",
    name: "Confetti",
    description: "Candy-bright mischief",
    category: "emotions",
    hueRange: [280, 60],
    saturationRange: [0.12, 0.22],
    lightnessRange: [0.55, 0.75],
    hueVariance: 90,
  },
  {
    id: "energetic",
    name: "Livewire",
    description: "Crackling warmth",
    category: "emotions",
    hueRange: [0, 60],
    saturationRange: [0.15, 0.28],
    lightnessRange: [0.5, 0.7],
    hueVariance: 45,
  },
  {
    id: "serene",
    name: "Cloud Nine",
    description: "Whispered sky",
    category: "emotions",
    hueRange: [160, 220],
    saturationRange: [0.02, 0.08],
    lightnessRange: [0.65, 0.88],
    hueVariance: 25,
  },
  {
    id: "mysterious",
    name: "Velvet Mask",
    description: "Deep intrigue",
    category: "emotions",
    hueRange: [260, 320],
    saturationRange: [0.08, 0.18],
    lightnessRange: [0.2, 0.45],
    hueVariance: 35,
  },
  {
    id: "romantic",
    name: "Love Letter",
    description: "Rose-tinted tenderness",
    category: "emotions",
    hueRange: [320, 20],
    saturationRange: [0.1, 0.2],
    lightnessRange: [0.45, 0.7],
    hueVariance: 40,
  },
  {
    id: "melancholy",
    name: "Rainy Window",
    description: "Blue hour pensiveness",
    category: "emotions",
    hueRange: [200, 260],
    saturationRange: [0.04, 0.1],
    lightnessRange: [0.35, 0.55],
    hueVariance: 30,
  },
  {
    id: "joyful",
    name: "Sunburst",
    description: "Golden elation",
    category: "emotions",
    hueRange: [40, 80],
    saturationRange: [0.15, 0.25],
    lightnessRange: [0.6, 0.8],
    hueVariance: 35,
  },
  {
    id: "hopeful",
    name: "New Leaf",
    description: "Fresh-start greens",
    category: "emotions",
    hueRange: [80, 180],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.55, 0.75],
    hueVariance: 50,
  },
  {
    id: "nostalgic",
    name: "Faded Polaroid",
    description: "Bittersweet memory",
    category: "emotions",
    hueRange: [30, 60],
    saturationRange: [0.04, 0.12],
    lightnessRange: [0.45, 0.7],
    hueVariance: 35,
  },
  {
    id: "defiant",
    name: "Rebel Yell",
    description: "Fierce intensity",
    category: "emotions",
    hueRange: [340, 20],
    saturationRange: [0.15, 0.28],
    lightnessRange: [0.25, 0.5],
    hueVariance: 40,
  },
  {
    id: "dreamy",
    name: "Daydream",
    description: "Soft haze",
    category: "emotions",
    hueRange: [260, 340],
    saturationRange: [0.04, 0.1],
    lightnessRange: [0.65, 0.9],
    hueVariance: 50,
  },

  // ============================================
  // SEASONS & TIME (12 moods)
  // ============================================
  {
    id: "spring",
    name: "April Bloom",
    description: "Tender petals",
    category: "seasons",
    hueRange: [80, 160],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.6, 0.8],
    hueVariance: 45,
  },
  {
    id: "summer",
    name: "Soleil",
    description: "Sun-soaked warmth",
    category: "seasons",
    hueRange: [20, 60],
    saturationRange: [0.15, 0.25],
    lightnessRange: [0.6, 0.85],
    hueVariance: 40,
  },
  {
    id: "autumn",
    name: "Amber Harvest",
    description: "Cinnamon & rust",
    category: "seasons",
    hueRange: [10, 50],
    saturationRange: [0.12, 0.2],
    lightnessRange: [0.4, 0.65],
    hueVariance: 35,
  },
  {
    id: "winter",
    name: "Frosted Glass",
    description: "Crisp stillness",
    category: "seasons",
    hueRange: [180, 240],
    saturationRange: [0.03, 0.1],
    lightnessRange: [0.7, 0.9],
    hueVariance: 30,
  },
  {
    id: "sunrise",
    name: "First Light",
    description: "Dawn breaking",
    category: "seasons",
    hueRange: [10, 60],
    saturationRange: [0.12, 0.22],
    lightnessRange: [0.55, 0.8],
    hueVariance: 45,
  },
  {
    id: "sunset",
    name: "Burning Horizon",
    description: "Molten sky",
    category: "seasons",
    hueRange: [0, 40],
    saturationRange: [0.15, 0.25],
    lightnessRange: [0.4, 0.65],
    hueVariance: 40,
  },
  {
    id: "golden-hour",
    name: "Honey Hour",
    description: "Warm amber glow",
    category: "seasons",
    hueRange: [25, 55],
    saturationRange: [0.12, 0.2],
    lightnessRange: [0.5, 0.75],
    hueVariance: 25,
  },
  {
    id: "midnight",
    name: "Witching Hour",
    description: "Ink & shadow",
    category: "seasons",
    hueRange: [220, 280],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.15, 0.35],
    hueVariance: 35,
  },
  {
    id: "twilight",
    name: "Velvet Dusk",
    description: "Dusky violet",
    category: "seasons",
    hueRange: [240, 300],
    saturationRange: [0.08, 0.16],
    lightnessRange: [0.3, 0.55],
    hueVariance: 40,
  },
  {
    id: "overcast",
    name: "Soft Grey",
    description: "Muted whisper",
    category: "seasons",
    hueRange: [0, 360],
    saturationRange: [0.01, 0.04],
    lightnessRange: [0.5, 0.75],
    hueVariance: 60,
  },
  {
    id: "monsoon",
    name: "Monsoon",
    description: "Heavy downpour",
    category: "seasons",
    hueRange: [180, 220],
    saturationRange: [0.04, 0.12],
    lightnessRange: [0.3, 0.55],
    hueVariance: 30,
  },
  {
    id: "solstice",
    name: "Solstice",
    description: "Peak daylight",
    category: "seasons",
    hueRange: [30, 70],
    saturationRange: [0.1, 0.2],
    lightnessRange: [0.6, 0.85],
    hueVariance: 35,
  },

  // ============================================
  // NATURE & ELEMENTS (12 moods)
  // ============================================
  {
    id: "natural",
    name: "Wild Roots",
    description: "Organic earth",
    category: "nature",
    hueRange: [60, 150],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.4, 0.7],
    hueVariance: 45,
  },
  {
    id: "ocean",
    name: "Deep Blue",
    description: "Fathomless depths",
    category: "nature",
    hueRange: [180, 220],
    saturationRange: [0.08, 0.18],
    lightnessRange: [0.35, 0.7],
    hueVariance: 35,
  },
  {
    id: "forest",
    name: "Old Growth",
    description: "Canopy shadows",
    category: "nature",
    hueRange: [90, 150],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.3, 0.6],
    hueVariance: 40,
  },
  {
    id: "desert",
    name: "Sand Dunes",
    description: "Sun-bleached terrain",
    category: "nature",
    hueRange: [25, 50],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.5, 0.75],
    hueVariance: 25,
  },
  {
    id: "tropical",
    name: "Paradise Found",
    description: "Lush exotics",
    category: "nature",
    hueRange: [80, 180],
    saturationRange: [0.15, 0.25],
    lightnessRange: [0.45, 0.7],
    hueVariance: 60,
  },
  {
    id: "arctic",
    name: "Polar Silence",
    description: "Pristine ice",
    category: "nature",
    hueRange: [180, 220],
    saturationRange: [0.02, 0.08],
    lightnessRange: [0.75, 0.95],
    hueVariance: 25,
  },
  {
    id: "mountain",
    name: "Summit Haze",
    description: "Rugged peaks",
    category: "nature",
    hueRange: [200, 260],
    saturationRange: [0.04, 0.1],
    lightnessRange: [0.4, 0.65],
    hueVariance: 35,
  },
  {
    id: "meadow",
    name: "Wildflower",
    description: "Pastoral softness",
    category: "nature",
    hueRange: [70, 130],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.55, 0.8],
    hueVariance: 40,
  },
  {
    id: "volcanic",
    name: "Magma Core",
    description: "Molten intensity",
    category: "nature",
    hueRange: [0, 30],
    saturationRange: [0.12, 0.22],
    lightnessRange: [0.25, 0.55],
    hueVariance: 30,
  },
  {
    id: "coastal",
    name: "Sea Breeze",
    description: "Salt & spray",
    category: "nature",
    hueRange: [170, 210],
    saturationRange: [0.08, 0.16],
    lightnessRange: [0.55, 0.8],
    hueVariance: 35,
  },
  {
    id: "coral-reef",
    name: "Coral Reef",
    description: "Undersea color",
    category: "nature",
    hueRange: [160, 20],
    saturationRange: [0.1, 0.22],
    lightnessRange: [0.45, 0.7],
    hueVariance: 70,
  },
  {
    id: "aurora",
    name: "Borealis",
    description: "Polar light dance",
    category: "nature",
    hueRange: [100, 300],
    saturationRange: [0.12, 0.25],
    lightnessRange: [0.25, 0.65],
    hueVariance: 80,
  },

  // ============================================
  // AESTHETICS & ERAS (15 moods)
  // ============================================
  {
    id: "retro",
    name: "Vinyl Days",
    description: "Faded nostalgia",
    category: "aesthetics",
    hueRange: [20, 60],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.45, 0.7],
    hueVariance: 60,
  },
  {
    id: "futuristic",
    name: "Chrome Future",
    description: "Polished tomorrow",
    category: "aesthetics",
    hueRange: [240, 300],
    saturationRange: [0.1, 0.2],
    lightnessRange: [0.35, 0.65],
    hueVariance: 80,
  },
  {
    id: "minimal",
    name: "Bare Bones",
    description: "Stripped clean",
    category: "aesthetics",
    hueRange: [0, 360],
    saturationRange: [0.01, 0.06],
    lightnessRange: [0.5, 0.95],
    hueVariance: 20,
  },
  {
    id: "art-deco",
    name: "Gatsby Gold",
    description: "Geometric glamour",
    category: "aesthetics",
    hueRange: [40, 60],
    saturationRange: [0.12, 0.2],
    lightnessRange: [0.35, 0.65],
    hueVariance: 80,
  },
  {
    id: "cyberpunk",
    name: "Neon District",
    description: "Electric dystopia",
    category: "aesthetics",
    hueRange: [280, 340],
    saturationRange: [0.18, 0.3],
    lightnessRange: [0.25, 0.6],
    hueVariance: 60,
  },
  {
    id: "cottagecore",
    name: "Wildflower Hearth",
    description: "Rustic comfort",
    category: "aesthetics",
    hueRange: [30, 90],
    saturationRange: [0.06, 0.12],
    lightnessRange: [0.55, 0.8],
    hueVariance: 45,
  },
  {
    id: "y2k",
    name: "Pixel Pop",
    description: "Glossy digital",
    category: "aesthetics",
    hueRange: [280, 60],
    saturationRange: [0.18, 0.28],
    lightnessRange: [0.5, 0.75],
    hueVariance: 100,
  },
  {
    id: "scandinavian",
    name: "Hygge",
    description: "Nordic calm",
    category: "aesthetics",
    hueRange: [0, 360],
    saturationRange: [0.02, 0.08],
    lightnessRange: [0.7, 0.92],
    hueVariance: 30,
  },
  {
    id: "mid-century",
    name: "Atomic Age",
    description: "Retro modern",
    category: "aesthetics",
    hueRange: [30, 180],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.4, 0.65],
    hueVariance: 90,
  },
  {
    id: "bohemian",
    name: "Free Spirit",
    description: "Eclectic wander",
    category: "aesthetics",
    hueRange: [0, 60],
    saturationRange: [0.12, 0.2],
    lightnessRange: [0.4, 0.65],
    hueVariance: 120,
  },
  {
    id: "industrial",
    name: "Raw Steel",
    description: "Urban grit",
    category: "aesthetics",
    hueRange: [20, 50],
    saturationRange: [0.02, 0.08],
    lightnessRange: [0.25, 0.5],
    hueVariance: 25,
  },
  {
    id: "vaporwave",
    name: "Retrowave",
    description: "Digital dreamscape",
    category: "aesthetics",
    hueRange: [260, 340],
    saturationRange: [0.15, 0.25],
    lightnessRange: [0.45, 0.7],
    hueVariance: 50,
  },
  {
    id: "brutalist",
    name: "Brutalist",
    description: "Raw concrete",
    category: "aesthetics",
    hueRange: [20, 50],
    saturationRange: [0.01, 0.06],
    lightnessRange: [0.3, 0.6],
    hueVariance: 20,
  },
  {
    id: "art-nouveau",
    name: "Art Nouveau",
    description: "Organic elegance",
    category: "aesthetics",
    hueRange: [60, 130],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.4, 0.7],
    hueVariance: 50,
  },
  {
    id: "dark-academia",
    name: "Dark Academia",
    description: "Leather & library",
    category: "aesthetics",
    hueRange: [20, 50],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.2, 0.45],
    hueVariance: 30,
  },

  // ============================================
  // INDUSTRY & BRAND (12 moods)
  // ============================================
  {
    id: "professional",
    name: "Corner Office",
    description: "Boardroom trust",
    category: "industry",
    hueRange: [200, 260],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.35, 0.7],
    hueVariance: 40,
  },
  {
    id: "healthcare",
    name: "Healing Touch",
    description: "Clinical care",
    category: "industry",
    hueRange: [160, 200],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.55, 0.8],
    hueVariance: 30,
  },
  {
    id: "tech-startup",
    name: "Launch Day",
    description: "Innovation pulse",
    category: "industry",
    hueRange: [200, 280],
    saturationRange: [0.1, 0.2],
    lightnessRange: [0.4, 0.7],
    hueVariance: 50,
  },
  {
    id: "fashion",
    name: "Runway",
    description: "Bold style",
    category: "industry",
    hueRange: [320, 40],
    saturationRange: [0.12, 0.22],
    lightnessRange: [0.35, 0.65],
    hueVariance: 60,
  },
  {
    id: "food-beverage",
    name: "Bon Appetit",
    description: "Appetizing warmth",
    category: "industry",
    hueRange: [10, 60],
    saturationRange: [0.12, 0.2],
    lightnessRange: [0.45, 0.7],
    hueVariance: 45,
  },
  {
    id: "finance",
    name: "Vault",
    description: "Stable authority",
    category: "industry",
    hueRange: [200, 240],
    saturationRange: [0.06, 0.12],
    lightnessRange: [0.25, 0.55],
    hueVariance: 30,
  },
  {
    id: "creative-agency",
    name: "Studio Wild",
    description: "Expressive energy",
    category: "industry",
    hueRange: [0, 360],
    saturationRange: [0.15, 0.25],
    lightnessRange: [0.45, 0.7],
    hueVariance: 150,
  },
  {
    id: "wellness",
    name: "Inner Glow",
    description: "Calming greens",
    category: "industry",
    hueRange: [100, 180],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.55, 0.8],
    hueVariance: 45,
  },
  {
    id: "education",
    name: "Chalkboard",
    description: "Approachable smarts",
    category: "industry",
    hueRange: [200, 260],
    saturationRange: [0.08, 0.16],
    lightnessRange: [0.45, 0.7],
    hueVariance: 40,
  },
  {
    id: "luxury-brand",
    name: "Black Label",
    description: "Premium exclusivity",
    category: "industry",
    hueRange: [40, 60],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.3, 0.55],
    hueVariance: 60,
  },
  {
    id: "gaming",
    name: "Player One",
    description: "High-energy neon",
    category: "industry",
    hueRange: [260, 340],
    saturationRange: [0.15, 0.28],
    lightnessRange: [0.3, 0.6],
    hueVariance: 60,
  },
  {
    id: "architecture",
    name: "Blueprint",
    description: "Structural tone",
    category: "industry",
    hueRange: [200, 230],
    saturationRange: [0.03, 0.1],
    lightnessRange: [0.4, 0.7],
    hueVariance: 25,
  },

  // ============================================
  // CULTURAL & REGIONAL (12 moods)
  // ============================================
  {
    id: "japanese",
    name: "Wabi-Sabi",
    description: "Refined imperfection",
    category: "cultural",
    hueRange: [0, 40],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.5, 0.8],
    hueVariance: 40,
  },
  {
    id: "mediterranean",
    name: "Amalfi Sun",
    description: "Sun-drenched warmth",
    category: "cultural",
    hueRange: [20, 60],
    saturationRange: [0.12, 0.2],
    lightnessRange: [0.5, 0.75],
    hueVariance: 60,
  },
  {
    id: "nordic",
    name: "Fjord Mist",
    description: "Cool clarity",
    category: "cultural",
    hueRange: [200, 240],
    saturationRange: [0.02, 0.08],
    lightnessRange: [0.6, 0.85],
    hueVariance: 30,
  },
  {
    id: "moroccan",
    name: "Spice Market",
    description: "Rich warmth",
    category: "cultural",
    hueRange: [10, 50],
    saturationRange: [0.14, 0.22],
    lightnessRange: [0.35, 0.6],
    hueVariance: 50,
  },
  {
    id: "parisian",
    name: "Cafe Creme",
    description: "Elegant restraint",
    category: "cultural",
    hueRange: [330, 30],
    saturationRange: [0.04, 0.12],
    lightnessRange: [0.5, 0.75],
    hueVariance: 35,
  },
  {
    id: "tropical-paradise",
    name: "Island Drift",
    description: "Vibrant escape",
    category: "cultural",
    hueRange: [60, 180],
    saturationRange: [0.18, 0.28],
    lightnessRange: [0.5, 0.75],
    hueVariance: 70,
  },
  {
    id: "southwestern",
    name: "Red Rock",
    description: "Desert earth",
    category: "cultural",
    hueRange: [10, 50],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.4, 0.65],
    hueVariance: 45,
  },
  {
    id: "coastal-new-england",
    name: "Harbor Town",
    description: "Maritime classic",
    category: "cultural",
    hueRange: [200, 240],
    saturationRange: [0.1, 0.18],
    lightnessRange: [0.35, 0.65],
    hueVariance: 40,
  },
  {
    id: "brazilian",
    name: "Carnival",
    description: "Tropical rhythm",
    category: "cultural",
    hueRange: [60, 160],
    saturationRange: [0.15, 0.28],
    lightnessRange: [0.45, 0.7],
    hueVariance: 80,
  },
  {
    id: "indian",
    name: "Saffron & Silk",
    description: "Spice market warmth",
    category: "cultural",
    hueRange: [10, 50],
    saturationRange: [0.15, 0.25],
    lightnessRange: [0.4, 0.65],
    hueVariance: 50,
  },
  {
    id: "korean",
    name: "Seoul Glow",
    description: "Soft pastel clean",
    category: "cultural",
    hueRange: [300, 40],
    saturationRange: [0.06, 0.14],
    lightnessRange: [0.65, 0.85],
    hueVariance: 50,
  },
  {
    id: "african",
    name: "Savanna",
    description: "Earth & ochre",
    category: "cultural",
    hueRange: [20, 60],
    saturationRange: [0.1, 0.2],
    lightnessRange: [0.35, 0.6],
    hueVariance: 40,
  },

  // ============================================
  // ABSTRACT & CONCEPTUAL (8 moods)
  // ============================================
  {
    id: "urban",
    name: "Concrete & Neon",
    description: "City pulse",
    category: "abstract",
    hueRange: [0, 360],
    saturationRange: [0.02, 0.1],
    lightnessRange: [0.25, 0.6],
    hueVariance: 180,
  },
  {
    id: "luxurious",
    name: "Gilded Age",
    description: "Opulent depth",
    category: "abstract",
    hueRange: [260, 320],
    saturationRange: [0.08, 0.16],
    lightnessRange: [0.25, 0.55],
    hueVariance: 40,
  },
  {
    id: "warm",
    name: "Hearthglow",
    description: "Ember comfort",
    category: "abstract",
    hueRange: [15, 50],
    saturationRange: [0.08, 0.18],
    lightnessRange: [0.5, 0.75],
    hueVariance: 35,
  },
  {
    id: "cool",
    name: "Glacier Mint",
    description: "Crisp refreshment",
    category: "abstract",
    hueRange: [170, 250],
    saturationRange: [0.06, 0.16],
    lightnessRange: [0.5, 0.8],
    hueVariance: 50,
  },
  {
    id: "ethereal",
    name: "Gossamer",
    description: "Otherworldly glow",
    category: "abstract",
    hueRange: [240, 320],
    saturationRange: [0.04, 0.12],
    lightnessRange: [0.7, 0.92],
    hueVariance: 45,
  },
  {
    id: "chaotic",
    name: "Fever Dream",
    description: "Unhinged spectrum",
    category: "abstract",
    hueRange: [0, 360],
    saturationRange: [0.12, 0.3],
    lightnessRange: [0.3, 0.7],
    hueVariance: 180,
  },
  {
    id: "monochrome",
    name: "One Note",
    description: "Single-hue study",
    category: "abstract",
    hueRange: [0, 360],
    saturationRange: [0.02, 0.08],
    lightnessRange: [0.25, 0.8],
    hueVariance: 8,
  },
  {
    id: "vintage",
    name: "Patina",
    description: "Aged warmth",
    category: "abstract",
    hueRange: [20, 60],
    saturationRange: [0.04, 0.1],
    lightnessRange: [0.4, 0.65],
    hueVariance: 30,
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

/**
 * Apply refinement adjustments to existing colors (for slider changes)
 * This transforms colors in place rather than regenerating randomly
 */
export function applyRefinementsToColors(
  colors: Color[],
  refinements: RefinementValues
): Color[] {
  const { temperature, vibrancy, brightness } = refinements;

  return colors.map((color) => {
    // Shift hue based on temperature (warmer = toward orange, cooler = toward blue)
    const hueShift = temperature * 30;
    const newHue = normalizeHue(color.oklch.h + hueShift);

    // Adjust chroma based on vibrancy
    const chromaMultiplier = 1 + vibrancy * 0.5;
    const newChroma = Math.max(0.01, Math.min(0.35, color.oklch.c * chromaMultiplier));

    // Adjust lightness based on brightness
    const lightnessShift = brightness * 0.15;
    const newLightness = Math.max(0.15, Math.min(0.95, color.oklch.l + lightnessShift));

    const oklch: OKLCH = forceInGamut(
      clampOklch({
        l: newLightness,
        c: newChroma,
        h: newHue,
      })
    );

    return createColor(oklchToHex(oklch));
  });
}
