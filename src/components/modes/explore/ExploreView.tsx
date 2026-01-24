"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useCommunityStore } from "@/store/community";
import { ExploreFilterBar } from "./ExploreFilterBar";
import { ExplorePaletteGrid } from "./ExplorePaletteGrid";

export function ExploreView() {
  const { fetchPalettes } = useCommunityStore();

  // Fetch palettes on mount
  useEffect(() => {
    fetchPalettes(true);
  }, [fetchPalettes]);

  return (
    <div className="min-h-screen w-full bg-zinc-900 pt-20">
      {/* Header */}
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Explore Palettes</h1>
        <p className="text-white/60 max-w-md mx-auto">
          Discover color palettes created by the community. Find inspiration and use them in your projects.
        </p>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ExploreFilterBar />
      </motion.div>

      {/* Palette Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ExplorePaletteGrid />
      </motion.div>
    </div>
  );
}
