"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import type { MoodProfile } from "@/lib/mood";
import type { Color } from "@/lib/types";
import { moodIcons } from "@/lib/mood-icons";

interface MoodCardProps {
  mood: MoodProfile;
  palette: Color[];
  index: number;
  onClick: () => void;
}

export const MoodCard = memo(function MoodCard({
  mood,
  palette,
  index,
  onClick,
}: MoodCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const icon = moodIcons[mood.id];

  return (
    <motion.button
      className="relative w-full text-left group"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Color Stripes - 5 horizontal stripes */}
      <motion.div
        className="h-24 sm:h-28 rounded-xl overflow-hidden flex flex-col shadow-lg"
        layoutId={`mood-card-${mood.id}`}
        animate={{
          boxShadow: isHovered
            ? "0 20px 40px -12px rgba(0, 0, 0, 0.35)"
            : "0 10px 20px -8px rgba(0, 0, 0, 0.25)",
        }}
        transition={{ duration: 0.2 }}
      >
        {palette.map((color, i) => (
          <motion.div
            key={i}
            className="flex-1 transition-transform duration-200"
            layoutId={`mood-${mood.id}-color-${i}`}
            style={{
              backgroundColor: color.hex,
              transform: isHovered ? "scaleX(1.02)" : "scaleX(1)",
            }}
          />
        ))}
      </motion.div>

      {/* Mood Info */}
      <div className="mt-3 flex items-center gap-2">
        <div
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
            transition-colors duration-200
            ${isHovered ? "bg-white/15" : "bg-white/10"}
          `}
        >
          <span className="text-white/70">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white truncate">
            {mood.name}
          </h3>
          <p className="text-xs text-white/40 truncate">{mood.description}</p>
        </div>
      </div>

      {/* Hover Overlay with hex codes */}
      <motion.div
        className="absolute inset-0 h-24 sm:h-28 rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex flex-wrap justify-center gap-1 px-2">
          {palette.map((color, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded bg-black/40 text-white/90 text-xs font-mono"
            >
              {color.hex}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.button>
  );
});
