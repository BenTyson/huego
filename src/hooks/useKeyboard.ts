"use client";

import { useKeyboardGeneration } from "./useKeyboardGeneration";
import { useKeyboardClipboard } from "./useKeyboardClipboard";
import { useKeyboardBatchOps } from "./useKeyboardBatchOps";

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

/**
 * Unified keyboard shortcuts hook for HueGo
 * Composes smaller focused hooks for generation, clipboard, and batch operations
 */
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

  // Generation and undo/redo (spacebar, Ctrl+Z, Ctrl+Y)
  useKeyboardGeneration({
    enabled: enableGenerate || enableUndo,
  });

  // Clipboard operations (C key, number keys, Shift+number for lock)
  const { copyAllColors, copySingleColor } = useKeyboardClipboard({
    enabled: enableCopy || enableLock,
    onCopyAll,
    onCopyColor,
    onShowToast,
  });

  // Batch operations (R, I, D, V, H, T)
  useKeyboardBatchOps({
    enabled: enableBatchOps,
    onShowHistory,
    onShowToast,
  });

  return { copyAllColors, copySingleColor };
}
