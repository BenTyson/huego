"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore, usePaletteSize, useHarmonyType } from "@/store/palette";
import { useSubscriptionStore } from "@/store/subscription";
import { MIN_PALETTE_SIZE } from "@/lib/feature-limits";
import type { HarmonyType } from "@/lib/types";

const harmonyOptions: { value: HarmonyType; label: string; description: string }[] = [
  { value: "random", label: "Random", description: "Completely random colors" },
  { value: "analogous", label: "Analogous", description: "Adjacent colors on the wheel" },
  { value: "complementary", label: "Complementary", description: "Opposite colors" },
  { value: "triadic", label: "Triadic", description: "Three evenly spaced colors" },
  { value: "split-complementary", label: "Split Comp.", description: "Complement + neighbors" },
  { value: "monochromatic", label: "Mono", description: "Single hue variations" },
];

export function PaletteControls() {
  const paletteSize = usePaletteSize();
  const harmonyType = useHarmonyType();
  const { addColor, removeColor, setHarmonyType } = usePaletteStore();
  const maxSize = useSubscriptionStore((state) => state.getMaxPaletteSize());
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const [showHarmonyPicker, setShowHarmonyPicker] = useState(false);

  const canAdd = paletteSize < maxSize;
  const canRemove = paletteSize > MIN_PALETTE_SIZE;

  return (
    <div className="flex items-center gap-2">
      {/* Size controls */}
      <motion.div
        className="flex items-center gap-0.5 px-1.5 py-1 rounded-full bg-command-bg backdrop-blur-md border border-command-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.25 }}
      >
        <motion.button
          onClick={removeColor}
          disabled={!canRemove}
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            transition-colors duration-150
            ${canRemove
              ? "text-foreground/70 hover:text-foreground hover:bg-command-hover"
              : "text-foreground/25 cursor-not-allowed"
            }
          `}
          whileHover={canRemove ? { scale: 1.05 } : undefined}
          whileTap={canRemove ? { scale: 0.95 } : undefined}
          title="Remove color"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </motion.button>

        <div className="px-2 min-w-[2rem] text-center">
          <span className="text-foreground/90 text-sm font-medium tabular-nums">{paletteSize}</span>
        </div>

        <motion.button
          onClick={() => addColor(isPremium)}
          disabled={!canAdd}
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            transition-colors duration-150
            ${canAdd
              ? "text-foreground/70 hover:text-foreground hover:bg-command-hover"
              : "text-foreground/25 cursor-not-allowed"
            }
          `}
          whileHover={canAdd ? { scale: 1.05 } : undefined}
          whileTap={canAdd ? { scale: 0.95 } : undefined}
          title="Add color"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </motion.button>
      </motion.div>

      {/* Harmony selector */}
      <div className="relative">
        <motion.button
          className="h-10 px-4 rounded-full bg-command-bg backdrop-blur-md border border-command-border text-foreground/80 hover:text-foreground hover:bg-command-hover transition-colors text-sm font-medium flex items-center gap-2"
          onClick={() => setShowHarmonyPicker(!showHarmonyPicker)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 1 0 20" />
            <path d="M12 2a10 10 0 0 0 0 20" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>
          <span className="hidden sm:inline">
            {harmonyOptions.find((h) => h.value === harmonyType)?.label || "Harmony"}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-50"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.button>

        <AnimatePresence>
          {showHarmonyPicker && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowHarmonyPicker(false)}
              />
              {/* Dropdown */}
              <motion.div
                className="absolute bottom-full mb-2 left-0 p-2 rounded-xl bg-command-bg backdrop-blur-md border border-command-border min-w-[180px] z-50 shadow-xl"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                {harmonyOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex flex-col gap-0.5 ${
                      harmonyType === option.value
                        ? "bg-primary/10 text-foreground"
                        : "text-foreground/70 hover:bg-command-hover hover:text-foreground"
                    }`}
                    onClick={() => {
                      setHarmonyType(option.value);
                      setShowHarmonyPicker(false);
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
