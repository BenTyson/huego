"use client";

import { motion } from "framer-motion";
import { getMoodGrid, type MoodProfile } from "@/lib/mood";

interface MoodSelectionPanelProps {
  selectedMood: string | null;
  onMoodSelect: (moodId: string) => void;
}

export function MoodSelectionPanel({ selectedMood, onMoodSelect }: MoodSelectionPanelProps) {
  const moodGrid = getMoodGrid();

  return (
    <div className="space-y-3 mb-8">
      {moodGrid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-2">
          {row.map((mood: MoodProfile) => (
            <motion.button
              key={mood.id}
              className={`relative p-3 rounded-xl text-center transition-all ${
                selectedMood === mood.id
                  ? "bg-white text-zinc-900"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => onMoodSelect(mood.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-medium">{mood.name}</span>
              {selectedMood === mood.id && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-white"
                  layoutId="selectedMood"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      ))}
    </div>
  );
}
