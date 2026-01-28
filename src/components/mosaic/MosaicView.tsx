"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMosaicStore } from "@/store/mosaic";
import { MosaicGrid } from "./MosaicGrid";
import { MosaicColorPanel } from "./MosaicColorPanel";

export function MosaicView() {
  const fetchClaims = useMosaicStore((s) => s.fetchClaims);
  const selectedHex3 = useMosaicStore((s) => s.selectedHex3);

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

      {/* Grid - fills entire viewport */}
      <MosaicGrid />

      {/* Detail panel */}
      {selectedHex3 && <MosaicColorPanel />}
    </div>
  );
}
