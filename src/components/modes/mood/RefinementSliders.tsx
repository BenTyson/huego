"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { RefinementValues } from "@/lib/mood";

interface RefinementSlidersProps {
  visible: boolean;
  refinements: RefinementValues;
  onRefinementChange: (key: keyof RefinementValues, value: number) => void;
  onRegenerate: () => void;
}

export function RefinementSliders({
  visible,
  refinements,
  onRefinementChange,
  onRegenerate,
}: RefinementSlidersProps) {
  return (
    <AnimatePresence>
      {visible && (
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
                onRefinementChange("temperature", parseFloat(e.target.value))
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
                onRefinementChange("vibrancy", parseFloat(e.target.value))
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
                onRefinementChange("brightness", parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gradient-to-r from-zinc-800 via-zinc-500 to-white rounded-full appearance-none cursor-pointer slider-thumb"
            />
          </div>

          {/* Regenerate Button */}
          <motion.button
            className="w-full py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            onClick={onRegenerate}
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
  );
}
