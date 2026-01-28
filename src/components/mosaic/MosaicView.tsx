"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useMosaicStore } from "@/store/mosaic";
import { MosaicGrid } from "./MosaicGrid";
import { MosaicColorPanel } from "./MosaicColorPanel";
import { MosaicStatsBar } from "./MosaicStatsBar";

export function MosaicView() {
  const fetchClaims = useMosaicStore((s) => s.fetchClaims);
  const selectedHex3 = useMosaicStore((s) => s.selectedHex3);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 pb-12 px-4">
      {/* Header */}
      <motion.div
        className="text-center mb-6 max-w-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">The Mosaic</h1>
        <p className="text-foreground/60 text-sm">
          4,096 colors. Claim one, name it, make it yours.
        </p>
      </motion.div>

      {/* Stats */}
      <MosaicStatsBar />

      {/* Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <MosaicGrid />
      </motion.div>

      {/* Detail panel */}
      {selectedHex3 && <MosaicColorPanel />}
    </div>
  );
}
