"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore, useColors } from "@/store/palette";
import { createColor } from "@/lib/colors";
import { generateMoodPalette, type RefinementValues } from "@/lib/mood";
import { MoodSelectionPanel } from "./MoodSelectionPanel";
import { RefinementSliders } from "./RefinementSliders";

export function MoodView() {
  // Use individual selectors for optimized re-renders
  const colors = useColors();
  const { setColors, setColor } = usePaletteStore();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [refinements, setRefinements] = useState<RefinementValues>({
    temperature: 0,
    vibrancy: 0,
    brightness: 0,
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const colorInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleColorChange = useCallback(
    (index: number, hex: string) => {
      const newColor = createColor(hex);
      setColor(index, newColor);
    },
    [setColor]
  );

  const handleEditClick = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    colorInputRefs.current[index]?.click();
  }, []);

  const handleMoodSelect = useCallback(
    (moodId: string) => {
      setSelectedMood(moodId);
      const newColors = generateMoodPalette(moodId, refinements);
      setColors(newColors);
    },
    [refinements, setColors]
  );

  const handleRefinementChange = useCallback(
    (key: keyof RefinementValues, value: number) => {
      const newRefinements = { ...refinements, [key]: value };
      setRefinements(newRefinements);

      if (selectedMood) {
        const newColors = generateMoodPalette(selectedMood, newRefinements);
        setColors(newColors);
      }
    },
    [selectedMood, refinements, setColors]
  );

  const handleRegenerate = useCallback(() => {
    if (selectedMood) {
      const newColors = generateMoodPalette(selectedMood, refinements);
      setColors(newColors);
    }
  }, [selectedMood, refinements, setColors]);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-zinc-900">
      {/* Mood Selection Panel */}
      <div className="w-full md:w-96 flex-shrink-0 p-6 md:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-purple-300"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <path d="M9 9h.01M15 9h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">
                How should it feel?
              </h1>
              <p className="text-sm text-zinc-500">
                Select a mood to generate colors
              </p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent mb-6" />

          {/* Mood Grid */}
          <MoodSelectionPanel
            selectedMood={selectedMood}
            onMoodSelect={handleMoodSelect}
          />

          {/* Refinement Sliders */}
          <RefinementSliders
            visible={!!selectedMood}
            refinements={refinements}
            onRefinementChange={handleRefinementChange}
            onRegenerate={handleRegenerate}
          />
        </motion.div>
      </div>

      {/* Palette Preview */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <AnimatePresence mode="sync">
          {colors.map((color, index) => {
            // Memoize text color calculations
            const textColor =
              color.contrastColor === "white" ? "#ffffff" : "#000000";
            const isHovered = hoveredIndex === index;
            return (
              <motion.div
                key={index}
                className="flex-1 flex flex-col items-center justify-center relative min-h-[80px] cursor-pointer"
                style={{ backgroundColor: color.hex }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Hidden color input */}
                <input
                  ref={(el) => {
                    colorInputRefs.current[index] = el;
                  }}
                  type="color"
                  value={color.hex}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="sr-only"
                  aria-label={`Edit color ${index + 1}`}
                />

                {/* Edit button */}
                <motion.button
                  className="absolute top-4 left-4 p-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: isHovered
                      ? color.contrastColor === "white"
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(0,0,0,0.1)"
                      : "transparent",
                  }}
                  initial={false}
                  animate={{
                    opacity: isHovered ? 0.9 : 0,
                    scale: isHovered ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => handleEditClick(index, e)}
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

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <div
                    className="text-lg md:text-xl font-mono font-semibold tracking-wider"
                    style={{ color: textColor }}
                  >
                    {color.hex}
                  </div>
                  <div
                    className="text-xs md:text-sm mt-1 opacity-70"
                    style={{ color: textColor }}
                  >
                    {color.name}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
