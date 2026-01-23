// Color psychology and cultural meanings data
// Based on color theory and cross-cultural research

export interface ColorPsychology {
  hueRange: [number, number]; // Hue range in degrees (0-360)
  name: string;
  meaning: string;
  emotions: string[];
  useCases: string[];
  industries: string[];
  cultures: {
    western: string;
    eastern: string;
    general: string;
  };
  positiveTraits: string[];
  negativeTraits: string[];
}

// Saturation-based modifiers
export interface SaturationEffect {
  level: "low" | "medium" | "high";
  range: [number, number]; // 0-100 saturation
  modifier: string;
  effect: string;
}

// Lightness-based modifiers
export interface LightnessEffect {
  level: "dark" | "medium" | "light" | "pastel";
  range: [number, number]; // 0-100 lightness
  modifier: string;
  effect: string;
}

export const saturationEffects: SaturationEffect[] = [
  {
    level: "low",
    range: [0, 25],
    modifier: "Muted",
    effect: "Sophisticated, subtle, calming, less attention-grabbing",
  },
  {
    level: "medium",
    range: [25, 60],
    modifier: "Balanced",
    effect: "Natural, approachable, versatile",
  },
  {
    level: "high",
    range: [60, 100],
    modifier: "Vibrant",
    effect: "Energetic, attention-grabbing, bold, youthful",
  },
];

export const lightnessEffects: LightnessEffect[] = [
  {
    level: "dark",
    range: [0, 30],
    modifier: "Deep",
    effect: "Luxurious, serious, dramatic, powerful",
  },
  {
    level: "medium",
    range: [30, 60],
    modifier: "Rich",
    effect: "Balanced, professional, trustworthy",
  },
  {
    level: "light",
    range: [60, 85],
    modifier: "Soft",
    effect: "Friendly, approachable, gentle",
  },
  {
    level: "pastel",
    range: [85, 100],
    modifier: "Pale",
    effect: "Delicate, feminine, calming, minimal",
  },
];

