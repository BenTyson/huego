// Palette import utilities for HueGo
// Supports multiple input formats with auto-detection

import { parseColor, createColor } from "./colors";
import type { Color } from "./types";

export type ImportFormat = "hex" | "css-vars" | "tailwind" | "json" | "unknown";

export interface ImportResult {
  success: boolean;
  colors: Color[];
  format: ImportFormat;
  error?: string;
}

/**
 * Auto-detect the format of input text
 */
export function detectFormat(input: string): ImportFormat {
  const trimmed = input.trim();

  // Check for CSS variables
  if (trimmed.includes("--") && trimmed.includes(":")) {
    return "css-vars";
  }

  // Check for Tailwind config (theme.extend.colors or colors object)
  if (
    trimmed.includes("colors:") ||
    trimmed.includes("extend:") ||
    trimmed.includes("theme:")
  ) {
    return "tailwind";
  }

  // Check for JSON
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    return "json";
  }

  // Default to hex (comma/space/newline separated hex codes)
  if (/#?[a-f\d]{6}/i.test(trimmed)) {
    return "hex";
  }

  return "unknown";
}

/**
 * Extract hex colors from a string
 */
function extractHexColors(input: string): string[] {
  const hexPattern = /#?([a-f\d]{6})\b/gi;
  const matches = input.match(hexPattern) || [];
  return matches.map((hex) =>
    hex.startsWith("#") ? hex.toUpperCase() : `#${hex.toUpperCase()}`
  );
}

/**
 * Parse hex colors from comma/space/newline separated string
 */
function parseHexInput(input: string): Color[] {
  const hexCodes = extractHexColors(input);
  return hexCodes.slice(0, 10).map((hex) => createColor(hex));
}

/**
 * Parse CSS variables
 * Supports:
 * --color-primary: #FF5733;
 * --primary: #FF5733;
 * :root { --color-1: #FF5733; }
 */
function parseCSSVars(input: string): Color[] {
  const colors: Color[] = [];

  // Match CSS custom properties with hex values
  const varPattern = /--[\w-]+:\s*(#[a-f\d]{6})/gi;
  let match;

  while ((match = varPattern.exec(input)) !== null) {
    const hex = match[1].toUpperCase();
    colors.push(createColor(hex));
  }

  return colors.slice(0, 10);
}

/**
 * Parse Tailwind config colors
 * Supports:
 * colors: { primary: '#FF5733', ... }
 * theme: { extend: { colors: { ... } } }
 */
function parseTailwindConfig(input: string): Color[] {
  const colors: Color[] = [];

  // Extract hex values from Tailwind-style config
  // Match patterns like: primary: '#FF5733' or "primary": "#FF5733"
  const colorPattern = /['"]?[\w-]+['"]?\s*:\s*['"]?(#[a-f\d]{6})['"]?/gi;
  let match;

  while ((match = colorPattern.exec(input)) !== null) {
    const hex = match[1].toUpperCase();
    colors.push(createColor(hex));
  }

  return colors.slice(0, 10);
}

/**
 * Parse JSON format
 * Supports:
 * ["#FF5733", "#33FF57", ...]
 * {"colors": ["#FF5733", ...]}
 * {"colors": [{"hex": "#FF5733"}, ...]}
 * HueGo JSON export format
 */
function parseJSONInput(input: string): Color[] {
  try {
    const data = JSON.parse(input);

    // Array of hex strings
    if (Array.isArray(data)) {
      if (typeof data[0] === "string") {
        return data
          .filter((item): item is string => typeof item === "string")
          .slice(0, 10)
          .map((hex) => {
            const parsed = parseColor(hex);
            return parsed ? createColor(parsed) : null;
          })
          .filter((c: Color | null): c is Color => c !== null);
      }

      // Array of color objects
      if (typeof data[0] === "object" && data[0].hex) {
        return data
          .slice(0, 10)
          .map((item: { hex?: string }) => {
            if (item.hex) {
              const parsed = parseColor(item.hex);
              return parsed ? createColor(parsed) : null;
            }
            return null;
          })
          .filter((c: Color | null): c is Color => c !== null);
      }
    }

    // Object with colors array (HueGo format)
    if (data.colors && Array.isArray(data.colors)) {
      return data.colors
        .slice(0, 10)
        .map((item: { hex?: string } | string) => {
          const hex = typeof item === "string" ? item : item.hex;
          if (hex) {
            const parsed = parseColor(hex);
            return parsed ? createColor(parsed) : null;
          }
          return null;
        })
        .filter((c: Color | null): c is Color => c !== null);
    }

    // Object with named colors
    if (typeof data === "object" && !Array.isArray(data)) {
      const colors: Color[] = [];
      for (const value of Object.values(data)) {
        if (typeof value === "string") {
          const parsed = parseColor(value);
          if (parsed) {
            colors.push(createColor(parsed));
          }
        }
        if (colors.length >= 10) break;
      }
      return colors;
    }

    return [];
  } catch {
    return [];
  }
}

/**
 * Main import function - auto-detects format and parses
 */
export function importPalette(input: string): ImportResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      success: false,
      colors: [],
      format: "unknown",
      error: "No input provided",
    };
  }

  const format = detectFormat(trimmed);
  let colors: Color[] = [];

  switch (format) {
    case "css-vars":
      colors = parseCSSVars(trimmed);
      break;
    case "tailwind":
      colors = parseTailwindConfig(trimmed);
      break;
    case "json":
      colors = parseJSONInput(trimmed);
      break;
    case "hex":
      colors = parseHexInput(trimmed);
      break;
    default:
      // Try to extract any hex colors as fallback
      colors = parseHexInput(trimmed);
  }

  if (colors.length === 0) {
    return {
      success: false,
      colors: [],
      format,
      error: "No valid colors found in input",
    };
  }

  // Pad to 5 colors if less
  while (colors.length < 5) {
    // Duplicate colors to fill gaps
    colors.push(colors[colors.length % colors.length]);
  }

  // Trim to 5 colors
  colors = colors.slice(0, 5);

  return {
    success: true,
    colors,
    format,
  };
}

/**
 * Format labels for display
 */
export const formatLabels: Record<ImportFormat, string> = {
  hex: "Hex Codes",
  "css-vars": "CSS Variables",
  tailwind: "Tailwind Config",
  json: "JSON",
  unknown: "Unknown",
};
