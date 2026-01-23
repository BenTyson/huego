"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore, useHarmonyType } from "@/store/palette";
import { useIsPremium } from "@/store/subscription";
import type { HarmonyType } from "@/lib/types";
import { FREE_HARMONIES } from "@/lib/types";

const harmonyOptions: { value: HarmonyType; label: string; premium?: boolean }[] = [
  { value: "random", label: "Random" },
  { value: "analogous", label: "Analogous" },
  { value: "complementary", label: "Complementary" },
  { value: "triadic", label: "Triadic", premium: true },
  { value: "split-complementary", label: "Split Comp.", premium: true },
  { value: "monochromatic", label: "Mono", premium: true },
];

interface HarmonySelectorProps {
  onUpgradeClick?: () => void;
}

export function HarmonySelector({ onUpgradeClick }: HarmonySelectorProps) {
  const harmonyType = useHarmonyType();
  const { setHarmonyType } = usePaletteStore();
  const isPremium = useIsPremium();
  const [showPicker, setShowPicker] = useState(false);

  const isHarmonyLocked = (harmony: HarmonyType) => {
    if (isPremium) return false;
    return !FREE_HARMONIES.includes(harmony);
  };

  return (
    <div className="relative">
      <motion.button
        className="h-10 px-4 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/50 transition-colors text-sm font-medium flex items-center gap-2"
        onClick={() => setShowPicker(!showPicker)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
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
          {harmonyOptions.find((h) => h.value === harmonyType)?.label}
        </span>
      </motion.button>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            className="absolute bottom-full mb-2 left-0 p-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 min-w-[140px]"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
          >
            {harmonyOptions.map((option) => {
              const locked = isHarmonyLocked(option.value);
              return (
                <button
                  key={option.value}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between gap-2 ${
                    harmonyType === option.value && !locked
                      ? "bg-white/20 text-white"
                      : locked
                      ? "text-white/40 hover:text-white/60"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => {
                    if (locked && onUpgradeClick) {
                      onUpgradeClick();
                      setShowPicker(false);
                    } else if (!locked) {
                      setHarmonyType(option.value);
                      setShowPicker(false);
                    }
                  }}
                >
                  <span>{option.label}</span>
                  {locked && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-amber-500 flex-shrink-0"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
