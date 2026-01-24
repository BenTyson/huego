"use client";

import { motion } from "framer-motion";

interface HarmonizeToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function HarmonizeToggle({ enabled, onChange }: HarmonizeToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-10 h-6 rounded-full transition-colors ${
          enabled ? "bg-amber-500" : "bg-zinc-700"
        }`}
      >
        <motion.div
          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
          animate={{ x: enabled ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
      <span className="text-sm text-zinc-400">
        Harmonize colors for better palette cohesion
      </span>
    </div>
  );
}
