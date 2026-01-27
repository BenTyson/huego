"use client";

import { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import type { MoodProfile, RefinementValues } from "@/lib/mood";
import type { Color } from "@/lib/types";
import { createColor } from "@/lib/colors";
import { RefinementSliders } from "./RefinementSliders";
import { moodIcons } from "@/lib/mood-icons";
import { ColorColumn } from "@/components/modes/immersive/ColorColumn";
import { ColorInfoPanel } from "@/components/ColorInfoPanel";
import { LayoutToggle } from "@/components/ui/LayoutToggle";
import { useColors, useLocked, useSavedColors, usePaletteStore } from "@/store/palette";
import { usePaletteLayout } from "@/store/ui";

interface MoodEditorProps {
  mood: MoodProfile;
  refinements: RefinementValues;
  onRefinementChange: (key: keyof RefinementValues, value: number) => void;
  onRegenerate: () => void;
  onBack: () => void;
}

export const MoodEditor = memo(function MoodEditor({
  mood,
  refinements,
  onRefinementChange,
  onRegenerate,
  onBack,
}: MoodEditorProps) {
  const icon = moodIcons[mood.id];

  // Global store hooks
  const colors = useColors();
  const locked = useLocked();
  const paletteLayout = usePaletteLayout();
  useSavedColors(); // Ensures re-renders on savedColors changes
  const {
    toggleLock,
    setColor,
    removeColorAt,
    reorderColors,
    toggleSaveColor,
    isSavedColor,
  } = usePaletteStore();

  // Local state for ColorInfoPanel
  const [infoColor, setInfoColor] = useState<Color | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  const isStrips = paletteLayout === "strips";

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
      toggleSaveColor(color, false);
    },
    [toggleSaveColor]
  );

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
          <span className="text-sm font-medium hidden sm:inline">Back</span>
        </motion.button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="text-white/70">{icon}</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{mood.name}</h2>
            <p className="text-xs text-white/40 hidden sm:block">
              {mood.description}
            </p>
          </div>
        </div>

        {/* Layout toggle */}
        <div className="flex items-center gap-2">
          <LayoutToggle />
        </div>
      </div>

      {/* Color Columns/Strips - pb-36 provides clearance for the fixed RefinementSliders */}
      <div className={`flex-1 flex min-h-0 pb-36 ${
        isStrips ? "flex-col" : "flex-col md:flex-row"
      }`}>
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

      {/* Bottom Controls - Refinement Sliders */}
      <RefinementSliders
        visible={true}
        variant="overlay"
        refinements={refinements}
        onRefinementChange={onRefinementChange}
        onRegenerate={onRegenerate}
      />

      {/* Color Psychology Info Panel */}
      <ColorInfoPanel
        isOpen={showInfoPanel}
        onClose={() => setShowInfoPanel(false)}
        color={infoColor}
      />
    </motion.div>
  );
});
