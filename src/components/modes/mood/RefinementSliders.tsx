"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { RefinementValues } from "@/lib/mood";

interface RefinementSlidersProps {
  visible: boolean;
  variant?: "sidebar" | "overlay";
  refinements: RefinementValues;
  onRefinementChange: (key: keyof RefinementValues, value: number) => void;
  onRegenerate?: () => void;
}

export function RefinementSliders({
  visible,
  variant = "sidebar",
  refinements,
  onRefinementChange,
  onRegenerate,
}: RefinementSlidersProps) {
  const isOverlay = variant === "overlay";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: isOverlay ? 20 : 0, height: isOverlay ? "auto" : 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: isOverlay ? 20 : 0, height: isOverlay ? "auto" : 0 }}
          className={
            isOverlay
              ? "fixed left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-white/10 z-20"
              : "space-y-6"
          }
          style={isOverlay ? { bottom: 'max(5rem, calc(env(safe-area-inset-bottom) + 4.5rem))' } : undefined}
        >
          {isOverlay ? (
            // Overlay variant - horizontal layout
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                {/* Sliders */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* Temperature Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Cooler</span>
                      <span className="text-white/70 font-medium">Temperature</span>
                      <span className="text-zinc-500">Warmer</span>
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
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Subtle</span>
                      <span className="text-white/70 font-medium">Vibrancy</span>
                      <span className="text-zinc-500">Vibrant</span>
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
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Dark</span>
                      <span className="text-white/70 font-medium">Brightness</span>
                      <span className="text-zinc-500">Light</span>
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
                </div>

                {/* Regenerate Button */}
                {onRegenerate && (
                  <motion.button
                    className="flex-shrink-0 px-6 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
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
                    <span className="hidden sm:inline">Regenerate</span>
                  </motion.button>
                )}
              </div>
            </div>
          ) : (
            // Sidebar variant - vertical layout (original)
            <>
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
              {onRegenerate && (
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
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
