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

export interface UserPreferences {
  defaultMode: Mode;
  darkMode: boolean;
  recentPalettes: Palette[];
  savedPalettes: Palette[];
}

export interface ColorRole {
  id: string;
  name: string;
  description: string;
}

export const COLOR_ROLES: ColorRole[] = [
  { id: "primary", name: "Primary", description: "Main brand color" },
  { id: "secondary", name: "Secondary", description: "Supporting color" },
  { id: "accent", name: "Accent", description: "Highlight color" },
  { id: "background", name: "Background", description: "Page background" },
  { id: "surface", name: "Surface", description: "Card/component background" },
  { id: "text", name: "Text", description: "Primary text color" },
  { id: "textSecondary", name: "Text Secondary", description: "Muted text" },
];
