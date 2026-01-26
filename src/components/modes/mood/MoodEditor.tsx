"use client";

import { useState, useCallback, useRef, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MoodProfile, RefinementValues } from "@/lib/mood";
import type { Color } from "@/lib/types";
import { createColor } from "@/lib/colors";
import { RefinementSliders } from "./RefinementSliders";
import { moodIcons } from "@/lib/mood-icons";

interface MoodEditorProps {
  mood: MoodProfile;
  colors: Color[];
  refinements: RefinementValues;
  onRefinementChange: (key: keyof RefinementValues, value: number) => void;
  onRegenerate: () => void;
  onColorChange: (index: number, color: Color) => void;
  onBack: () => void;
  onApply: () => void;
}

export const MoodEditor = memo(function MoodEditor({
  mood,
  colors,
  refinements,
  onRefinementChange,
  onRegenerate,
  onColorChange,
  onBack,
  onApply,
}: MoodEditorProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const colorInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const icon = moodIcons[mood.id];

  const handleColorInput = useCallback(
    (index: number, hex: string) => {
      const newColor = createColor(hex);
      onColorChange(index, newColor);
    },
    [onColorChange]
  );

  const handleEditClick = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    colorInputRefs.current[index]?.click();
  }, []);

  const handleCopy = useCallback(async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

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

        <motion.button
          className="px-4 py-2 rounded-lg bg-white text-zinc-900 font-medium text-sm hover:bg-white/90 transition-colors"
          onClick={onApply}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Apply Palette
        </motion.button>
      </div>

      {/* Color Columns */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <AnimatePresence mode="sync">
          {colors.map((color, index) => (
            <ColorEditorColumn
              key={`${color.hex}-${index}`}
              color={color}
              index={index}
              moodId={mood.id}
              isHovered={hoveredIndex === index}
              colorInputRefs={colorInputRefs}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onColorInput={handleColorInput}
              onEditClick={handleEditClick}
              onCopy={handleCopy}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Controls - Refinement Sliders */}
      <RefinementSliders
        visible={true}
        variant="overlay"
        refinements={refinements}
        onRefinementChange={onRefinementChange}
        onRegenerate={onRegenerate}
      />
    </motion.div>
  );
});

// Separate component for each color column to prevent unnecessary re-renders
interface ColorEditorColumnProps {
  color: Color;
  index: number;
  moodId: string;
  isHovered: boolean;
  colorInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onColorInput: (index: number, hex: string) => void;
  onEditClick: (index: number, e: React.MouseEvent) => void;
  onCopy: (hex: string) => void;
}

const ColorEditorColumn = memo(function ColorEditorColumn({
  color,
  index,
  moodId,
  isHovered,
  colorInputRefs,
  onMouseEnter,
  onMouseLeave,
  onColorInput,
  onEditClick,
  onCopy,
}: ColorEditorColumnProps) {
  const [copied, setCopied] = useState(false);

  const { textColor, textColorMuted, bgHover } = useMemo(
    () => ({
      textColor: color.contrastColor === "white" ? "#ffffff" : "#000000",
      textColorMuted:
        color.contrastColor === "white"
          ? "rgba(255,255,255,0.6)"
          : "rgba(0,0,0,0.5)",
      bgHover:
        color.contrastColor === "white"
          ? "rgba(255,255,255,0.15)"
          : "rgba(0,0,0,0.1)",
    }),
    [color.contrastColor]
  );

  const handleCopy = useCallback(async () => {
    await onCopy(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [color.hex, onCopy]);

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center relative min-h-[100px] cursor-pointer transition-colors duration-150"
      style={{ backgroundColor: color.hex }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => onEditClick(index, e)}
    >
      {/* Hidden color input */}
      <input
        ref={(el) => {
          colorInputRefs.current[index] = el;
        }}
        type="color"
        value={color.hex}
        onChange={(e) => onColorInput(index, e.target.value)}
        className="sr-only"
        aria-label={`Edit color ${index + 1}`}
      />

      {/* Edit button */}
      <motion.button
        className="absolute top-4 left-4 p-2 rounded-lg transition-colors"
        style={{
          backgroundColor: isHovered ? bgHover : "transparent",
        }}
        initial={false}
        animate={{
          opacity: isHovered ? 0.9 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
        onClick={(e) => onEditClick(index, e)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={textColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </motion.button>

      {/* Color info */}
      <div className="text-center">
        <button
          className="text-lg md:text-xl font-mono font-semibold tracking-wider px-3 py-1 rounded-lg transition-colors hover:scale-105 active:scale-95"
          style={{
            color: textColor,
            backgroundColor: isHovered ? bgHover : "transparent",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
        >
          {copied ? "Copied!" : color.hex}
        </button>
        <div
          className="text-xs md:text-sm mt-1 opacity-70"
          style={{ color: textColor }}
        >
          {color.name}
        </div>
      </div>

      {/* Bottom index indicator */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-mono opacity-30"
        style={{ color: textColorMuted }}
      >
        {index + 1}
      </div>
    </div>
  );
});
