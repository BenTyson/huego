// Mosaic grid generation — 4,096 shorthand hex colors arranged in a 64x64 grid
// Sorted by hue (horizontal) x lightness (vertical)

import { rgbToOklch } from "./colors";
import type { RGB, OKLCH } from "./types";
import type { MosaicColorEntry } from "./mosaic-types";
import { MOSAIC_GRID_SIZE } from "./mosaic-types";

interface ColorWithOklch {
  hex3: string;
  hex6: string;
  rgb: RGB;
  oklch: OKLCH;
}

/**
 * Expand a single hex nibble to a full byte: 0xF -> 0xFF, 0xA -> 0xAA
 */
function expandNibble(n: number): number {
  return n * 17; // 0x0 -> 0, 0xF -> 255
}

/**
 * Generate all 4,096 12-bit colors (#RGB shorthand)
 */
function generateAll12BitColors(): ColorWithOklch[] {
  const colors: ColorWithOklch[] = [];

  for (let r = 0; r < 16; r++) {
    for (let g = 0; g < 16; g++) {
      for (let b = 0; b < 16; b++) {
        const hex3 = r.toString(16) + g.toString(16) + b.toString(16);
        const rr = expandNibble(r);
        const gg = expandNibble(g);
        const bb = expandNibble(b);
        const hex6 =
          "#" +
          rr.toString(16).padStart(2, "0").toUpperCase() +
          gg.toString(16).padStart(2, "0").toUpperCase() +
          bb.toString(16).padStart(2, "0").toUpperCase();
        const rgb: RGB = { r: rr, g: gg, b: bb };
        const oklch = rgbToOklch(rgb);

        colors.push({ hex3, hex6, rgb, oklch });
      }
    }
  }

  return colors;
}

/**
 * Build the 64x64 mosaic grid sorted by hue x lightness.
 * All colors are placed by hue (columns) x lightness (rows).
 * 4096 colors / 64 = exactly 64 per column, zero overflow.
 */
function buildMosaicGrid(): MosaicColorEntry[] {
  const allColors = generateAll12BitColors();

  // Sort all colors by hue — every color goes into hue-based columns
  allColors.sort((a, b) => a.oklch.h - b.oklch.h);

  const colorsPerCol = allColors.length / MOSAIC_GRID_SIZE; // 4096/64 = 64 exact
  const grid: MosaicColorEntry[] = [];

  for (let colIdx = 0; colIdx < MOSAIC_GRID_SIZE; colIdx++) {
    const startIdx = colIdx * colorsPerCol;
    const endIdx = startIdx + colorsPerCol;
    const columnColors = allColors.slice(startIdx, endIdx);

    // Lightness-dominant sort with gentle chroma influence (weight 0.25)
    // Bright+vivid at top, dark+muted at bottom
    columnColors.sort((a, b) => {
      const scoreA = a.oklch.l + a.oklch.c * 0.25;
      const scoreB = b.oklch.l + b.oklch.c * 0.25;
      return scoreB - scoreA;
    });

    for (let rowIdx = 0; rowIdx < columnColors.length; rowIdx++) {
      const c = columnColors[rowIdx];
      grid.push({
        hex3: c.hex3,
        hex6: c.hex6,
        rgb: c.rgb,
        oklch: c.oklch,
        gridRow: rowIdx,
        gridCol: colIdx,
      });
    }
  }

  return grid;
}

// Compute once and cache as module constant
let _cachedGrid: MosaicColorEntry[] | null = null;
let _cachedLookup: Map<string, MosaicColorEntry> | null = null;

/**
 * Get the full 4,096-entry mosaic grid (cached after first call)
 */
export function getMosaicGrid(): MosaicColorEntry[] {
  if (!_cachedGrid) {
    _cachedGrid = buildMosaicGrid();
  }
  return _cachedGrid;
}

/**
 * Get the hex3 -> MosaicColorEntry lookup map (cached after first call)
 */
export function getMosaicLookup(): Map<string, MosaicColorEntry> {
  if (!_cachedLookup) {
    const grid = getMosaicGrid();
    _cachedLookup = new Map();
    for (const entry of grid) {
      _cachedLookup.set(entry.hex3, entry);
    }
  }
  return _cachedLookup;
}

/**
 * Get a specific color entry by hex3
 */
export function getMosaicColor(hex3: string): MosaicColorEntry | undefined {
  return getMosaicLookup().get(hex3.toLowerCase());
}
