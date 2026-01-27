"use client";

import { motion } from "framer-motion";
import { useUIStore, usePaletteLayout } from "@/store/ui";

interface LayoutToggleProps {
  className?: string;
}

export function LayoutToggle({ className = "" }: LayoutToggleProps) {
  const paletteLayout = usePaletteLayout();
  const { togglePaletteLayout } = useUIStore();

  const isStrips = paletteLayout === "strips";

  return (
    <motion.button
      onClick={togglePaletteLayout}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors bg-black/20 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/30 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isStrips ? "Switch to column layout" : "Switch to strip layout"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isStrips ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Layout icon - vertical bars that rotate to horizontal */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="5" height="18" rx="1" />
          <rect x="10" y="3" width="5" height="18" rx="1" />
          <rect x="17" y="3" width="4" height="18" rx="1" />
        </svg>
      </motion.div>
    </motion.button>
  );
}
