"use client";

import { useCallback, useRef, useEffect, useMemo } from "react";
import { useMosaicStore } from "@/store/mosaic";
import { getChromaSlice } from "@/lib/mosaic-grid";
import { MOSAIC_SLICE_GRID_SIZE } from "@/lib/mosaic-types";
import type { RGB } from "@/lib/types";
import type { MosaicColorEntry } from "@/lib/mosaic-types";

const SLIDER_AREA_HEIGHT = 80;
const GRID = MOSAIC_SLICE_GRID_SIZE; // 16

/**
 * Build a 16×16 2D array of RGB values from the flat color list.
 * anchorGrid[row][col] = RGB
 */
function buildAnchorGrid(colors: MosaicColorEntry[]): RGB[][] {
  const grid: RGB[][] = Array.from({ length: GRID }, () =>
    Array.from({ length: GRID }, () => ({ r: 0, g: 0, b: 0 }))
  );
  for (const entry of colors) {
    grid[entry.gridRow][entry.gridCol] = entry.rgb;
  }
  return grid;
}

/** Bilinear interpolation of a single channel. */
function bilerp(
  c00: number,
  c10: number,
  c01: number,
  c11: number,
  tx: number,
  ty: number
): number {
  const top = c00 + (c10 - c00) * tx;
  const bot = c01 + (c11 - c01) * tx;
  return top + (bot - top) * ty;
}

/**
 * Render the smooth gradient onto the canvas ImageData buffer.
 * For each pixel, map to fractional grid coords and bilinearly
 * interpolate between the 4 surrounding anchor colors.
 */
function renderGradient(
  imageData: ImageData,
  anchorGrid: RGB[][],
  size: number
) {
  const data = imageData.data;
  const maxIdx = GRID - 1; // 15

  for (let py = 0; py < size; py++) {
    // Map pixel y to fractional grid coordinate [0, 15]
    const gy = (py / size) * maxIdx;
    const gy0 = Math.floor(gy);
    const gy1 = Math.min(gy0 + 1, maxIdx);
    const ty = gy - gy0;

    for (let px = 0; px < size; px++) {
      // Map pixel x to fractional grid coordinate [0, 15]
      const gx = (px / size) * maxIdx;
      const gx0 = Math.floor(gx);
      const gx1 = Math.min(gx0 + 1, maxIdx);
      const tx = gx - gx0;

      const c00 = anchorGrid[gy0][gx0];
      const c10 = anchorGrid[gy0][gx1];
      const c01 = anchorGrid[gy1][gx0];
      const c11 = anchorGrid[gy1][gx1];

      const offset = (py * size + px) * 4;
      data[offset] = bilerp(c00.r, c10.r, c01.r, c11.r, tx, ty);
      data[offset + 1] = bilerp(c00.g, c10.g, c01.g, c11.g, tx, ty);
      data[offset + 2] = bilerp(c00.b, c10.b, c01.b, c11.b, tx, ty);
      data[offset + 3] = 255;
    }
  }
}

export function MosaicGrid() {
  const setSelectedHex3 = useMosaicStore((s) => s.setSelectedHex3);
  const setHoveredHex3 = useMosaicStore((s) => s.setHoveredHex3);
  const chromaSlice = useMosaicStore((s) => s.chromaSlice);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef(0);

  const slice = useMemo(() => getChromaSlice(chromaSlice), [chromaSlice]);
  const anchorGrid = useMemo(() => buildAnchorGrid(slice.colors), [slice]);

  // Compute canvas size and draw gradient
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvas = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight - SLIDER_AREA_HEIGHT;
      const size = Math.floor(Math.min(vw, vh));
      sizeRef.current = size;

      canvas.width = size;
      canvas.height = size;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const imageData = ctx.createImageData(size, size);
      renderGradient(imageData, anchorGrid, size);
      ctx.putImageData(imageData, 0, 0);
    };

    updateCanvas();
    window.addEventListener("resize", updateCanvas);
    return () => window.removeEventListener("resize", updateCanvas);
  }, [anchorGrid]);

  /** Map pixel coordinate to grid cell index [0, 15] */
  const pixelToCell = useCallback(
    (px: number, canvasSize: number): number => {
      return Math.max(0, Math.min(GRID - 1, Math.floor((px / canvasSize) * GRID)));
    },
    []
  );

  /** Map pixel coordinate to hex3 from the slice colors */
  const pixelToHex3 = useCallback(
    (clientX: number, clientY: number): string | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      const size = sizeRef.current;

      if (px < 0 || py < 0 || px >= size || py >= size) return null;

      const col = pixelToCell(px, size);
      const row = pixelToCell(py, size);

      const entry = slice.colors.find(
        (c) => c.gridRow === row && c.gridCol === col
      );
      return entry?.hex3 ?? null;
    },
    [slice, pixelToCell]
  );

  /** Get hex6 for a given hex3 from the slice */
  const getHex6 = useCallback(
    (hex3: string): string => {
      const entry = slice.colors.find((c) => c.hex3 === hex3);
      return entry?.hex6 ?? "#000000";
    },
    [slice]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const hex3 = pixelToHex3(e.clientX, e.clientY);
      if (hex3) setSelectedHex3(hex3);
    },
    [pixelToHex3, setSelectedHex3]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const hex3 = pixelToHex3(e.clientX, e.clientY);
      if (hex3) {
        setHoveredHex3(hex3);

        // Update tooltip imperatively (no re-renders)
        const tooltip = tooltipRef.current;
        if (tooltip) {
          const hex6 = getHex6(hex3);
          const canvas = canvasRef.current!;
          const rect = canvas.getBoundingClientRect();
          const px = e.clientX - rect.left;
          const py = e.clientY - rect.top;

          tooltip.style.display = "block";
          tooltip.style.left = `${px + 14}px`;
          tooltip.style.top = `${py - 32}px`;
          tooltip.style.backgroundColor = hex6;
          tooltip.textContent = hex6.toUpperCase();

          // Pick contrasting text color
          const entry = slice.colors.find((c) => c.hex3 === hex3);
          if (entry) {
            const lum = entry.rgb.r * 0.299 + entry.rgb.g * 0.587 + entry.rgb.b * 0.114;
            tooltip.style.color = lum > 140 ? "#000" : "#fff";
          }
        }
      }
    },
    [pixelToHex3, setHoveredHex3, getHex6, slice]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredHex3(null);
    const tooltip = tooltipRef.current;
    if (tooltip) tooltip.style.display = "none";
  }, [setHoveredHex3]);

  return (
    <div
      className="w-screen flex items-center justify-center"
      style={{ height: `calc(100vh - ${SLIDER_AREA_HEIGHT}px)` }}
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ borderRadius: 12, cursor: "crosshair" }}
        />
        {/* Floating tooltip — positioned imperatively via ref */}
        <div
          ref={tooltipRef}
          style={{
            display: "none",
            position: "absolute",
            pointerEvents: "none",
            padding: "4px 8px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "monospace",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
}
