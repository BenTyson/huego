"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  generateMoodPalette,
  getMoodsByCategory,
  type MoodCategory,
  type RefinementValues,
} from "@/lib/mood";
import type { Color } from "@/lib/types";

interface MoodPaletteCache {
  [moodId: string]: Color[];
}

const defaultRefinements: RefinementValues = {
  temperature: 0,
  vibrancy: 0,
  brightness: 0,
};

/**
 * Hook to pre-generate and cache palettes for moods in a category.
 * Regenerates when category changes (only new moods not in cache).
 */
export function useMoodPaletteCache(
  category: MoodCategory,
  refinements: RefinementValues = defaultRefinements
) {
  const [cache, setCache] = useState<MoodPaletteCache>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const previousCategoryRef = useRef<MoodCategory | null>(null);

  // Generate palettes for all moods in the current category
  useEffect(() => {
    const categoryMoods = getMoodsByCategory(category);
    const moodsToGenerate = categoryMoods.filter((mood) => !cache[mood.id]);

    if (moodsToGenerate.length === 0) return;

    setIsGenerating(true);

    // Generate palettes in batches to avoid blocking the UI
    const generateBatch = async () => {
      const newCache: MoodPaletteCache = {};

      for (const mood of moodsToGenerate) {
        // Small delay to allow UI updates between generations
        await new Promise((resolve) => setTimeout(resolve, 0));
        newCache[mood.id] = generateMoodPalette(mood.id, refinements);
      }

      setCache((prev) => ({ ...prev, ...newCache }));
      setIsGenerating(false);
    };

    generateBatch();
    previousCategoryRef.current = category;
  }, [category, refinements, cache]);

  // Regenerate a specific mood's palette
  const regenerate = useCallback(
    (moodId: string, customRefinements?: RefinementValues) => {
      const newPalette = generateMoodPalette(
        moodId,
        customRefinements || refinements
      );
      setCache((prev) => ({
        ...prev,
        [moodId]: newPalette,
      }));
      return newPalette;
    },
    [refinements]
  );

  // Store for on-demand generated palettes (not in React state to avoid render-time setState)
  const onDemandCacheRef = useRef<MoodPaletteCache>({});

  // Get palette for a specific mood (generates if not cached)
  const getPalette = useCallback(
    (moodId: string): Color[] => {
      // Check React state cache first
      if (cache[moodId]) {
        return cache[moodId];
      }
      // Check ref cache for on-demand generated palettes
      if (onDemandCacheRef.current[moodId]) {
        return onDemandCacheRef.current[moodId];
      }
      // Generate on demand and store in ref (not state) to avoid render-time setState
      const palette = generateMoodPalette(moodId, refinements);
      onDemandCacheRef.current[moodId] = palette;
      return palette;
    },
    [cache, refinements]
  );

  // Clear cache when refinements change significantly
  const clearCache = useCallback(() => {
    setCache({});
  }, []);

  return {
    cache,
    isGenerating,
    regenerate,
    getPalette,
    clearCache,
  };
}
