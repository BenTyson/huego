"use client";

import { useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { usePaletteStore, useColors, useLocked, useSavedColors } from "@/store/palette";
import { createColor } from "@/lib/colors";
import { ColorColumn } from "./ColorColumn";
import { ColorInfoPanel } from "@/components/ColorInfoPanel";
import type { Color } from "@/lib/types";

export function ImmersiveView() {
  // Use individual selectors for optimized re-renders
  const colors = useColors();
  const locked = useLocked();
  // savedColors is accessed via isSavedColor - this hook ensures re-renders on savedColors changes
  useSavedColors();
  const {
    generate,
    toggleLock,
    setColor,
    removeColorAt,
    reorderColors,
    toggleSaveColor,
    isSavedColor,
  } = usePaletteStore();
  const [activeIndex] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [infoColor, setInfoColor] = useState<Color | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  // Hide hint after first generation
  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => setShowHint(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showHint]);

  const handleGenerate = useCallback(() => {
    generate();
    setShowHint(false);
  }, [generate]);

  const handleColorChange = useCallback(
    (index: number, hex: string) => {
      const newColor = createColor(hex);
      setColor(index, newColor);
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
      // For now, assume non-premium - this can be connected to auth later
      toggleSaveColor(color, false);
    },
    [toggleSaveColor]
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Color columns */}
      <LayoutGroup>
        <motion.div
          className="flex h-full w-full flex-col md:flex-row"
          initial={false}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence mode="sync">
            {colors.map((color, index) => (
              <ColorColumn
                key={`${color.hex}-${index}`}
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
                isActive={activeIndex === index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* Spacebar hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm text-white text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <span className="hidden md:inline">Press</span>
            <kbd className="px-2 py-1 rounded bg-white/20 font-mono text-xs">
              Space
            </kbd>
            <span className="hidden md:inline">to generate</span>
            <span className="md:hidden">Generate</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile generate button */}
      <motion.button
        className="md:hidden absolute bottom-6 right-6 w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center"
        onClick={handleGenerate}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-800"
        >
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 16h5v5" />
        </svg>
      </motion.button>

      {/* Undo button */}
      <motion.button
        className="absolute bottom-6 left-6 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-colors"
        onClick={() => usePaletteStore.getState().undo()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
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
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </svg>
      </motion.button>

      {/* Color Psychology Info Panel */}
      <ColorInfoPanel
        isOpen={showInfoPanel}
        onClose={() => setShowInfoPanel(false)}
        color={infoColor}
      />
    </div>
  );
}
