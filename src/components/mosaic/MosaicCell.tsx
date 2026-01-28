"use client";

import { memo } from "react";
import { MOSAIC_CELL_SIZE } from "@/lib/mosaic-types";

interface MosaicCellProps {
  hex3: string;
  hex6: string;
  gridRow: number;
  gridCol: number;
  isClaimed: boolean;
}

export const MosaicCell = memo(function MosaicCell({
  hex3,
  hex6,
  gridRow,
  gridCol,
  isClaimed,
}: MosaicCellProps) {
  return (
    <div
      data-hex={hex3}
      style={{
        gridRow: gridRow + 1,
        gridColumn: gridCol + 1,
        width: MOSAIC_CELL_SIZE,
        height: MOSAIC_CELL_SIZE,
        backgroundColor: hex6,
        opacity: isClaimed ? 1 : 0.35,
        cursor: "pointer",
        transition: "opacity 0.3s ease, transform 0.15s ease",
      }}
      title={`#${hex3.toUpperCase()}`}
    />
  );
});
