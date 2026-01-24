"use client";

import { useEffect } from "react";
import { usePaletteStore } from "@/store/palette";
import { useThemeStore } from "@/store/theme";

interface UseKeyboardBatchOpsOptions {
  enabled?: boolean;
  onShowHistory?: () => void;
  onShowToast?: (message: string) => void;
}

/**
 * Hook for keyboard-based batch operations
 * R = shuffle, I = invert, D = desaturate, V = vibrant, H = history, T = theme
 */
export function useKeyboardBatchOps(options: UseKeyboardBatchOpsOptions = {}) {
  const { enabled = true, onShowHistory, onShowToast } = options;
  const { shuffle, invert, adjustChroma } = usePaletteStore();

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

      // Skip if modifier keys are held (except for T which we want to allow)
      if (e.metaKey || e.ctrlKey) return;

      switch (e.key.toLowerCase()) {
        case "r":
          // R - Shuffle/reorder colors randomly
          e.preventDefault();
          shuffle();
          onShowToast?.("Colors shuffled");
          break;

        case "i":
          // I - Invert palette (swap light/dark)
          e.preventDefault();
          invert();
          onShowToast?.("Palette inverted");
          break;

        case "d":
          // D - Desaturate all (-20% chroma)
          e.preventDefault();
          adjustChroma(-20);
          onShowToast?.("Desaturated -20%");
          break;

        case "v":
          // V - Vibrant all (+20% chroma)
          e.preventDefault();
          adjustChroma(20);
          onShowToast?.("Vibrance +20%");
          break;

        case "h":
          // H - Show history browser
          e.preventDefault();
          onShowHistory?.();
          break;

        case "t":
          // T - Toggle theme
          e.preventDefault();
          useThemeStore.getState().toggleTheme();
          onShowToast?.(
            useThemeStore.getState().resolvedTheme === "dark"
              ? "Dark mode"
              : "Light mode"
          );
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, shuffle, invert, adjustChroma, onShowHistory, onShowToast]);
}
