"use client";

import { useCallback, useRef } from "react";
import { useMosaicStore, useMosaicClaimMap } from "@/store/mosaic";
import { getMosaicGrid } from "@/lib/mosaic-grid";
import { MOSAIC_GRID_SIZE, MOSAIC_CELL_SIZE } from "@/lib/mosaic-types";
import { MosaicCell } from "./MosaicCell";

export function MosaicGrid() {
  const claimMap = useMosaicClaimMap();
  const setSelectedHex3 = useMosaicStore((s) => s.setSelectedHex3);
  const setHoveredHex3 = useMosaicStore((s) => s.setHoveredHex3);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const gridPx = MOSAIC_GRID_SIZE * MOSAIC_CELL_SIZE;

  return (
    <div
      className="overflow-auto rounded-xl border border-command-border bg-black/20 p-2"
      style={{ maxWidth: "95vw", maxHeight: "80vh" }}
    >
      <div
        ref={containerRef}
        className="relative"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${MOSAIC_GRID_SIZE}, ${MOSAIC_CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${MOSAIC_GRID_SIZE}, ${MOSAIC_CELL_SIZE}px)`,
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
          />
        ))}
      </div>
    </div>
  );
}
