"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useMosaicStore, useMosaicClaimMap } from "@/store/mosaic";
import { getMosaicGrid } from "@/lib/mosaic-grid";
import { MOSAIC_GRID_SIZE } from "@/lib/mosaic-types";
import { MosaicCell } from "./MosaicCell";

export function MosaicGrid() {
  const claimMap = useMosaicClaimMap();
  const setSelectedHex3 = useMosaicStore((s) => s.setSelectedHex3);
  const setHoveredHex3 = useMosaicStore((s) => s.setHoveredHex3);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate cell size to fill viewport
  const [cellSize, setCellSize] = useState(15);

  useEffect(() => {
    const updateSize = () => {
      // Use the larger dimension to ensure grid fills the screen
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Cell size = larger dimension / grid size, so grid always fills or exceeds viewport
      const size = Math.max(vw, vh) / MOSAIC_GRID_SIZE;
      setCellSize(Math.ceil(size));
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const grid = getMosaicGrid();

  // Event delegation — single handler on the container
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const hex = target.dataset.hex;
      if (hex) {
        setSelectedHex3(hex);
      }
    },
    [setSelectedHex3]
  );

  const handleMouseOver = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const hex = target.dataset.hex;
      if (hex) {
        setHoveredHex3(hex);
      }
    },
    [setHoveredHex3]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredHex3(null);
  }, [setHoveredHex3]);

  const gridPx = MOSAIC_GRID_SIZE * cellSize;

  return (
    <div
      className="w-screen h-screen overflow-auto"
    >
      <div
        ref={containerRef}
        className="relative"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${MOSAIC_GRID_SIZE}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${MOSAIC_GRID_SIZE}, ${cellSize}px)`,
          width: gridPx,
          height: gridPx,
          gap: 0,
        }}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        {grid.map((entry) => (
          <MosaicCell
            key={entry.hex3}
            hex3={entry.hex3}
            hex6={entry.hex6}
            gridRow={entry.gridRow}
            gridCol={entry.gridCol}
            isClaimed={
              claimMap.get(entry.hex3)?.payment_status === "completed"
            }
            cellSize={cellSize}
          />
        ))}
      </div>
    </div>
  );
}
