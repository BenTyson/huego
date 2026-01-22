"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore, useHarmonyType } from "@/store/palette";
import type { HarmonyType } from "@/lib/types";

const harmonyOptions: { value: HarmonyType; label: string }[] = [
  { value: "random", label: "Random" },
  { value: "analogous", label: "Analogous" },
  { value: "complementary", label: "Complementary" },
  { value: "triadic", label: "Triadic" },
  { value: "split-complementary", label: "Split Comp." },
  { value: "monochromatic", label: "Mono" },
];

export function HarmonySelector() {
  const harmonyType = useHarmonyType();
  const { setHarmonyType } = usePaletteStore();
  const [showPicker, setShowPicker] = useState(false);

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
            className="absolute bottom-full mb-2 left-0 p-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
          >
            {harmonyOptions.map((option) => (
              <button
                key={option.value}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  harmonyType === option.value
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => {
                  setHarmonyType(option.value);
                  setShowPicker(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
