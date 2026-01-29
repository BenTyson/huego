"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useMosaicStore } from "@/store/mosaic";
import { MOSAIC_CHROMA_SLICES } from "@/lib/mosaic-types";
import { MosaicGrid } from "./MosaicGrid";
import { MosaicColorPanel } from "./MosaicColorPanel";

export function MosaicView() {
  const fetchClaims = useMosaicStore((s) => s.fetchClaims);
  const selectedHex3 = useMosaicStore((s) => s.selectedHex3);
  const chromaSlice = useMosaicStore((s) => s.chromaSlice);
  const setChromaSlice = useMosaicStore((s) => s.setChromaSlice);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return (
    <div className="h-full w-full overflow-hidden">
      {/* Floating Logo */}
      <Link
        href="/immersive"
        className="fixed top-4 left-4 z-50 opacity-30 hover:opacity-100 transition-opacity duration-300"
      >
        <span className="text-lg font-bold text-zinc-800">HueGo</span>
      </Link>

      {/* Grid - fills viewport above slider */}
      <MosaicGrid />

      {/* Chroma slider bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-4 px-6"
        style={{
          height: 80,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(12px)",
        }}
      >
        <span className="text-xs font-medium text-zinc-400 whitespace-nowrap select-none">
          Muted
        </span>
        <input
          type="range"
          min={0}
          max={MOSAIC_CHROMA_SLICES - 1}
          value={chromaSlice}
          onChange={(e) => setChromaSlice(Number(e.target.value))}
          className="chroma-slider flex-1 max-w-md h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #888, #f44, #ff0, #0f0, #0ff, #00f, #f0f, #f00)`,
          }}
        />
        <span className="text-xs font-medium text-zinc-400 whitespace-nowrap select-none">
          Vivid
        </span>
      </div>

      {/* Detail panel */}
      {selectedHex3 && <MosaicColorPanel />}
    </div>
  );
}
