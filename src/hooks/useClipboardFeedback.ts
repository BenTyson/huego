"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface UseClipboardFeedbackOptions {
  /** Duration to show feedback in ms */
  feedbackDuration?: number;
  /** Callback when copy succeeds */
  onSuccess?: (text: string) => void;
  /** Callback when copy fails */
  onError?: (error: Error) => void;
}

interface UseClipboardFeedbackReturn {
  /** Whether copy feedback is currently showing */
  copied: boolean;
  /** Copy text to clipboard */
  copy: (text: string) => Promise<boolean>;
  /** Reset copied state */
  reset: () => void;
}

/**
 * Hook for clipboard operations with visual feedback
 * Handles the common pattern of copy → show "Copied!" → reset
 */
export function useClipboardFeedback(
  options: UseClipboardFeedbackOptions = {}
): UseClipboardFeedbackReturn {
  const { feedbackDuration = 2000, onSuccess, onError } = options;
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        onSuccess?.(text);

        // Clear any existing timer
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
          setCopied(false);
        }, feedbackDuration);

        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to copy");
        console.error("Clipboard copy failed:", error);
        onError?.(error);
        return false;
      }
    },
    [feedbackDuration, onSuccess, onError]
  );

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setCopied(false);
  }, []);

  return { copied, copy, reset };
}
