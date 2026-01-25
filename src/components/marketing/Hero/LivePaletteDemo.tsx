"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generatePalette } from "@/lib/generate";
import type { Color } from "@/lib/types";

const AUTO_GENERATE_INTERVAL = 4000;

export function LivePaletteDemo() {
  const [colors, setColors] = useState<Color[]>([]);
  const [key, setKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const generate = useCallback(() => {
    const newColors = generatePalette("random", [], 5);
    setColors(newColors);
    setKey((prev) => prev + 1);
  }, []);

  // Initial generation
  useEffect(() => {
    generate();
  }, [generate]);

  // Auto-generate every 4 seconds when not hovered
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      generate();
    }, AUTO_GENERATE_INTERVAL);

    return () => clearInterval(interval);
  }, [generate, isHovered]);

  // Spacebar generation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        generate();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [generate]);

  const handleCopy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div
      className="w-full max-w-3xl mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Palette display */}
      <motion.div
        className="flex h-24 sm:h-32 md:h-40 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-glass-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <AnimatePresence mode="sync">
          {colors.map((color, index) => (
            <motion.div
              key={`${key}-${index}`}
              className="flex-1 relative group cursor-pointer"
              style={{ backgroundColor: color.hex }}
              initial={{ opacity: 0, scaleY: 0.8 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              onClick={() => handleCopy(color.hex)}
            >
              {/* Hex code on hover */}
              <div
                className={`absolute inset-x-0 bottom-0 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                  color.contrastColor === "white" ? "text-white" : "text-black"
                }`}
              >
                <span className="text-xs sm:text-sm font-mono font-medium px-2 py-1 rounded bg-black/20 backdrop-blur-sm">
                  {color.hex.toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Spacebar hint */}
      <motion.div
        className="flex items-center justify-center gap-2 mt-4 text-muted-foreground text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span>Press</span>
        <kbd className="px-2 py-1 rounded bg-glass border border-glass-border font-mono text-xs">
          Space
        </kbd>
        <span>to generate</span>
      </motion.div>
    </div>
  );
}
