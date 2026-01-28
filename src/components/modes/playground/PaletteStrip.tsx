"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Color } from "@/lib/types";

interface PaletteStripProps {
  colors: Color[];
  maxSize: number;
  onRemove: (index: number) => void;
}

export function PaletteStrip({ colors, maxSize, onRemove }: PaletteStripProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Swatch row */}
      <div className="flex items-center gap-2">
        <AnimatePresence mode="popLayout">
          {colors.map((color, index) => (
            <motion.button
              key={`${color.hex}-${index}`}
              layoutId={`swatch-${index}`}
              className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow-lg shadow-black/20 cursor-pointer flex-shrink-0"
              style={{ backgroundColor: color.hex }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(index)}
              title={`${color.name} — tap to remove`}
            >
              {/* Remove overlay on hover */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.div>
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Empty slots */}
        {Array.from({ length: maxSize - colors.length }).map((_, i) => (
          <motion.div
            key={`empty-${i}`}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-dashed flex-shrink-0 ${
              i === 0
                ? "border-white/30 animate-pulse"
                : "border-zinc-700"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: i === 0 ? 0.7 : 0.3 }}
          />
        ))}
      </div>

      {/* Count label */}
      <span className="text-xs text-zinc-500 font-medium tabular-nums">
        {colors.length} / {maxSize}
      </span>
    </div>
  );
}
