"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore } from "@/store/palette";
import { createColor } from "@/lib/colors";
import {
  moodProfiles,
  getMoodGrid,
  generateMoodPalette,
  type RefinementValues,
} from "@/lib/mood";

export function MoodView() {
  const { colors, setColors, setColor } = usePaletteStore();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [refinements, setRefinements] = useState<RefinementValues>({
    temperature: 0,
    vibrancy: 0,
    brightness: 0,
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const colorInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleColorChange = useCallback((index: number, hex: string) => {
    const newColor = createColor(hex);
    setColor(index, newColor);
  }, [setColor]);

  const handleEditClick = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    colorInputRefs.current[index]?.click();
  }, []);

  const moodGrid = getMoodGrid();

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
          <h1 className="text-2xl font-bold text-white mb-2">
            How should it feel?
          </h1>
          <p className="text-zinc-400 mb-8">
            Select a mood to generate a matching palette
          </p>

          {/* Mood Grid */}
          <div className="space-y-3 mb-8">
            {moodGrid.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-4 gap-2">
                {row.map((mood) => (
                  <motion.button
                    key={mood.id}
                    className={`relative p-3 rounded-xl text-center transition-all ${
                      selectedMood === mood.id
                        ? "bg-white text-zinc-900"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                    onClick={() => handleMoodSelect(mood.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-sm font-medium">{mood.name}</span>
                    {selectedMood === mood.id && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-white"
                        layoutId="selectedMood"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            ))}
          </div>

          {/* Refinement Sliders */}
          <AnimatePresence>
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                <h3 className="text-sm font-medium text-zinc-400">
                  Fine-tune your palette
                </h3>

                {/* Temperature Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-zinc-500">Cooler</span>
                    <span className="text-sm text-white font-medium">Temperature</span>
                    <span className="text-sm text-zinc-500">Warmer</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.1"
                    value={refinements.temperature}
                    onChange={(e) =>
                      handleRefinementChange("temperature", parseFloat(e.target.value))
                    }
                    className="w-full h-2 bg-gradient-to-r from-blue-500 via-zinc-500 to-orange-500 rounded-full appearance-none cursor-pointer slider-thumb"
                  />
                </div>

                {/* Vibrancy Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-zinc-500">Subtle</span>
                    <span className="text-sm text-white font-medium">Vibrancy</span>
                    <span className="text-sm text-zinc-500">Vibrant</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.1"
                    value={refinements.vibrancy}
                    onChange={(e) =>
                      handleRefinementChange("vibrancy", parseFloat(e.target.value))
                    }
                    className="w-full h-2 bg-gradient-to-r from-zinc-600 via-zinc-400 to-pink-500 rounded-full appearance-none cursor-pointer slider-thumb"
                  />
                </div>

                {/* Brightness Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-zinc-500">Dark</span>
                    <span className="text-sm text-white font-medium">Brightness</span>
                    <span className="text-sm text-zinc-500">Light</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.1"
                    value={refinements.brightness}
                    onChange={(e) =>
                      handleRefinementChange("brightness", parseFloat(e.target.value))
                    }
                    className="w-full h-2 bg-gradient-to-r from-zinc-800 via-zinc-500 to-white rounded-full appearance-none cursor-pointer slider-thumb"
                  />
                </div>

                {/* Regenerate Button */}
                <motion.button
                  className="w-full py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                  onClick={handleRegenerate}
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
                  >
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 16h5v5" />
                  </svg>
                  Generate New Variation
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Palette Preview */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <AnimatePresence mode="sync">
          {colors.map((color, index) => {
            const textColor = color.contrastColor === "white" ? "#ffffff" : "#000000";
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
                  ref={(el) => { colorInputRefs.current[index] = el; }}
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
