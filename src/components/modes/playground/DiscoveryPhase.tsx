"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Color } from "@/lib/types";
import type { AdaptiveColorEngine } from "@/lib/adaptive-color";
import { usePaletteStore } from "@/store/palette";
import { SwipeCard } from "./SwipeCard";
import { PaletteStrip } from "./PaletteStrip";

interface DiscoveryPhaseProps {
  palette: Color[];
  setPalette: (colors: Color[]) => void;
  maxSize: number;
  onRefine: () => void;
  engineRef: React.MutableRefObject<AdaptiveColorEngine>;
}

const ONBOARDING_KEY = "huego-playground-onboarded";

export function DiscoveryPhase({
  palette,
  setPalette,
  maxSize,
  onRefine,
  engineRef,
}: DiscoveryPhaseProps) {
  const { toggleSaveColor } = usePaletteStore();

  const [currentCard, setCurrentCard] = useState<Color | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [stats, setStats] = useState({ reviewed: 0, accepted: 0, rejected: 0 });
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Initialize first card from engine on mount
  useEffect(() => {
    if (!currentCard) {
      setCurrentCard(engineRef.current.generateCandidate());
      setStats(engineRef.current.getStats());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Warn on browser refresh/close if palette has colors
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (palette.length > 0) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [palette.length]);

  // Check onboarding on mount
  useEffect(() => {
    try {
      const onboarded = sessionStorage.getItem(ONBOARDING_KEY);
      if (!onboarded) {
        setShowOnboarding(true);
      }
    } catch {
      // sessionStorage not available
    }
  }, []);

  // Auto-dismiss onboarding after 3 swipes
  useEffect(() => {
    if (showOnboarding && stats.reviewed >= 3) {
      setShowOnboarding(false);
      try {
        sessionStorage.setItem(ONBOARDING_KEY, "1");
      } catch {
        // ignore
      }
    }
  }, [showOnboarding, stats.reviewed]);

  const advanceCard = useCallback(
    (nextCard?: Color) => {
      setIsAnimating(true);
      // Short delay for exit animation
      setTimeout(() => {
        setCurrentCard(nextCard || engineRef.current.generateCandidate());
        setStats(engineRef.current.getStats());
        setIsAnimating(false);
      }, 150);
    },
    [engineRef]
  );

  const handleSwipeRight = useCallback(() => {
    if (isAnimating || !currentCard || palette.length >= maxSize) return;
    engineRef.current.recordAccept(currentCard);
    setPalette([...palette, currentCard]);
    advanceCard();
  }, [isAnimating, palette, maxSize, currentCard, engineRef, setPalette, advanceCard]);

  const handleSwipeLeft = useCallback(() => {
    if (isAnimating || !currentCard) return;
    engineRef.current.recordReject(currentCard);
    advanceCard();
  }, [isAnimating, currentCard, engineRef, advanceCard]);

  const handleSwipeUp = useCallback(() => {
    if (isAnimating || !currentCard) return;
    toggleSaveColor(currentCard, false);
    advanceCard();
  }, [isAnimating, currentCard, toggleSaveColor, advanceCard]);

  const handleSwipeDown = useCallback(() => {
    if (isAnimating || !currentCard) return;
    const neighbor = engineRef.current.generateNearNeighbor(currentCard);
    advanceCard(neighbor);
  }, [isAnimating, currentCard, engineRef, advanceCard]);

  const handleRemoveFromPalette = useCallback(
    (index: number) => {
      setPalette(palette.filter((_, i) => i !== index));
    },
    [palette, setPalette]
  );

  const handleStartOver = useCallback(() => {
    engineRef.current.reset();
    setPalette([]);
    setCurrentCard(engineRef.current.generateCandidate());
    setStats(engineRef.current.getStats());
  }, [engineRef, setPalette]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          handleSwipeRight();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handleSwipeLeft();
          break;
        case "ArrowUp":
          e.preventDefault();
          handleSwipeUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          handleSwipeDown();
          break;
        case "Backspace":
          e.preventDefault();
          if (palette.length > 0) {
            handleRemoveFromPalette(palette.length - 1);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSwipeRight, handleSwipeLeft, handleSwipeUp, handleSwipeDown, handleRemoveFromPalette, palette.length]);

  const isFull = palette.length >= maxSize;

  return (
    <motion.div
      className="h-dvh w-screen flex flex-col items-center justify-center bg-zinc-900 p-4 sm:p-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-6 sm:mb-8 flex-shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
          Color Lab
        </h1>
        <p className="text-zinc-400 text-sm">
          {isFull
            ? "Palette full — refine your colors"
            : `Swipe to discover colors (${stats.reviewed} reviewed)`}
        </p>
      </motion.div>

      {/* Card Stack */}
      <div className="relative w-64 h-80 sm:w-72 sm:h-96 mb-6 sm:mb-8 flex-shrink-0">
        {/* Background depth cards */}
        {!isFull && (
          <>
            <motion.div
              className="absolute inset-0 rounded-3xl bg-zinc-800 transform scale-90 translate-y-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 0.9 }}
            />
            <motion.div
              className="absolute inset-0 rounded-3xl bg-zinc-700 transform scale-95 translate-y-2"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 0.5, scale: 0.95 }}
            />
          </>
        )}

        {/* Current card */}
        <AnimatePresence mode="wait">
          {!isFull && currentCard && (
            <SwipeCard
              key={currentCard.hex + "-" + stats.reviewed}
              color={currentCard}
              paletteColors={palette}
              onSwipeRight={handleSwipeRight}
              onSwipeLeft={handleSwipeLeft}
              onSwipeUp={handleSwipeUp}
              onSwipeDown={handleSwipeDown}
              isAnimating={isAnimating}
            />
          )}
        </AnimatePresence>

        {/* Full state */}
        {isFull && (
          <motion.div
            className="absolute inset-0 rounded-3xl bg-white/10 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-center px-6">
              <div className="text-white font-medium mb-2">Palette full</div>
              <p className="text-zinc-400 text-sm">
                Tap &quot;Refine&quot; to edit, or remove colors to keep swiping
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Onboarding hints overlay */}
      <AnimatePresence>
        {showOnboarding && !isFull && (
          <motion.div
            className="absolute inset-x-0 bottom-44 sm:bottom-52 flex justify-center pointer-events-none z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-black/80 backdrop-blur-md rounded-2xl px-5 py-4 text-center text-white text-xs sm:text-sm space-y-1.5 max-w-xs">
              <div className="flex items-center justify-center gap-3">
                <span className="text-green-400 font-medium">Right</span>
                <span className="text-zinc-500">Add</span>
                <span className="mx-1 text-zinc-600">|</span>
                <span className="text-red-400 font-medium">Left</span>
                <span className="text-zinc-500">Skip</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-purple-400 font-medium">Up</span>
                <span className="text-zinc-500">Save</span>
                <span className="mx-1 text-zinc-600">|</span>
                <span className="text-blue-400 font-medium">Down</span>
                <span className="text-zinc-500">Similar</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Palette Strip */}
      <div className="mb-4 sm:mb-6 flex-shrink-0">
        <PaletteStrip
          colors={palette}
          maxSize={maxSize}
          onRemove={handleRemoveFromPalette}
        />
      </div>

      {/* Bottom actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {palette.length >= 2 && (
          <motion.button
            className="px-5 py-2.5 rounded-full bg-white/15 text-white text-sm font-medium hover:bg-white/25 transition-colors"
            onClick={onRefine}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Refine
          </motion.button>
        )}

        {(palette.length > 0 || stats.reviewed > 0) && (
          <motion.button
            className="px-5 py-2.5 rounded-full bg-white/5 text-zinc-400 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors"
            onClick={handleStartOver}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Over
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
