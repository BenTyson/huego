"use client";

import { useEffect, useCallback } from "react";
import { usePaletteStore } from "@/store/palette";

interface KeyboardOptions {
  enableGenerate?: boolean;
  enableUndo?: boolean;
  enableLock?: boolean;
  enableCopy?: boolean;
  onCopyAll?: () => void;
}

export function useKeyboard(options: KeyboardOptions = {}) {
  const {
    enableGenerate = true,
    enableUndo = true,
    enableLock = true,
    enableCopy = true,
    onCopyAll,
  } = options;

  const { generate, undo, redo, toggleLock, colors } = usePaletteStore();

  const copyAllColors = useCallback(async () => {
    const hexCodes = colors.map((c) => c.hex).join("\n");
    try {
      await navigator.clipboard.writeText(hexCodes);
      onCopyAll?.();
    } catch (err) {
      console.error("Failed to copy colors:", err);
    }
  }, [colors, onCopyAll]);

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

      // Number keys 1-5 - Toggle lock
      if (enableLock) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 5) {
          toggleLock(num - 1);
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
    enableGenerate,
    enableUndo,
    enableLock,
    enableCopy,
  ]);

  return { copyAllColors };
}
