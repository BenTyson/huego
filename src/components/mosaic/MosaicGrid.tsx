"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useMosaicStore, useMosaicClaimMap } from "@/store/mosaic";
import { getChromaSlice } from "@/lib/mosaic-grid";
import { MOSAIC_SLICE_GRID_SIZE } from "@/lib/mosaic-types";
import { MosaicCell } from "./MosaicCell";

const SLIDER_AREA_HEIGHT = 80; // px reserved for the bottom slider bar

export function MosaicGrid() {
  const claimMap = useMosaicClaimMap();
  const setSelectedHex3 = useMosaicStore((s) => s.setSelectedHex3);
  const setHoveredHex3 = useMosaicStore((s) => s.setHoveredHex3);
  const chromaSlice = useMosaicStore((s) => s.chromaSlice);
  const containerRef = useRef<HTMLDivElement>(null);

  const [cellSize, setCellSize] = useState(15);

  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight - SLIDER_AREA_HEIGHT;
      const size = Math.min(vw, vh) / MOSAIC_SLICE_GRID_SIZE;
      setCellSize(Math.floor(size));
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const slice = getChromaSlice(chromaSlice);

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

  const gridPx = MOSAIC_SLICE_GRID_SIZE * cellSize;

  return (
    <div
      className="w-screen flex items-center justify-center"
      style={{ height: `calc(100vh - ${SLIDER_AREA_HEIGHT}px)` }}
    >
      <div
        ref={containerRef}
        className="relative"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${MOSAIC_SLICE_GRID_SIZE}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${MOSAIC_SLICE_GRID_SIZE}, ${cellSize}px)`,
          width: gridPx,
          height: gridPx,
          gap: 0,
        }}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        {slice.colors.map((entry) => (
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
