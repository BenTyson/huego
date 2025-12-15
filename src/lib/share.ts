// URL encoding/decoding for palette sharing

import type { Color } from "./types";
import { createColor } from "./colors";

/**
 * Encode palette colors to a URL-safe string
 * Format: HEX1-HEX2-HEX3-HEX4-HEX5 (without #)
 */
export function encodePalette(colors: Color[]): string {
  return colors.map((c) => c.hex.replace("#", "")).join("-");
}

/**
 * Decode URL string back to colors
 */
export function decodePalette(encoded: string): Color[] | null {
  try {
    const hexCodes = encoded.split("-");

    // Validate format
    if (hexCodes.length < 1 || hexCodes.length > 10) {
      return null;
    }

    // Validate each hex code
    const validHex = /^[a-fA-F0-9]{6}$/;
    if (!hexCodes.every((hex) => validHex.test(hex))) {
      return null;
    }

    return hexCodes.map((hex) => createColor(`#${hex}`));
  } catch {
    return null;
  }
}

/**
 * Generate a shareable URL for a palette
 */
export function generateShareUrl(colors: Color[]): string {
  const encoded = encodePalette(colors);
  // Use relative URL for flexibility
  return `/p/${encoded}`;
}

/**
 * Generate full share URL with domain
 */
export function getFullShareUrl(colors: Color[], baseUrl?: string): string {
  const path = generateShareUrl(colors);
  const base = baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${path}`;
}

/**
 * Copy share URL to clipboard
 */
export async function copyShareUrl(colors: Color[]): Promise<boolean> {
  try {
    const url = getFullShareUrl(colors);
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
