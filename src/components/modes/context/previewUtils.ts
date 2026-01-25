// Preview utility functions for Context mode
import type { Color } from "@/lib/types";
import type { PreviewTheme } from "./PreviewTypeSelector";
import { generateShadeScale } from "@/lib/shade-scale";

export interface PreviewColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  surfaceText: string;
  surfaceTextMuted: string;
  border: string;
}

/**
 * Get theme-aware colors for previews
 * In light mode: uses the palette colors as-is
 * In dark mode: uses darker shades of background/surface
 */
export function getPreviewColors(colors: Color[], theme: PreviewTheme): PreviewColors {
  const primary = colors[0]?.hex || "#6366f1";
  const secondary = colors[1]?.hex || "#8b5cf6";
  const accent = colors[2]?.hex || "#ec4899";

  // For dark mode, use darker shades of background and surface
  let background: string;
  let surface: string;

  if (theme === "dark") {
    // Generate dark versions using shade scale
    const bgScale = generateShadeScale(colors[3]?.hex || "#f8fafc");
    const surfaceScale = generateShadeScale(colors[4]?.hex || "#ffffff");
    background = bgScale[900];
    surface = surfaceScale[800];
  } else {
    background = colors[3]?.hex || "#f8fafc";
    surface = colors[4]?.hex || "#ffffff";
  }

  // Determine text colors based on theme
  const isLightBg = theme === "light";
  const textPrimary = isLightBg ? "#1f2937" : "#f9fafb";
  const textSecondary = isLightBg ? "#6b7280" : "#9ca3af";

  const isLightSurface = theme === "light";
  const surfaceText = isLightSurface ? "#1f2937" : "#f9fafb";
  const surfaceTextMuted = isLightSurface ? "#6b7280" : "#9ca3af";

  const border = isLightBg ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";

  return {
    primary,
    secondary,
    accent,
    background,
    surface,
    textPrimary,
    textSecondary,
    surfaceText,
    surfaceTextMuted,
    border,
  };
}

/**
 * Get opacity variants of a color
 */
export function withOpacity(hex: string, opacity: number): string {
  return `${hex}${Math.round(opacity * 255).toString(16).padStart(2, "0")}`;
}

/**
 * Create a subtle background tint from a color
 */
export function createTint(hex: string, amount: number = 0.1): string {
  return `${hex}${Math.round(amount * 255).toString(16).padStart(2, "0")}`;
}
