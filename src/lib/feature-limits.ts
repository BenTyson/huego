// Centralized feature limits for HueGo
// Decouples feature gating from store implementations

import type { ExportFormat, Mode, HarmonyType } from "./types";

// ============================================
// Palette Size Limits
// ============================================
export const MIN_PALETTE_SIZE = 2;
export const MAX_PALETTE_SIZE = 10;
export const DEFAULT_PALETTE_SIZE = 5;
export const FREE_MAX_PALETTE_SIZE = 7;
export const PREMIUM_MAX_PALETTE_SIZE = 10;

// ============================================
// Saved Palettes Limits
// ============================================
export const FREE_SAVED_PALETTES_LIMIT = 5;
export const PREMIUM_SAVED_PALETTES_LIMIT = Infinity;

// ============================================
// Saved Colors Limits
// ============================================
export const FREE_SAVED_COLORS_LIMIT = 10;
export const PREMIUM_SAVED_COLORS_LIMIT = Infinity;

// ============================================
// Community Publish Limits
// ============================================
export const FREE_PUBLISH_LIMIT = 3;
export const PREMIUM_PUBLISH_LIMIT = Infinity;

// ============================================
// Export Format Gating
// ============================================
export const FREE_EXPORT_FORMATS: ExportFormat[] = ["css", "json"];
export const PREMIUM_EXPORT_FORMATS: ExportFormat[] = [
  "array",
  "scss",
  "tailwind",
  "svg",
  "png",
  "pdf",
  "ase",
];
export const ALL_EXPORT_FORMATS: ExportFormat[] = [
  ...FREE_EXPORT_FORMATS,
  ...PREMIUM_EXPORT_FORMATS,
];

// ============================================
// Mode Gating
// ============================================
export const FREE_MODES: Mode[] = ["immersive", "playground", "explore"];
export const PREMIUM_MODES: Mode[] = ["context", "mood", "gradient"];
export const ALL_MODES: Mode[] = [...FREE_MODES, ...PREMIUM_MODES];

// ============================================
// Harmony Type Gating
// ============================================
export const FREE_HARMONIES: HarmonyType[] = [
  "random",
  "analogous",
  "complementary",
];
export const PREMIUM_HARMONIES: HarmonyType[] = [
  "triadic",
  "split-complementary",
  "monochromatic",
];
export const ALL_HARMONIES: HarmonyType[] = [
  ...FREE_HARMONIES,
  ...PREMIUM_HARMONIES,
];

// ============================================
// Accessibility Feature Gating
// ============================================
export const FREE_ACCESSIBILITY_FEATURES = [
  "contrast-aa",
  "protanopia",
  "deuteranopia",
];
export const PREMIUM_ACCESSIBILITY_FEATURES = [
  "contrast-aaa",
  "tritanopia",
  "achromatopsia",
];

// ============================================
// Image Extraction Limits
// ============================================
export const FREE_EXTRACTION_LIMIT = 3;
export const PREMIUM_EXTRACTION_LIMIT = Infinity;

// ============================================
// Helper Functions
// ============================================

/**
 * Check if an export format is available for free users
 */
export function isExportFormatFree(format: ExportFormat): boolean {
  return FREE_EXPORT_FORMATS.includes(format);
}

/**
 * Check if a mode is available for free users
 */
export function isModeFree(mode: Mode): boolean {
  return FREE_MODES.includes(mode);
}

/**
 * Check if a harmony type is available for free users
 */
export function isHarmonyFree(harmony: HarmonyType): boolean {
  return FREE_HARMONIES.includes(harmony);
}

/**
 * Get the maximum palette size for a user tier
 */
export function getMaxPaletteSize(isPremium: boolean): number {
  return isPremium ? PREMIUM_MAX_PALETTE_SIZE : FREE_MAX_PALETTE_SIZE;
}

/**
 * Get the saved palettes limit for a user tier
 */
export function getSavedPalettesLimit(isPremium: boolean): number {
  return isPremium ? PREMIUM_SAVED_PALETTES_LIMIT : FREE_SAVED_PALETTES_LIMIT;
}

/**
 * Get the publish limit for a user tier
 */
export function getPublishLimit(isPremium: boolean): number {
  return isPremium ? PREMIUM_PUBLISH_LIMIT : FREE_PUBLISH_LIMIT;
}

/**
 * Get the saved colors limit for a user tier
 */
export function getSavedColorsLimit(isPremium: boolean): number {
  return isPremium ? PREMIUM_SAVED_COLORS_LIMIT : FREE_SAVED_COLORS_LIMIT;
}

/**
 * Check if a feature is available based on premium status
 */
export function canUseFeature(
  feature: string,
  isPremium: boolean,
  freeFeatures: string[]
): boolean {
  return isPremium || freeFeatures.includes(feature);
}
