"use client";

import { motion } from "framer-motion";
import { usePaletteStore } from "@/store/palette";

export function GenerateButton() {
  const { generate } = usePaletteStore();

  return (
    <motion.button
      className="
        h-10 px-5 rounded-full
        bg-primary-cta text-primary-cta-text
        font-medium text-sm
        flex items-center gap-2.5
        shadow-lg shadow-black/20
        hover:shadow-xl hover:shadow-black/25
        transition-shadow duration-200
      "
      onClick={() => generate()}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        delay: 0.2,
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
      </svg>
      <span>Generate</span>
      <kbd className="text-[10px] font-mono opacity-50 bg-black/10 px-1.5 py-0.5 rounded">
        Space
      </kbd>
    </motion.button>
  );
}
