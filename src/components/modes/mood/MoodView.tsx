"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { usePaletteStore } from "@/store/palette";
import { useUIStore } from "@/store/ui";
import {
  generateMoodPalette,
  moodProfiles,
  type RefinementValues,
  type MoodCategory,
} from "@/lib/mood";
import type { Color } from "@/lib/types";
import { useMoodPaletteCache } from "@/hooks/useMoodPaletteCache";
import { MoodHeader } from "./MoodHeader";
import { MoodGrid } from "./MoodGrid";
import { MoodEditor } from "./MoodEditor";

type ViewMode = "browse" | "edit";

export function MoodView() {
  const { setColors } = usePaletteStore();
  const setHideCommandCenter = useUIStore((state) => state.setHideCommandCenter);
  const [viewMode, setViewMode] = useState<ViewMode>("browse");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<MoodCategory>("emotions");
  const [refinements, setRefinements] = useState<RefinementValues>({
    temperature: 0,
    vibrancy: 0,
    brightness: 0,
  });
  const [editorColors, setEditorColors] = useState<Color[]>([]);

  const { cache, getPalette, regenerate } = useMoodPaletteCache(
    selectedCategory,
    refinements
  );

  // Hide command center when in edit mode
  useEffect(() => {
    setHideCommandCenter(viewMode === "edit");
    return () => setHideCommandCenter(false);
  }, [viewMode, setHideCommandCenter]);

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
      // Generate fresh palette for editor
      const newColors = generateMoodPalette(moodId, refinements);
      setEditorColors(newColors);
      setViewMode("edit");
    },
    [refinements]
  );

  // Handle back from editor to grid
  const handleBack = useCallback(() => {
    setViewMode("browse");
  }, []);

  // Handle refinement changes in editor
  const handleRefinementChange = useCallback(
    (key: keyof RefinementValues, value: number) => {
      const newRefinements = { ...refinements, [key]: value };
      setRefinements(newRefinements);

      if (selectedMood) {
        const newColors = generateMoodPalette(selectedMood, newRefinements);
        setEditorColors(newColors);
      }
    },
    [selectedMood, refinements]
  );

  // Handle regenerate in editor
  const handleRegenerate = useCallback(() => {
    if (selectedMood) {
      const newColors = generateMoodPalette(selectedMood, refinements);
      setEditorColors(newColors);
      // Also update the cache
      regenerate(selectedMood, refinements);
    }
  }, [selectedMood, refinements, regenerate]);

  // Handle individual color change in editor
  const handleColorChange = useCallback((index: number, color: Color) => {
    setEditorColors((prev) => {
      const newColors = [...prev];
      newColors[index] = color;
      return newColors;
    });
  }, []);

  // Handle apply palette - sets colors in global store
  const handleApply = useCallback(() => {
    setColors(editorColors);
    // Stay in edit mode or navigate elsewhere as desired
  }, [editorColors, setColors]);

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
              <MoodGrid
                selectedCategory={selectedCategory}
                cache={cache}
                onMoodSelect={handleMoodSelect}
                getPalette={getPalette}
              />
            </div>
          </motion.div>
        ) : (
          selectedMoodProfile && (
            <MoodEditor
              key="edit"
              mood={selectedMoodProfile}
              colors={editorColors}
              refinements={refinements}
              onRefinementChange={handleRefinementChange}
              onRegenerate={handleRegenerate}
              onColorChange={handleColorChange}
              onBack={handleBack}
              onApply={handleApply}
            />
          )
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
