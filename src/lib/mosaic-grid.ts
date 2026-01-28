// Mosaic grid generation — 4,096 shorthand hex colors arranged in a 64x64 grid
// Sorted by hue (horizontal) x lightness (vertical) with achromatic colors on the left

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
 * Achromatic colors (low chroma) go in leftmost columns sorted by lightness.
 * Chromatic colors fill the rest sorted by hue (columns) x lightness (rows).
 */
function buildMosaicGrid(): MosaicColorEntry[] {
  const allColors = generateAll12BitColors();
  const CHROMA_THRESHOLD = 0.02;

  // Separate achromatic vs chromatic
  const achromatic = allColors.filter((c) => c.oklch.c < CHROMA_THRESHOLD);
  const chromatic = allColors.filter((c) => c.oklch.c >= CHROMA_THRESHOLD);

  // Sort achromatic by lightness (dark to light, top to bottom)
  achromatic.sort((a, b) => a.oklch.l - b.oklch.l);

  // Figure out how many columns achromatic colors need
  const achromaticCols = Math.ceil(achromatic.length / MOSAIC_GRID_SIZE);
  const chromaticCols = MOSAIC_GRID_SIZE - achromaticCols;

  const grid: MosaicColorEntry[] = [];

  // Place achromatic colors in leftmost columns, top to bottom
  for (let i = 0; i < achromatic.length; i++) {
    const col = Math.floor(i / MOSAIC_GRID_SIZE);
    const row = i % MOSAIC_GRID_SIZE;
    const c = achromatic[i];
    grid.push({
      hex3: c.hex3,
      hex6: c.hex6,
      rgb: c.rgb,
      oklch: c.oklch,
      gridRow: row,
      gridCol: col,
    });
  }

  // Sort chromatic colors by hue for column placement
  chromatic.sort((a, b) => a.oklch.h - b.oklch.h);

  // Divide chromatic colors into columns by hue
  const colorsPerCol = Math.ceil(chromatic.length / chromaticCols);

  for (let colIdx = 0; colIdx < chromaticCols; colIdx++) {
    const startIdx = colIdx * colorsPerCol;
    const endIdx = Math.min(startIdx + colorsPerCol, chromatic.length);
    const columnColors = chromatic.slice(startIdx, endIdx);

    // Sort each column by lightness (light on top, dark on bottom)
    columnColors.sort((a, b) => b.oklch.l - a.oklch.l);

    for (let rowIdx = 0; rowIdx < columnColors.length; rowIdx++) {
      const c = columnColors[rowIdx];
      grid.push({
        hex3: c.hex3,
        hex6: c.hex6,
        rgb: c.rgb,
        oklch: c.oklch,
        gridRow: rowIdx,
        gridCol: colIdx + achromaticCols,
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
