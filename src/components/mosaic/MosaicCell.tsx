"use client";

import { memo } from "react";

interface MosaicCellProps {
  hex3: string;
  hex6: string;
  gridRow: number;
  gridCol: number;
  isClaimed: boolean;
  cellSize: number;
}

export const MosaicCell = memo(function MosaicCell({
  hex3,
  hex6,
  gridRow,
  gridCol,
  isClaimed,
  cellSize,
}: MosaicCellProps) {
  return (
    <div
      data-hex={hex3}
      className="mosaic-cell"
      style={{
        gridRow: gridRow + 1,
        gridColumn: gridCol + 1,
        width: cellSize,
        height: cellSize,
        backgroundColor: hex6,
        cursor: "pointer",
      }}
      title={`#${hex3.toUpperCase()}`}
    />
  );
});
