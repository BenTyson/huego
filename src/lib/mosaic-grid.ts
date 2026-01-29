// Mosaic grid generation — 4,096 shorthand hex colors arranged in a 64x64 grid
// Target cell assignment: hue → column, lightness → row, chroma → placement priority

import { rgbToOklch } from "./colors";
import type { RGB, OKLCH } from "./types";
import type { MosaicColorEntry, ChromaSlice } from "./mosaic-types";
import { MOSAIC_GRID_SIZE, MOSAIC_CHROMA_SLICES, MOSAIC_SLICE_GRID_SIZE } from "./mosaic-types";

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
 * Spiral BFS search for nearest open cell with weighted distance.
 * Hue displacement costs 1.5x lightness displacement (hue shifts are more jarring).
 * Hue wraps around: colDist = min(|dc|, 64 - |dc|) so reds at hue 0/360 boundary
 * aren't pushed far away.
 */
function findNearestOpen(
  targetRow: number,
  targetCol: number,
  occupied: boolean[][],
): [number, number] {
  // Fast path: ideal cell is open
  if (!occupied[targetRow][targetCol]) {
    return [targetRow, targetCol];
  }

  const size = MOSAIC_GRID_SIZE;
  let bestRow = -1;
  let bestCol = -1;
  let bestDist = Infinity;

  // Search in expanding rings
  const maxRadius = size;
  for (let radius = 1; radius <= maxRadius; radius++) {
    // Early exit: best found is closer than anything at this radius
    if (bestDist < radius) break;

    // Scan perimeter of square at this radius
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        if (Math.abs(dr) !== radius && Math.abs(dc) !== radius) continue;

        const r = targetRow + dr;
        const c = ((targetCol + dc) % size + size) % size;

        if (r < 0 || r >= size) continue;
        if (occupied[r][c]) continue;

        const rowDist = Math.abs(dr);
        const colDist = Math.min(Math.abs(dc), size - Math.abs(dc));
        const dist = rowDist + colDist * 1.5;

        if (dist < bestDist) {
          bestDist = dist;
          bestRow = r;
          bestCol = c;
        }
      }
    }
  }

  return [bestRow, bestCol];
}

/**
 * Build the 64x64 mosaic grid using target cell assignment.
 *
 * Instead of sorting into bins, compute where each color SHOULD go on the grid
 * and assign it there. Vivid colors are placed first (they define the rainbow
 * structure), then muted colors fill remaining positions near their ideal spots.
 *
 * - idealCol = (hue / 360) * 63  — hue maps directly to column
 * - idealRow = (1 - lightness) * 63 — lightness maps directly to row
 * - Chroma determines placement priority (vivid first, grays last)
 * - Spiral BFS resolves conflicts, keeping displaced colors near their ideal
 */
