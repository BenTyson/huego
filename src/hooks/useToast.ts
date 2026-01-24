"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface UseToastOptions {
  /** Default duration in ms */
  duration?: number;
  /** Maximum number of toasts to show */
  maxToasts?: number;
}

interface UseToastReturn {
  /** Current toast message (simple mode) */
  toast: string | null;
  /** All active toasts (multi mode) */
  toasts: Toast[];
  /** Show a toast message */
  showToast: (message: string, type?: Toast["type"]) => void;
  /** Hide current toast (simple mode) */
  hideToast: () => void;
  /** Remove a specific toast by ID */
  removeToast: (id: string) => void;
  /** Clear all toasts */
  clearToasts: () => void;
}

/**
 * Hook for managing toast notifications
 * Supports both simple single-toast and multi-toast modes
 */
export function useToast(options: UseToastOptions = {}): UseToastReturn {
  const { duration = 3000, maxToasts = 3 } = options;

  // Simple mode - single toast string
  const [toast, setToast] = useState<string | null>(null);

  // Multi mode - array of toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Cleanup timers on unmount
  useEffect(() => {
    const timersRef = toastTimers.current;
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timersRef.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "success") => {
      // Simple mode update
      setToast(message);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setToast(null);
      }, duration);

      // Multi mode update
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const newToast: Toast = { id, message, type };

      setToasts((prev) => {
        const updated = [...prev, newToast];
        // Limit number of toasts
        return updated.slice(-maxToasts);
      });

      // Set auto-remove timer for this toast
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        toastTimers.current.delete(id);
      }, duration);

      toastTimers.current.set(id, timer);
    },
    [duration, maxToasts]
  );

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast(null);
  }, []);

  const removeToast = useCallback((id: string) => {
    const timer = toastTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    toastTimers.current.forEach((timer) => clearTimeout(timer));
    toastTimers.current.clear();
    setToasts([]);
    setToast(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  return {
    toast,
    toasts,
    showToast,
    hideToast,
    removeToast,
    clearToasts,
  };
}
