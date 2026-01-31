"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { usePaletteStore } from "@/store/palette";
import { FREE_MAX_PALETTE_SIZE } from "@/lib/feature-limits";
import { createAdaptiveEngine } from "@/lib/adaptive-color";
import { useNavigationGuard } from "@/contexts/NavigationGuardContext";
import type { Color } from "@/lib/types";
import { DiscoveryPhase } from "./DiscoveryPhase";
import { RefinementPhase } from "./RefinementPhase";

type Phase = "discovery" | "refinement";

export function PlaygroundView() {
  const { setColors } = usePaletteStore();
  const storeColors = usePaletteStore((state) => state.colors);
  const { setGuard, clearGuard } = useNavigationGuard();

  const [phase, setPhase] = useState<Phase>("discovery");
  const [localPalette, setLocalPalette] = useState<Color[]>([]);

  // Persistent adaptive engine (survives phase transitions)
  const engineRef = useRef(createAdaptiveEngine());

  // Keep a ref to localPalette so the guard condition closure is always fresh
  const localPaletteRef = useRef(localPalette);
  localPaletteRef.current = localPalette;

  // Register/clear navigation guard based on phase
  useEffect(() => {
    if (phase === "discovery") {
      setGuard(
        () => localPaletteRef.current.length > 0,
        "You have unsaved colors in your discovery palette. Leaving will discard them."
      );
    } else {
      clearGuard();
    }
    return () => clearGuard();
  }, [phase, setGuard, clearGuard]);

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