export const colorPsychologyData: ColorPsychology[] = [
  {
    hueRange: [0, 15],
    name: "Red",
    meaning: "Energy, passion, urgency, and action",
    emotions: ["Excitement", "Love", "Anger", "Urgency", "Power"],
    useCases: ["Call-to-action buttons", "Sale announcements", "Food branding", "Sports", "Entertainment"],
    industries: ["Food & Beverage", "Entertainment", "Sports", "Automotive", "Retail"],
    cultures: {
      western: "Love, passion, danger, excitement",
      eastern: "Good fortune, celebration, prosperity (especially in China)",
      general: "Universal attention-grabber, increases heart rate",
    },
    positiveTraits: ["Energetic", "Passionate", "Confident", "Bold"],
    negativeTraits: ["Aggressive", "Warning", "Danger", "Anger"],
  },
  {
    hueRange: [15, 45],
    name: "Orange",
    meaning: "Creativity, enthusiasm, and friendliness",
    emotions: ["Warmth", "Fun", "Confidence", "Friendliness", "Adventure"],
    useCases: ["Creative agencies", "Food brands", "Children's products", "Fitness", "E-commerce CTAs"],
    industries: ["Food & Beverage", "Entertainment", "Sports", "Technology", "Retail"],
    cultures: {
      western: "Creativity, autumn, Halloween, affordability",
      eastern: "Spiritual significance in Buddhism, courage",
      general: "Approachable and energetic without red's intensity",
    },
    positiveTraits: ["Friendly", "Creative", "Adventurous", "Optimistic"],
    negativeTraits: ["Cheap", "Immature", "Frivolous"],
  },
  {
    hueRange: [45, 70],
    name: "Yellow",
    meaning: "Happiness, optimism, and attention",
    emotions: ["Joy", "Optimism", "Clarity", "Warmth", "Caution"],
    useCases: ["Warning signs", "Children's brands", "Highlighting", "Food", "Attention-grabbing"],
    industries: ["Food & Beverage", "Children's Products", "Construction", "Transportation", "Retail"],
    cultures: {
      western: "Happiness, caution, cowardice",
      eastern: "Royalty, sacred (Buddhism), earth element",
      general: "Most visible color, mentally stimulating",
    },
    positiveTraits: ["Cheerful", "Stimulating", "Clear", "Energetic"],
    negativeTraits: ["Anxiety", "Caution", "Cowardice"],
  },
  {
    hueRange: [70, 150],
    name: "Green",
    meaning: "Nature, growth, harmony, and health",
    emotions: ["Balance", "Growth", "Freshness", "Tranquility", "Health"],
    useCases: ["Environmental brands", "Health & wellness", "Finance", "Organic products", "Success states"],
    industries: ["Health & Wellness", "Finance", "Environment", "Organic Food", "Technology"],
    cultures: {
      western: "Nature, money, envy, luck (Ireland)",
      eastern: "Eternity, fertility, prosperity",
      general: "Easiest color for eyes, associated with nature",
    },
    positiveTraits: ["Natural", "Balanced", "Refreshing", "Prosperous"],
    negativeTraits: ["Envy", "Boredom", "Inexperience"],
  },
  {
    hueRange: [150, 200],
    name: "Cyan/Teal",
    meaning: "Communication, clarity, and calm",
    emotions: ["Clarity", "Calm", "Trust", "Professionalism", "Innovation"],
    useCases: ["Healthcare", "Technology", "Communication", "Spas", "Corporate"],
    industries: ["Healthcare", "Technology", "Communications", "Travel", "Corporate"],
    cultures: {
      western: "Clean, professional, medical",
      eastern: "Healing, immortality",
      general: "Bridges blue's trust with green's freshness",
    },
    positiveTraits: ["Clear", "Trustworthy", "Refreshing", "Modern"],
    negativeTraits: ["Cold", "Clinical", "Distant"],
  },
  {
    hueRange: [200, 260],
    name: "Blue",
    meaning: "Trust, stability, professionalism, and calm",
    emotions: ["Trust", "Calm", "Loyalty", "Security", "Professionalism"],
    useCases: ["Corporate branding", "Finance", "Technology", "Healthcare", "Social media"],
    industries: ["Finance", "Technology", "Healthcare", "Corporate", "Social Media"],
    cultures: {
      western: "Trust, sadness, corporate, masculine",
      eastern: "Immortality, healing, relaxation",
      general: "World's most popular favorite color",
    },
    positiveTraits: ["Trustworthy", "Dependable", "Calm", "Professional"],
    negativeTraits: ["Sadness", "Cold", "Conservative", "Predictable"],
  },
  {
    hueRange: [260, 290],
    name: "Purple/Violet",
    meaning: "Luxury, creativity, wisdom, and spirituality",
    emotions: ["Luxury", "Creativity", "Mystery", "Spirituality", "Royalty"],
    useCases: ["Luxury brands", "Beauty", "Spiritual services", "Creative agencies", "Premium products"],
    industries: ["Beauty", "Luxury Goods", "Creative Industries", "Spirituality", "Technology"],
    cultures: {
      western: "Royalty, luxury, spirituality, creativity",
      eastern: "Wealth, privilege, spirituality",
      general: "Rare in nature, historically expensive to produce",
    },
    positiveTraits: ["Creative", "Luxurious", "Wise", "Imaginative"],
    negativeTraits: ["Arrogant", "Decadent", "Mysterious"],
  },
  {
    hueRange: [290, 330],
    name: "Magenta/Pink",
    meaning: "Femininity, romance, playfulness, and compassion",
    emotions: ["Romance", "Nurturing", "Compassion", "Playfulness", "Youth"],
    useCases: ["Beauty products", "Fashion", "Children's brands", "Romance", "Confectionery"],
    industries: ["Beauty", "Fashion", "Children's Products", "Confectionery", "Entertainment"],
    cultures: {
      western: "Femininity, romance, sweetness",
      eastern: "Trust, happiness (Japan)",
      general: "Calming effect, reduces aggression",
    },
    positiveTraits: ["Nurturing", "Romantic", "Gentle", "Playful"],
    negativeTraits: ["Immature", "Too feminine", "Frivolous"],
  },
  {
    hueRange: [330, 360],
    name: "Rose/Red-Pink",
    meaning: "Love, warmth, elegance, and sophistication",
    emotions: ["Love", "Warmth", "Elegance", "Tenderness", "Appreciation"],
    useCases: ["Luxury brands", "Beauty", "Wedding services", "Premium products", "Hospitality"],
    industries: ["Beauty", "Luxury Goods", "Wedding", "Hospitality", "Fashion"],
    cultures: {
      western: "Romance, elegance, appreciation",
      eastern: "Love, purity, new beginnings",
      general: "Softer alternative to red, universally appealing",
    },
    positiveTraits: ["Elegant", "Warm", "Sophisticated", "Tender"],
    negativeTraits: ["Weak", "Overly romantic"],
  },
];

// Special categories for neutral colors
export interface NeutralPsychology {
  type: "achromatic" | "near-neutral";
  saturationMax: number;
  lightnessRanges: {
    range: [number, number];
    name: string;
    meaning: string;
    emotions: string[];
    useCases: string[];
  }[];
}

