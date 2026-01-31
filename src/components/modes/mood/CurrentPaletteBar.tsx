"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useColors } from "@/store/palette";

interface CurrentPaletteBarProps {
  onUseCurrent: () => void;
}

export function CurrentPaletteBar({ onUseCurrent }: CurrentPaletteBarProps) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(true);

  if (colors.length === 0) return null;

  return (
    <div className="mb-6">
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            className="bg-white/5 rounded-xl border border-white/10 p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/70">
                  Your palette
                </span>
                <span className="text-xs text-white/30">
                  {colors.length} color{colors.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors"
                  onClick={onUseCurrent}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Edit Current
                </motion.button>
                <button
                  className="p-1 rounded text-white/30 hover:text-white/60 transition-colors"
                  onClick={() => setExpanded(false)}
                  title="Collapse"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Color swatches */}
            <div className="flex items-center gap-2 flex-wrap">
              {colors.map((color, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded-full border border-white/15 flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            className="w-full h-1.5 rounded-full overflow-hidden flex cursor-pointer hover:h-2 transition-all"
            onClick={() => setExpanded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            title="Expand palette bar"
          >
            {colors.map((color, i) => (
              <div
                key={i}
                className="flex-1 h-full"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