function buildMosaicGrid(): MosaicColorEntry[] {
  const allColors = generateAll12BitColors();
  const size = MOSAIC_GRID_SIZE; // 64
  const maxIdx = size - 1; // 63

  // Compute ideal floating-point grid position for each color
  interface ColorPlacement {
    color: ColorWithOklch;
    idealRow: number;
    idealCol: number;
    chroma: number;
    lightness: number;
  }

  const placements: ColorPlacement[] = allColors.map((color) => {
    const { l, c, h } = color.oklch;
    return {
      color,
      idealCol: (h / 360) * maxIdx,
      idealRow: (1 - l) * maxIdx, // bright top, dark bottom
      chroma: c,
      lightness: l,
    };
  });

  // Assign placement priority tiers
  const tier1: ColorPlacement[] = []; // High-chroma, mid-lightness (vivid anchors)
  const tier2: ColorPlacement[] = []; // Medium-chroma (muted but chromatic)
  const tier3: ColorPlacement[] = []; // Near-achromatic (grays, placed last)

  for (const entry of placements) {
    if (
      entry.chroma >= 0.08 &&
      entry.lightness >= 0.15 &&
      entry.lightness <= 0.95
    ) {
      tier1.push(entry);
    } else if (entry.chroma >= 0.02) {
      tier2.push(entry);
    } else {
      tier3.push(entry);
    }
  }

  // Within each tier, sort by chroma descending so most vivid gets first pick
  const byChromaDesc = (a: ColorPlacement, b: ColorPlacement) =>
    b.chroma - a.chroma;
  tier1.sort(byChromaDesc);
  tier2.sort(byChromaDesc);
  tier3.sort(byChromaDesc);

  const placementOrder = [...tier1, ...tier2, ...tier3];

  // Greedy assignment with spiral BFS fallback
  const occupied: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false),
  );

  const gridCells: (MosaicColorEntry | null)[][] = Array.from(
    { length: size },
    () => Array(size).fill(null),
  );

  for (const entry of placementOrder) {
    const targetRow = Math.max(
      0,
      Math.min(maxIdx, Math.round(entry.idealRow)),
    );
    const targetCol = ((Math.round(entry.idealCol) % size) + size) % size;

    const [row, col] = findNearestOpen(targetRow, targetCol, occupied);
    occupied[row][col] = true;

    gridCells[row][col] = {
      hex3: entry.color.hex3,
      hex6: entry.color.hex6,
      rgb: entry.color.rgb,
      oklch: entry.color.oklch,
      gridRow: row,
      gridCol: col,
    };
  }

  // Flatten to array
  const grid: MosaicColorEntry[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      grid.push(gridCells[r][c]!);
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

// ============================================
// Chroma slider — 16 slices of 256 colors each
// ============================================

let _cachedChromaSlices: ChromaSlice[] | null = null;

/**
 * Build all 16 chroma slices.
 *
 * Algorithm:
 * 1. Sort all 4,096 colors by chroma ascending
 * 2. Split into 16 equal bands of 256 colors each
 * 3. Within each band: rank-sort by hue → 16 columns
 * 4. Within each column: sort by lightness descending → 16 rows
 * Result: each slice is a perfectly smooth 16×16 hue × lightness gradient
 */
function buildChromaSlices(): ChromaSlice[] {
  const allColors = generateAll12BitColors();
  const cols = MOSAIC_SLICE_GRID_SIZE; // 16
  const rows = MOSAIC_SLICE_GRID_SIZE; // 16
  const perSlice = cols * rows; // 256

  // Sort all colors by chroma ascending
  allColors.sort((a, b) => a.oklch.c - b.oklch.c);

  const slices: ChromaSlice[] = [];

  for (let si = 0; si < MOSAIC_CHROMA_SLICES; si++) {
    const band = allColors.slice(si * perSlice, (si + 1) * perSlice);

    const chromaMin = band[0].oklch.c;
    const chromaMax = band[band.length - 1].oklch.c;

    // Sort band by hue to assign columns
    band.sort((a, b) => a.oklch.h - b.oklch.h);

    // Split into 16 columns (each column = 16 colors with similar hue)
    const columns: ColorWithOklch[][] = [];
    for (let col = 0; col < cols; col++) {
      columns.push(band.slice(col * rows, (col + 1) * rows));
    }

    // Within each column, sort by lightness descending (bright top, dark bottom)
    const entries: MosaicColorEntry[] = [];
    for (let col = 0; col < cols; col++) {
      columns[col].sort((a, b) => b.oklch.l - a.oklch.l);
      for (let row = 0; row < rows; row++) {
        const color = columns[col][row];
        entries.push({
          hex3: color.hex3,
          hex6: color.hex6,
          rgb: color.rgb,
          oklch: color.oklch,
          gridRow: row,
          gridCol: col,
        });
      }
    }

    slices.push({
      sliceIndex: si,
      chromaMin,
      chromaMax,
      gridCols: cols,
      gridRows: rows,
      colors: entries,
    });
  }

  return slices;
}

/**
 * Get all 16 chroma slices (cached after first call)
 */
export function getChromaSlices(): ChromaSlice[] {
  if (!_cachedChromaSlices) {
    _cachedChromaSlices = buildChromaSlices();
  }
  return _cachedChromaSlices;
}

/**
 * Get a single chroma slice by index (0–15)
 */
export function getChromaSlice(index: number): ChromaSlice {
  const slices = getChromaSlices();
  return slices[Math.max(0, Math.min(MOSAIC_CHROMA_SLICES - 1, index))];
}
