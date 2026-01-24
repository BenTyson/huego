"use client";

import { useState, useCallback } from "react";

interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Simple hook for managing modal open/close state
 */
export function useModal(initialState = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}

/**
 * Hook for managing multiple modals by key
 */
export function useModals<T extends string>(
  initialModal: T | null = null
): {
  activeModal: T | null;
  isOpen: (modal: T) => boolean;
  open: (modal: T) => void;
  close: () => void;
  toggle: (modal: T) => void;
} {
  const [activeModal, setActiveModal] = useState<T | null>(initialModal);

  const isOpen = useCallback(
    (modal: T) => activeModal === modal,
    [activeModal]
  );

  const open = useCallback((modal: T) => setActiveModal(modal), []);

  const close = useCallback(() => setActiveModal(null), []);

  const toggle = useCallback(
    (modal: T) => setActiveModal((prev) => (prev === modal ? null : modal)),
    []
  );

  return { activeModal, isOpen, open, close, toggle };
}
