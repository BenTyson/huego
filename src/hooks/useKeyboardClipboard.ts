"use client";

import { useEffect, useCallback } from "react";
import { usePaletteStore } from "@/store/palette";

interface UseKeyboardClipboardOptions {
  enabled?: boolean;
  onCopyAll?: () => void;
  onCopyColor?: (hex: string) => void;
  onShowToast?: (message: string) => void;
}

/**
 * Hook for keyboard-based clipboard operations
 */
export function useKeyboardClipboard(options: UseKeyboardClipboardOptions = {}) {
  const {
    enabled = true,
    onCopyAll,
    onCopyColor,
    onShowToast,
  } = options;

  const { colors, toggleLock } = usePaletteStore();

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
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Number keys 1-9 and 0 (for 10) - Copy that color's hex (Shift + number = toggle lock)
      if (!e.metaKey && !e.ctrlKey) {
        const num = e.key === "0" ? 10 : parseInt(e.key);
        if (num >= 1 && num <= 10 && num <= colors.length) {
          if (e.shiftKey) {
            // Shift + number = toggle lock
            toggleLock(num - 1);
            const isNowLocked = usePaletteStore.getState().locked[num - 1];
            onShowToast?.(`Color ${num} ${isNowLocked ? "locked" : "unlocked"}`);
          } else {
            // Number only = copy hex
            copySingleColor(num - 1);
          }
          return;
        }
      }

      // C - Copy all hex codes
      if (e.key === "c" && !e.metaKey && !e.ctrlKey) {
        copyAllColors();
        return;
      }

      // Ctrl/Cmd + C - Let through for normal copy behavior
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, colors, copyAllColors, copySingleColor, toggleLock, onShowToast]);

  return { copyAllColors, copySingleColor };
}