export const neutralPsychology: NeutralPsychology = {
  type: "achromatic",
  saturationMax: 10, // Below this saturation, color is considered neutral
  lightnessRanges: [
    {
      range: [0, 15],
      name: "Black",
      meaning: "Power, elegance, sophistication, and mystery",
      emotions: ["Power", "Elegance", "Mystery", "Authority", "Formality"],
      useCases: ["Luxury brands", "Fashion", "Typography", "Tech", "Minimalist design"],
    },
    {
      range: [15, 40],
      name: "Dark Gray",
      meaning: "Professionalism, maturity, and stability",
      emotions: ["Serious", "Professional", "Mature", "Sophisticated"],
      useCases: ["Corporate design", "Backgrounds", "Text", "Professional services"],
    },
    {
      range: [40, 65],
      name: "Gray",
      meaning: "Neutrality, balance, and timelessness",
      emotions: ["Neutral", "Balanced", "Calm", "Timeless"],
      useCases: ["Backgrounds", "Borders", "Supporting elements", "Professional design"],
    },
    {
      range: [65, 90],
      name: "Light Gray",
      meaning: "Subtlety, cleanliness, and minimalism",
      emotions: ["Clean", "Subtle", "Modern", "Minimal"],
      useCases: ["Backgrounds", "Cards", "Dividers", "UI elements"],
    },
    {
      range: [90, 100],
      name: "White",
      meaning: "Purity, cleanliness, simplicity, and space",
      emotions: ["Pure", "Clean", "Simple", "Fresh", "Innocent"],
      useCases: ["Backgrounds", "Negative space", "Healthcare", "Minimalist design"],
    },
  ],
};

// Helper function to get psychology for a given hue
export function getColorPsychology(hue: number): ColorPsychology {
  // Normalize hue to 0-360
  const normalizedHue = ((hue % 360) + 360) % 360;

  const psychology = colorPsychologyData.find(
    (p) => normalizedHue >= p.hueRange[0] && normalizedHue < p.hueRange[1]
  );

  // Default to red if no match (shouldn't happen with proper ranges)
  return psychology || colorPsychologyData[0];
}

// Helper function to get saturation effect
export function getSaturationEffect(saturation: number): SaturationEffect {
  const effect = saturationEffects.find(
    (e) => saturation >= e.range[0] && saturation <= e.range[1]
  );
  return effect || saturationEffects[1]; // Default to medium
}

// Helper function to get lightness effect
export function getLightnessEffect(lightness: number): LightnessEffect {
  const effect = lightnessEffects.find(
    (e) => lightness >= e.range[0] && lightness <= e.range[1]
  );
  return effect || lightnessEffects[1]; // Default to medium
}

// Check if a color is neutral (achromatic)
export function isNeutralColor(saturation: number): boolean {
  return saturation <= neutralPsychology.saturationMax;
}

// Get neutral color info
export function getNeutralInfo(lightness: number) {
  const info = neutralPsychology.lightnessRanges.find(
    (r) => lightness >= r.range[0] && lightness <= r.range[1]
  );
  return info || neutralPsychology.lightnessRanges[2]; // Default to gray
}

// Get comprehensive color analysis
export interface ColorAnalysis {
  baseColor: ColorPsychology | null;
  neutral: ReturnType<typeof getNeutralInfo> | null;
  saturation: SaturationEffect;
  lightness: LightnessEffect;
  isNeutral: boolean;
  summary: string;
}

export function analyzeColor(hue: number, saturation: number, lightness: number): ColorAnalysis {
  const isNeutral = isNeutralColor(saturation);
  const saturationEffect = getSaturationEffect(saturation);
  const lightnessEffect = getLightnessEffect(lightness);

  if (isNeutral) {
    const neutralInfo = getNeutralInfo(lightness);
    return {
      baseColor: null,
      neutral: neutralInfo,
      saturation: saturationEffect,
      lightness: lightnessEffect,
      isNeutral: true,
      summary: `${neutralInfo.name} - ${neutralInfo.meaning}`,
    };
  }

  const baseColor = getColorPsychology(hue);
  const summary = `${lightnessEffect.modifier} ${saturationEffect.modifier.toLowerCase()} ${baseColor.name.toLowerCase()} - ${baseColor.meaning}`;

  return {
    baseColor,
    neutral: null,
    saturation: saturationEffect,
    lightness: lightnessEffect,
    isNeutral: false,
    summary,
  };
}
