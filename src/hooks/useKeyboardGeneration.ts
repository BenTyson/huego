"use client";

import { useEffect, useCallback } from "react";
import { usePaletteStore } from "@/store/palette";

interface UseKeyboardGenerationOptions {
  enabled?: boolean;
  onGenerate?: () => void;
}

/**
 * Hook for keyboard-based palette generation (spacebar)
 */
export function useKeyboardGeneration(options: UseKeyboardGenerationOptions = {}) {
  const { enabled = true, onGenerate } = options;
  const { generate, undo, redo } = usePaletteStore();

  const handleGenerate = useCallback(() => {
    generate();
    onGenerate?.();
  }, [generate, onGenerate]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Spacebar - Generate new palette
      if (e.code === "Space") {
        e.preventDefault();
        handleGenerate();
        return;
      }

      // Ctrl/Cmd + Z - Undo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
      if (
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "z") ||
        ((e.metaKey || e.ctrlKey) && e.key === "y")
      ) {
        e.preventDefault();
        redo();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, handleGenerate, undo, redo]);

  return { generate: handleGenerate };
}
