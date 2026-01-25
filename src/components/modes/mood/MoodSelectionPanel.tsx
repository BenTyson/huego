"use client";

import { motion } from "framer-motion";
import { moodProfiles, type MoodProfile } from "@/lib/mood";

// Mood icons mapping
const moodIcons: Record<string, React.ReactNode> = {
  calm: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M9 9h.01M15 9h.01" />
    </svg>
  ),
  bold: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  playful: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M9 9l.01 0M15 9l.01 0" />
      <path d="M9 9c0 .5-.5 1-1 1s-1-.5-1-1 .5-1 1-1 1 .5 1 1z" fill="currentColor" />
      <path d="M17 9c0 .5-.5 1-1 1s-1-.5-1-1 .5-1 1-1 1 .5 1 1z" fill="currentColor" />
    </svg>
  ),
  professional: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="12.01" />
    </svg>
  ),
  warm: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  cool: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v20M17 7l-5 5-5-5M7 17l5-5 5 5" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  retro: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  ),
  futuristic: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  natural: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22V8" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
      <path d="M12 8a4 4 0 0 0-4-4 4 4 0 0 0 4 4z" fill="currentColor" opacity="0.2" />
      <path d="M12 8a4 4 0 0 1 4-4 4 4 0 0 1-4 4z" fill="currentColor" opacity="0.2" />
      <path d="M12 8a4 4 0 0 0-4-4 4 4 0 0 0 4 4z" />
      <path d="M12 8a4 4 0 0 1 4-4 4 4 0 0 1-4 4z" />
    </svg>
  ),
  urban: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
    </svg>
  ),
  luxurious: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
    </svg>
  ),
  minimal: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
};

// Mood color previews (representative colors for each mood)
const moodColors: Record<string, string[]> = {
  calm: ["#A8D5E5", "#B8E0D2", "#D6EAF8"],
  bold: ["#E74C3C", "#F39C12", "#9B59B6"],
  playful: ["#FF6B9D", "#FFD93D", "#6BCB77"],
  professional: ["#2C3E50", "#5D6D7E", "#85929E"],
  warm: ["#E67E22", "#D35400", "#F5B041"],
  cool: ["#3498DB", "#5DADE2", "#85C1E9"],
  retro: ["#D4A574", "#C19A6B", "#E6BE8A"],
  futuristic: ["#8E44AD", "#3498DB", "#1ABC9C"],
  natural: ["#27AE60", "#82E0AA", "#A9DFBF"],
  urban: ["#34495E", "#7F8C8D", "#BDC3C7"],
  luxurious: ["#6C3483", "#8E44AD", "#BB8FCE"],
  minimal: ["#F8F9FA", "#E9ECEF", "#DEE2E6"],
};

interface MoodSelectionPanelProps {
  selectedMood: string | null;
  onMoodSelect: (moodId: string) => void;
}

export function MoodSelectionPanel({ selectedMood, onMoodSelect }: MoodSelectionPanelProps) {
  return (
    <div className="space-y-2 mb-8">
      {moodProfiles.map((mood: MoodProfile, index) => {
        const isSelected = selectedMood === mood.id;
        const colors = moodColors[mood.id] || ["#888", "#999", "#AAA"];

        return (
          <motion.button
            key={mood.id}
            className={`
              relative w-full p-3 rounded-xl text-left transition-all
              ${isSelected
                ? "bg-white text-zinc-900 shadow-lg shadow-white/10"
                : "bg-white/5 text-white hover:bg-white/10 border border-white/5 hover:border-white/10"
              }
            `}
            onClick={() => onMoodSelect(mood.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
            whileHover={{ scale: 1.01, x: 4 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                ${isSelected ? "bg-zinc-100" : "bg-white/10"}
              `}>
                <span className={isSelected ? "text-zinc-700" : "text-white/70"}>
                  {moodIcons[mood.id]}
                </span>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{mood.name}</span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-1.5 h-1.5 rounded-full bg-green-500"
                    />
                  )}
                </div>
                <p className={`text-xs truncate ${isSelected ? "text-zinc-500" : "text-white/50"}`}>
                  {mood.description}
                </p>
              </div>

              {/* Color preview dots */}
              <div className="flex gap-1 flex-shrink-0">
                {colors.map((color, i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.03 + i * 0.05 }}
                  />
                ))}
              </div>
            </div>

            {/* Selected indicator line */}
            {isSelected && (
              <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-zinc-900 rounded-r-full"
                layoutId="selectedMoodIndicator"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
