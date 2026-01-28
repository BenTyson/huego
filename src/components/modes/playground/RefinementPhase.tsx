"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { Color } from "@/lib/types";
import type { RefinementValues } from "@/lib/mood";
import { applyRefinementsToColors } from "@/lib/mood";
import { createColor } from "@/lib/colors";
import { generateRandomColor } from "@/lib/generate";
import { RefinementSliders } from "@/components/modes/mood/RefinementSliders";
import { ColorColumn } from "@/components/modes/immersive/ColorColumn";
import { ColorInfoPanel } from "@/components/ColorInfoPanel";
import { LayoutToggle } from "@/components/ui/LayoutToggle";
import { useColors, useLocked, useSavedColors, usePaletteStore } from "@/store/palette";
import { usePaletteLayout } from "@/store/ui";

interface RefinementPhaseProps {
  onBack: () => void;
}

export function RefinementPhase({ onBack }: RefinementPhaseProps) {
  // Global store hooks
  const colors = useColors();
  const locked = useLocked();
  const paletteLayout = usePaletteLayout();
  useSavedColors(); // Re-render on savedColors changes
  const {
    toggleLock,
    setColor,
    setColors,
    removeColorAt,
    reorderColors,
    toggleSaveColor,
    isSavedColor,
  } = usePaletteStore();

  // Refinement state
  const [refinements, setRefinements] = useState<RefinementValues>({
    temperature: 0,
    vibrancy: 0,
    brightness: 0,
  });
  const baseColorsRef = useRef<Color[]>(colors);
  const isApplyingRefinementRef = useRef(false);

  // Sync base when colors change externally (e.g., shade shift, reorder)
  useEffect(() => {
    if (!isApplyingRefinementRef.current && colors.length > 0) {
      baseColorsRef.current = colors;
      setRefinements({ temperature: 0, vibrancy: 0, brightness: 0 });
    }
  }, [colors]);

  // Local state for ColorInfoPanel
  const [infoColor, setInfoColor] = useState<Color | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  const isStrips = paletteLayout === "strips";

  // If all colors removed, go back to discovery
  useEffect(() => {
    if (colors.length === 0) {
      onBack();
    }
  }, [colors.length, onBack]);

  const handleColorChange = useCallback(
    (index: number, hex: string) => {
      setColor(index, createColor(hex));
    },
    [setColor]
  );

  const handleShowInfo = useCallback((color: Color) => {
    setInfoColor(color);
    setShowInfoPanel(true);
  }, []);

  const handleRemove = useCallback(
    (index: number) => {
      removeColorAt(index);
    },
    [removeColorAt]
  );

  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      reorderColors(fromIndex, toIndex);
    },
    [reorderColors]
  );

  const handleToggleSave = useCallback(
    (color: Color) => {
      toggleSaveColor(color, false);
    },
    [toggleSaveColor]
  );

  const handleRefinementChange = useCallback(
    (key: keyof RefinementValues, value: number) => {
      const newRefinements = { ...refinements, [key]: value };
      setRefinements(newRefinements);

      if (baseColorsRef.current.length > 0) {
        isApplyingRefinementRef.current = true;
        const adjustedColors = applyRefinementsToColors(
          baseColorsRef.current,
          newRefinements
        );
        setColors(adjustedColors);
        setTimeout(() => {
          isApplyingRefinementRef.current = false;
        }, 0);
      }
    },
    [refinements, setColors]
  );

  const handleRegenerate = useCallback(() => {
    // Regenerate: randomize unlocked colors, keep locked
    const newBase = colors.map((c, i) => (locked[i] ? c : generateRandomColor()));
    baseColorsRef.current = newBase;
    const adjusted = applyRefinementsToColors(newBase, refinements);
    setColors(adjusted);
  }, [colors, locked, refinements, setColors]);

  return (
    <motion.div
      className="h-dvh w-screen flex flex-col bg-zinc-900 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Top Bar */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 bg-zinc-900/80 backdrop-blur-sm border-b border-white/5 z-10">
        <motion.button
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium hidden sm:inline">
            Back to Discovery
          </span>
        </motion.button>

        <h2 className="text-lg font-semibold text-white">Color Lab</h2>

        <div className="flex items-center gap-2">
          <LayoutToggle />
        </div>
      </div>

      {/* Color Columns/Strips — pb-36 clears the fixed RefinementSliders */}
      <div
        className={`flex-1 flex min-h-0 pb-36 ${
          isStrips ? "flex-col" : "flex-col md:flex-row"
        }`}
      >
        {colors.map((color, index) => (
          <ColorColumn
            key={index}
            color={color}
            index={index}
            isLocked={locked[index]}
            isSaved={isSavedColor(color.hex)}
            totalColors={colors.length}
            onToggleLock={() => toggleLock(index)}
            onToggleSave={() => handleToggleSave(color)}
            onRemove={() => handleRemove(index)}
            onColorChange={(hex) => handleColorChange(index, hex)}
            onShowInfo={() => handleShowInfo(color)}
            onReorder={(toIndex) => handleReorder(index, toIndex)}
            isActive={false}
            disableLayoutAnimation
            orientation={isStrips ? "horizontal" : "vertical"}
          />
        ))}
      </div>

      {/* Refinement Sliders */}
      <RefinementSliders
        visible={true}
        variant="overlay"
        refinements={refinements}
        onRefinementChange={handleRefinementChange}
        onRegenerate={handleRegenerate}
      />

      {/* Color Psychology Info Panel */}
      <ColorInfoPanel
        isOpen={showInfoPanel}
        onClose={() => setShowInfoPanel(false)}
        color={infoColor}
      />
    </motion.div>
  );
}
