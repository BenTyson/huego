"use client";

import { useRef, useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { MOOD_CATEGORIES, type MoodCategory } from "@/lib/mood";

// Category tab icons
const categoryIcons: Record<string, React.ReactNode> = {
  heart: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  sun: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  leaf: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22V8" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
      <path d="M12 8a4 4 0 0 0-4-4 4 4 0 0 0 4 4z" />
      <path d="M12 8a4 4 0 0 1 4-4 4 4 0 0 1-4 4z" />
    </svg>
  ),
  palette: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  ),
  briefcase: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  globe: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2c3 3 5 6 5 10s-2 7-5 10" />
      <path d="M12 2c-3 3-5 6-5 10s2 7 5 10" />
      <path d="M2 12h20" />
    </svg>
  ),
  shapes: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2l3 6h-6l3-6z" />
      <rect x="2" y="14" width="6" height="6" rx="1" />
      <circle cx="19" cy="17" r="3" />
    </svg>
  ),
};

interface MoodHeaderProps {
  selectedCategory: MoodCategory;
  onCategoryChange: (category: MoodCategory) => void;
}

export const MoodHeader = memo(function MoodHeader({
  selectedCategory,
  onCategoryChange,
}: MoodHeaderProps) {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  // Handle scroll indicators for tabs
  useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;

    const updateFades = () => {
      setShowLeftFade(container.scrollLeft > 0);
      setShowRightFade(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    };

    updateFades();
    container.addEventListener("scroll", updateFades);
    window.addEventListener("resize", updateFades);

    return () => {
      container.removeEventListener("scroll", updateFades);
      window.removeEventListener("resize", updateFades);
    };
  }, []);

  return (
    <div className="space-y-4 mb-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-purple-300"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <path d="M9 9h.01M15 9h.01" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">
            How should it feel?
          </h1>
          <p className="text-sm text-zinc-500">84 moods across 7 categories</p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

      {/* Category Tabs */}
      <div className="relative">
        {/* Left fade indicator */}
        {showLeftFade && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-900 to-transparent z-10 pointer-events-none" />
        )}

        {/* Right fade indicator */}
        {showRightFade && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-900 to-transparent z-10 pointer-events-none" />
        )}

        <div
          ref={tabsContainerRef}
          className="flex gap-1 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {MOOD_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category.id;
            const Icon = categoryIcons[category.icon];

            return (
              <motion.button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                  whitespace-nowrap flex-shrink-0 transition-colors
                  ${
                    isActive
                      ? "bg-white text-zinc-900"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={isActive ? "text-zinc-600" : "text-white/50"}>
                  {Icon}
                </span>
                {category.name}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white rounded-full"
                    layoutId="categoryIndicator"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
});
