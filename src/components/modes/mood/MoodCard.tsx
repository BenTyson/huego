"use client";

import { memo } from "react";
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
  const icon = moodIcons[mood.id];

  return (
    <motion.button
      className="relative w-full text-left cursor-pointer"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Color Stripes - 5 horizontal stripes */}
      <motion.div
        className="h-24 sm:h-28 rounded-xl overflow-hidden flex flex-col shadow-lg transition-shadow duration-200 hover:shadow-xl"
        layoutId={`mood-card-${mood.id}`}
      >
        {palette.map((color, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </motion.div>

      {/* Mood Info */}
      <div className="mt-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/10">
          <span className="text-white/70">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white truncate">
            {mood.name}
          </h3>
          <p className="text-xs text-white/40 truncate">{mood.description}</p>
        </div>
      </div>
    </motion.button>
  );
});
