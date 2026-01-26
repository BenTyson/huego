"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { usePaletteStore } from "@/store/palette";
import { generateRandomColor } from "@/lib/generate";
import type { Color } from "@/lib/types";

const SWIPE_THRESHOLD = 100;
const MAX_PALETTE_SIZE = 5;

export function PlaygroundView() {
  const { setColors } = usePaletteStore();
  const [currentCard, setCurrentCard] = useState<Color>(generateRandomColor());
  const [buildingPalette, setBuildingPalette] = useState<Color[]>([]);
  const [exitX, setExitX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const isComplete = buildingPalette.length >= MAX_PALETTE_SIZE;

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (isAnimating || isComplete) return;

      setIsAnimating(true);
      setExitX(direction === "right" ? 300 : -300);

      setTimeout(() => {
        if (direction === "right") {
          // Add to palette
          const newPalette = [...buildingPalette, currentCard];
          setBuildingPalette(newPalette);

          if (newPalette.length >= MAX_PALETTE_SIZE) {
            // Palette complete, save it
            setColors(newPalette);
          }
        }

        // Generate new card
        setCurrentCard(generateRandomColor());
        setExitX(0);
        setIsAnimating(false);
      }, 200);
    },
    [currentCard, buildingPalette, setColors, isAnimating, isComplete]
  );

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
        handleSwipe(info.offset.x > 0 ? "right" : "left");
      }
    },
    [handleSwipe]
  );

  const handleReset = useCallback(() => {
    setBuildingPalette([]);
    setCurrentCard(generateRandomColor());
  }, []);

  const handleRemoveColor = useCallback((index: number) => {
    setBuildingPalette((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="h-dvh w-screen flex flex-col items-center justify-center bg-zinc-900 p-6 overflow-hidden">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white mb-2">
          {isComplete ? "Palette Complete!" : "Build Your Palette"}
        </h1>
        <p className="text-zinc-400">
          {isComplete
            ? "Your palette has been saved"
            : `Swipe right to add, left to skip (${buildingPalette.length}/${MAX_PALETTE_SIZE})`}
        </p>
      </motion.div>

      {/* Card Stack */}
      <div className="relative w-64 h-80 mb-8">
        {/* Background cards for depth */}
        {!isComplete && (
          <>
            <motion.div
              className="absolute inset-0 rounded-3xl bg-zinc-800 transform scale-90 translate-y-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 0.9 }}
            />
            <motion.div
              className="absolute inset-0 rounded-3xl bg-zinc-700 transform scale-95 translate-y-2"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 0.5, scale: 0.95 }}
            />
          </>
        )}

        {/* Current Card */}
        <AnimatePresence mode="wait">
          {!isComplete && (
            <motion.div
              key={currentCard.hex}
              className="absolute inset-0 rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing flex flex-col items-center justify-center"
              style={{ backgroundColor: currentCard.hex }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: 0, rotate: 0 }}
              exit={{
                x: exitX,
                opacity: 0,
                rotate: exitX > 0 ? 15 : -15,
                transition: { duration: 0.2 },
              }}
              drag={!isAnimating ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              whileDrag={{ scale: 1.05 }}
            >
              {/* Swipe indicators */}
              <motion.div
                className="absolute top-6 left-6 px-4 py-2 rounded-full bg-red-500/80 text-white font-bold text-lg"
                initial={{ opacity: 0 }}
                style={{ opacity: 0 }}
                whileHover={{ opacity: 0 }}
              >
                NOPE
              </motion.div>
              <motion.div
                className="absolute top-6 right-6 px-4 py-2 rounded-full bg-green-500/80 text-white font-bold text-lg"
                initial={{ opacity: 0 }}
                style={{ opacity: 0 }}
                whileHover={{ opacity: 0 }}
              >
                LIKE
              </motion.div>

              {/* Color Info */}
              <div className="text-center">
                <div
                  className="text-2xl font-mono font-bold tracking-wider mb-2"
                  style={{
                    color:
                      currentCard.contrastColor === "white" ? "#ffffff" : "#000000",
                  }}
                >
                  {currentCard.hex}
                </div>
                <div
                  className="text-sm opacity-70"
                  style={{
                    color:
                      currentCard.contrastColor === "white" ? "#ffffff" : "#000000",
                  }}
                >
                  {currentCard.name}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Complete state */}
        {isComplete && (
          <motion.div
            className="absolute inset-0 rounded-3xl bg-white/10 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <div className="text-white font-medium">Nice choices!</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      {!isComplete && (
        <div className="flex items-center gap-6 mb-8">
          <motion.button
            className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center"
            onClick={() => handleSwipe("left")}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.3)" }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>

          <motion.button
            className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center"
            onClick={() => handleSwipe("right")}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(34, 197, 94, 0.3)" }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </motion.button>
        </div>
      )}

      {/* Building Palette Preview */}
      <div className="flex items-center gap-2">
        {Array.from({ length: MAX_PALETTE_SIZE }).map((_, index) => {
          const color = buildingPalette[index];
          return (
            <motion.div
              key={index}
              className={`relative w-12 h-12 rounded-xl ${
                color ? "cursor-pointer" : "bg-zinc-800 border-2 border-dashed border-zinc-700"
              }`}
              style={color ? { backgroundColor: color.hex } : undefined}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: color ? 1 : 0.8,
                opacity: color ? 1 : 0.5,
              }}
              whileHover={color ? { scale: 1.1 } : {}}
              onClick={() => color && handleRemoveColor(index)}
            >
              {color && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 rounded-xl transition-opacity"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Reset Button */}
      {(buildingPalette.length > 0 || isComplete) && (
        <motion.button
          className="mt-6 px-6 py-2 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
          onClick={handleReset}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Start Over
        </motion.button>
      )}
    </div>
  );
}
