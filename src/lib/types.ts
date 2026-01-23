// Core color types for HueGo

export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface OKLCH {
  l: number; // 0-1 (lightness)
  c: number; // 0-0.4 (chroma)
  h: number; // 0-360 (hue)
}

export interface Color {
  hex: string;
  rgb: RGB;
  hsl: HSL;
  oklch: OKLCH;
  name: string;
  contrastColor: "white" | "black";
}

export type Mode = "immersive" | "context" | "mood" | "playground" | "gradient";

export interface Palette {
  id: string;
  colors: Color[];
  locked: boolean[];
  createdAt: number;
  mode: Mode;
}

export type HarmonyType =
  | "random"
  | "analogous"
  | "complementary"
  | "triadic"
  | "split-complementary"
  | "monochromatic";

// Subscription types for premium features
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing" | null;

export interface Subscription {
  isPremium: boolean;
  status: SubscriptionStatus;
  customerId: string | null;
  subscriptionId: string | null;
  currentPeriodEnd: number | null; // Unix timestamp
}

// Export format types
export type ExportFormat = "css" | "scss" | "tailwind" | "json" | "array" | "svg" | "png" | "pdf" | "ase";

// Free vs Premium export formats
export const FREE_EXPORT_FORMATS: ExportFormat[] = ["css", "json"];
export const PREMIUM_EXPORT_FORMATS: ExportFormat[] = ["array", "scss", "tailwind", "svg", "png", "pdf", "ase"];
export const ALL_EXPORT_FORMATS: ExportFormat[] = [...FREE_EXPORT_FORMATS, ...PREMIUM_EXPORT_FORMATS];

// Feature limits
export const FREE_SAVED_PALETTES_LIMIT = 5;
export const PREMIUM_SAVED_PALETTES_LIMIT = Infinity;

// Palette size limits
export const MIN_PALETTE_SIZE = 2;
export const MAX_PALETTE_SIZE = 10;
export const DEFAULT_PALETTE_SIZE = 5;
export const FREE_MAX_PALETTE_SIZE = 7;
export const PREMIUM_MAX_PALETTE_SIZE = 10;

// Free vs Premium modes
export const FREE_MODES: Mode[] = ["immersive", "playground"];
export const PREMIUM_MODES: Mode[] = ["context", "mood", "gradient"];

// Free vs Premium harmonies
export const FREE_HARMONIES: HarmonyType[] = ["random", "analogous", "complementary"];
export const PREMIUM_HARMONIES: HarmonyType[] = ["triadic", "split-complementary", "monochromatic"];
