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

export type Mode = "immersive" | "context" | "mood" | "playground";

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
export type ExportFormat = "css" | "scss" | "tailwind" | "json" | "array" | "svg" | "png";

// Free vs Premium export formats
export const FREE_EXPORT_FORMATS: ExportFormat[] = ["css", "json", "array"];
export const PREMIUM_EXPORT_FORMATS: ExportFormat[] = ["scss", "tailwind", "svg", "png"];
export const ALL_EXPORT_FORMATS: ExportFormat[] = [...FREE_EXPORT_FORMATS, ...PREMIUM_EXPORT_FORMATS];

// Feature limits
export const FREE_SAVED_PALETTES_LIMIT = 10;
export const PREMIUM_SAVED_PALETTES_LIMIT = Infinity;
