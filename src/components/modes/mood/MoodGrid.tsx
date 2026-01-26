"use client";

import { memo } from "react";
import { AnimatePresence } from "framer-motion";
import { getMoodsByCategory, type MoodCategory } from "@/lib/mood";
import type { Color } from "@/lib/types";
import { MoodCard } from "./MoodCard";

interface MoodGridProps {
  selectedCategory: MoodCategory;
  cache: Record<string, Color[]>;
  onMoodSelect: (moodId: string) => void;
  getPalette: (moodId: string) => Color[];
}

export const MoodGrid = memo(function MoodGrid({
  selectedCategory,
  cache,
  onMoodSelect,
  getPalette,
}: MoodGridProps) {
  const categoryMoods = getMoodsByCategory(selectedCategory);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <AnimatePresence mode="popLayout">
        {categoryMoods.map((mood, index) => {
          const palette = cache[mood.id] || getPalette(mood.id);
          return (
            <MoodCard
              key={mood.id}
              mood={mood}
              palette={palette}
              index={index}
              onClick={() => onMoodSelect(mood.id)}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
});
