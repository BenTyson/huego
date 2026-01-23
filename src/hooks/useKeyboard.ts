"use client";

import { useEffect, useCallback } from "react";
import { usePaletteStore } from "@/store/palette";
import { useThemeStore } from "@/store/theme";

interface KeyboardOptions {
  enableGenerate?: boolean;
  enableUndo?: boolean;
  enableLock?: boolean;
  enableCopy?: boolean;
  enableBatchOps?: boolean;
  onCopyAll?: () => void;
  onCopyColor?: (hex: string) => void;
  onShowHistory?: () => void;
  onShowToast?: (message: string) => void;
}

export function useKeyboard(options: KeyboardOptions = {}) {
  const {
    enableGenerate = true,
    enableUndo = true,
    enableLock = true,
    enableCopy = true,
    enableBatchOps = true,
    onCopyAll,
    onCopyColor,
    onShowHistory,
    onShowToast,
  } = options;

  const {
    generate,
    undo,
    redo,
    toggleLock,
    colors,
    shuffle,
    invert,
    adjustChroma,
  } = usePaletteStore();

  const copyAllColors = useCallback(async () => {
    const hexCodes = colors.map((c) => c.hex).join("\n");
    try {
      await navigator.clipboard.writeText(hexCodes);
      onCopyAll?.();
      onShowToast?.("All colors copied!");
    } catch (err) {
      console.error("Failed to copy colors:", err);
    }
  }, [colors, onCopyAll, onShowToast]);

  const copySingleColor = useCallback(
    async (index: number) => {
      if (index >= 0 && index < colors.length) {
        const hex = colors[index].hex;
        try {
          await navigator.clipboard.writeText(hex);
          onCopyColor?.(hex);
          onShowToast?.(`Copied ${hex}`);
        } catch (err) {
          console.error("Failed to copy color:", err);
        }
      }
    },
    [colors, onCopyColor, onShowToast]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Spacebar - Generate new palette
      if (e.code === "Space" && enableGenerate) {
        e.preventDefault();
        generate();
        return;
      }

      // Ctrl/Cmd + Z - Undo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey && enableUndo) {
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
      if (
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "z") ||
        ((e.metaKey || e.ctrlKey) && e.key === "y")
      ) {
        if (enableUndo) {
          e.preventDefault();
          redo();
          return;
        }
      }

      // Number keys 1-9 and 0 (for 10) - Copy that color's hex (Shift + number = toggle lock)
      if (!e.metaKey && !e.ctrlKey) {
        const num = e.key === "0" ? 10 : parseInt(e.key);
        if (num >= 1 && num <= 10 && num <= colors.length) {
          if (e.shiftKey && enableLock) {
            // Shift + number = toggle lock
            toggleLock(num - 1);
            onShowToast?.(`Color ${num} ${usePaletteStore.getState().locked[num - 1] ? "unlocked" : "locked"}`);
          } else if (enableCopy) {
            // Number only = copy hex
            copySingleColor(num - 1);
          }
          return;
        }
      }

      // Batch operations (when enabled)
      if (enableBatchOps) {
        // R - Shuffle/reorder colors randomly
        if (e.key === "r" && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          shuffle();
          onShowToast?.("Colors shuffled");
          return;
        }

        // I - Invert palette (swap light/dark)
        if (e.key === "i" && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          invert();
          onShowToast?.("Palette inverted");
          return;
        }

        // D - Desaturate all (-20% chroma)
        if (e.key === "d" && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          adjustChroma(-20);
          onShowToast?.("Desaturated -20%");
          return;
        }

        // V - Vibrant all (+20% chroma)
        if (e.key === "v" && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          adjustChroma(20);
          onShowToast?.("Vibrance +20%");
          return;
        }

        // H - Show history browser
        if (e.key === "h" && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          onShowHistory?.();
          return;
        }

        // T - Toggle theme
        if (e.key === "t" && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          useThemeStore.getState().toggleTheme();
          onShowToast?.(
            useThemeStore.getState().resolvedTheme === "dark"
              ? "Dark mode"
              : "Light mode"
          );
          return;
        }
      }

      // C - Copy all hex codes
      if (e.key === "c" && !e.metaKey && !e.ctrlKey && enableCopy) {
        copyAllColors();
        return;
      }

      // Ctrl/Cmd + C - Copy (let it through for normal copy behavior)
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    generate,
    undo,
    redo,
    toggleLock,
    copyAllColors,
    copySingleColor,
    shuffle,
    invert,
    adjustChroma,
    enableGenerate,
    enableUndo,
    enableLock,
    enableCopy,
    enableBatchOps,
    onShowHistory,
    onShowToast,
  ]);

  return { copyAllColors, copySingleColor };
}
