"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useCommunityStore, useFilters } from "@/store/community";
import type { SortOption } from "@/lib/community-types";
import { MOOD_TAGS } from "@/lib/community-types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "most_liked", label: "Most Liked" },
];

export function ExploreFilterBar() {
  const filters = useFilters();
  const { setFilters, resetFilters } = useCommunityStore();
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      if (searchValue !== filters.search) {
        setFilters({ search: searchValue });
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchValue, filters.search, setFilters]);

  const handleSortChange = useCallback(
    (sort: SortOption) => {
      setFilters({ sort });
      setShowSortDropdown(false);
    },
    [setFilters]
  );

  const handleTagToggle = useCallback(
    (tag: string) => {
      const newTags = filters.tags.includes(tag)
        ? filters.tags.filter((t) => t !== tag)
        : [...filters.tags, tag];
      setFilters({ tags: newTags });
    },
    [filters.tags, setFilters]
  );

  const hasActiveFilters = filters.search || filters.tags.length > 0 || filters.sort !== "newest";

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <input
          type="text"
          placeholder="Search palettes..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>

      {/* Sort Dropdown */}
      <div className="relative">
        <motion.button
          className="h-10 px-4 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/50 transition-colors text-sm font-medium flex items-center gap-2"
          onClick={() => setShowSortDropdown(!showSortDropdown)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{SORT_OPTIONS.find((o) => o.value === filters.sort)?.label}</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.button>

        {showSortDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
            <motion.div
              className="absolute top-full mt-2 right-0 p-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 min-w-[140px] z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.sort === option.value
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => handleSortChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </div>

      {/* Tags Dropdown */}
      <div className="relative">
        <motion.button
          className="h-10 px-4 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/50 transition-colors text-sm font-medium flex items-center gap-2"
          onClick={() => setShowTagDropdown(!showTagDropdown)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>
            Tags{filters.tags.length > 0 && ` (${filters.tags.length})`}
          </span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.button>

        {showTagDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowTagDropdown(false)} />
            <motion.div
              className="absolute top-full mt-2 right-0 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 min-w-[200px] max-w-[280px] z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap gap-2">
                {MOOD_TAGS.map((tag) => (
                  <button
                    key={tag}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filters.tags.includes(tag)
                        ? "bg-white text-zinc-900"
                        : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                    }`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Reset Filters */}
      {hasActiveFilters && (
        <motion.button
          className="h-10 px-4 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors text-sm"
          onClick={resetFilters}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Clear
        </motion.button>
      )}
    </div>
  );
}
