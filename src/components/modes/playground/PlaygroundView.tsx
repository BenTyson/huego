"use client";

import { useState, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { usePaletteStore } from "@/store/palette";
import { FREE_MAX_PALETTE_SIZE } from "@/lib/feature-limits";
import { createAdaptiveEngine } from "@/lib/adaptive-color";
import type { Color } from "@/lib/types";
import { DiscoveryPhase } from "./DiscoveryPhase";
import { RefinementPhase } from "./RefinementPhase";

type Phase = "discovery" | "refinement";

export function PlaygroundView() {
  const { setColors } = usePaletteStore();
  const storeColors = usePaletteStore((state) => state.colors);

  const [phase, setPhase] = useState<Phase>("discovery");
  const [localPalette, setLocalPalette] = useState<Color[]>([]);

  // Persistent adaptive engine (survives phase transitions)
  const engineRef = useRef(createAdaptiveEngine());

  // Max palette size (TODO: pass isPremium for premium users)
  const maxSize = FREE_MAX_PALETTE_SIZE;

  const handleRefine = useCallback(() => {
    // Write local palette to global store and switch to refinement
    setColors(localPalette);
    setPhase("refinement");
  }, [localPalette, setColors]);

  const handleBackToDiscovery = useCallback(() => {
    // Read colors back from global store into local palette
    setLocalPalette(storeColors);
    setPhase("discovery");
  }, [storeColors]);

  return (
    <AnimatePresence mode="wait">
      {phase === "discovery" ? (
        <DiscoveryPhase
          key="discovery"
          palette={localPalette}
          setPalette={setLocalPalette}
          maxSize={maxSize}
          onRefine={handleRefine}
          engineRef={engineRef}
        />
      ) : (
        <RefinementPhase key="refinement" onBack={handleBackToDiscovery} />
      )}
    </AnimatePresence>
  );
}
