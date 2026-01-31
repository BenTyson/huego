"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { usePaletteStore } from "@/store/palette";
import {
  generateMoodPalette,
  applyRefinementsToColors,
  moodProfiles,
  type RefinementValues,
  type MoodCategory,
} from "@/lib/mood";
import type { Color } from "@/lib/types";
import { useMoodPaletteCache } from "@/hooks/useMoodPaletteCache";
import { MoodHeader } from "./MoodHeader";
import { MoodGrid } from "./MoodGrid";
import { MoodEditor } from "./MoodEditor";
import { CurrentPaletteBar } from "./CurrentPaletteBar";

type ViewMode = "browse" | "edit";

export function MoodView() {
  const { setColors } = usePaletteStore();
  const storeColors = usePaletteStore((state) => state.colors);
  const [viewMode, setViewMode] = useState<ViewMode>("browse");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<MoodCategory>("emotions");
  const [refinements, setRefinements] = useState<RefinementValues>({
    temperature: 0,
    vibrancy: 0,
    brightness: 0,
  });

  // Store the base palette (without refinements) for smooth slider adjustments
  const baseColorsRef = useRef<Color[]>([]);
  // Track if we're currently applying refinements (to distinguish from external changes)
  const isApplyingRefinementRef = useRef(false);

  const { cache, getPalette, regenerate } = useMoodPaletteCache(
    selectedCategory,
    refinements
  );

  // Sync baseColorsRef when colors change externally (e.g., global shade shift)
  useEffect(() => {
    if (viewMode === "edit" && !isApplyingRefinementRef.current && storeColors.length > 0) {
      // Colors changed externally - update base and reset refinements
      baseColorsRef.current = storeColors;
      setRefinements({
        temperature: 0,
        vibrancy: 0,
        brightness: 0,
      });
    }
  }, [storeColors, viewMode]);

  // Get the selected mood profile
  const selectedMoodProfile = selectedMood
    ? moodProfiles.find((m) => m.id === selectedMood)
    : null;

  // Handle category change
  const handleCategoryChange = useCallback(
    (category: MoodCategory) => {
      setSelectedCategory(category);
      // If the currently selected mood isn't in the new category, clear it
      if (selectedMood) {
        const mood = moodProfiles.find((m) => m.id === selectedMood);
        if (mood && mood.category !== category) {
          setSelectedMood(null);
        }
      }
    },
    [selectedMood]
  );

  // Handle mood selection from grid
  const handleMoodSelect = useCallback(
    (moodId: string) => {
      setSelectedMood(moodId);
      // Generate base palette (no refinements) and store it
      const basePalette = generateMoodPalette(moodId);
      baseColorsRef.current = basePalette;
      // Apply current refinements and write to global store
      const adjustedColors = applyRefinementsToColors(basePalette, refinements);
      setColors(adjustedColors);
      setViewMode("edit");
    },
    [refinements, setColors]
  );

  // Handle using the current palette (no mood selected)
  const handleUseCurrent = useCallback(() => {
    baseColorsRef.current = storeColors;
    setSelectedMood(null);
    setViewMode("edit");
  }, [storeColors]);

  // Handle back from editor to grid
  const handleBack = useCallback(() => {
    setViewMode("browse");
  }, []);

  // Handle refinement changes in editor
  const handleRefinementChange = useCallback(
    (key: keyof RefinementValues, value: number) => {
      const newRefinements = { ...refinements, [key]: value };
      setRefinements(newRefinements);

      // Apply refinements to the base palette (smooth adjustment, no regeneration)
      if (baseColorsRef.current.length > 0) {
        isApplyingRefinementRef.current = true;
        const adjustedColors = applyRefinementsToColors(baseColorsRef.current, newRefinements);
        setColors(adjustedColors);
        // Reset flag after a tick to allow the effect to run
        setTimeout(() => {
          isApplyingRefinementRef.current = false;
        }, 0);
      }
    },
    [refinements, setColors]
  );

  // Handle regenerate in editor
  const handleRegenerate = useCallback(() => {
    if (selectedMood) {
      // Generate new base palette and store it
      const basePalette = generateMoodPalette(selectedMood);
      baseColorsRef.current = basePalette;
      // Apply current refinements
      const adjustedColors = applyRefinementsToColors(basePalette, refinements);
      setColors(adjustedColors);
      // Also update the cache
      regenerate(selectedMood, refinements);
    }
  }, [selectedMood, refinements, regenerate, setColors]);

  // Reset refinements when going back to browse
  useEffect(() => {
    if (viewMode === "browse") {
      setRefinements({
        temperature: 0,
        vibrancy: 0,
        brightness: 0,
      });
    }
  }, [viewMode]);

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        {viewMode === "browse" ? (
          <motion.div
            key="browse"
            className="h-dvh w-screen bg-zinc-900 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <MoodHeader
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              <CurrentPaletteBar onUseCurrent={handleUseCurrent} />
              <MoodGrid
                selectedCategory={selectedCategory}
                cache={cache}
                onMoodSelect={handleMoodSelect}
                getPalette={getPalette}
              />
            </div>
          </motion.div>
        ) : (
          <MoodEditor
            key="edit"
            mood={selectedMoodProfile ?? null}
            refinements={refinements}
            onRefinementChange={handleRefinementChange}
            onRegenerate={handleRegenerate}
            onBack={handleBack}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
