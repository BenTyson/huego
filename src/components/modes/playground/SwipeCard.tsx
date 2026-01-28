"use client";

import { useCallback } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import type { Color } from "@/lib/types";
import { classifyHarmony, getPsychologyKeyword } from "@/lib/adaptive-color";

const SWIPE_THRESHOLD = 100;

interface SwipeCardProps {
  color: Color;
  paletteColors: Color[];
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  isAnimating: boolean;
}

type SwipeDirection = "right" | "left" | "up" | "down" | null;

function getSwipeDirection(x: number, y: number): SwipeDirection {
  const absX = Math.abs(x);
  const absY = Math.abs(y);

  // Determine dominant axis
  if (absX > absY) {
    if (absX > SWIPE_THRESHOLD) return x > 0 ? "right" : "left";
  } else {
    if (absY > SWIPE_THRESHOLD) return y > 0 ? "down" : "up";
  }
  return null;
}

export function SwipeCard({
  color,
  paletteColors,
  onSwipeRight,
  onSwipeLeft,
  onSwipeUp,
  onSwipeDown,
  isAnimating,
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Direction label opacities based on drag
  const rightOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const leftOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);
  const upOpacity = useTransform(y, [-SWIPE_THRESHOLD, 0], [1, 0]);
  const downOpacity = useTransform(y, [0, SWIPE_THRESHOLD], [0, 1]);

  // Card rotation based on x drag
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);

  const textColor = color.contrastColor === "white" ? "#ffffff" : "#000000";
  const textColorMuted =
    color.contrastColor === "white" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)";
  const badgeBg =
    color.contrastColor === "white" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";

  // Harmony badge
  const harmonyLabel =
    paletteColors.length > 0
      ? classifyHarmony(color.oklch.h, paletteColors)
      : null;

  // Psychology keyword
  const psychKeyword = getPsychologyKeyword(color.hsl.h);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const direction = getSwipeDirection(info.offset.x, info.offset.y);
      if (!direction) return;

      switch (direction) {
        case "right":
          onSwipeRight();
          break;
        case "left":
          onSwipeLeft();
          break;
        case "up":
          onSwipeUp();
          break;
        case "down":
          onSwipeDown();
          break;
      }
    },
    [onSwipeRight, onSwipeLeft, onSwipeUp, onSwipeDown]
  );

  return (
    <motion.div
      className="absolute inset-0 rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing flex flex-col items-center justify-center select-none"
      style={{
        backgroundColor: color.hex,
        x,
        y,
        rotate,
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.15 },
      }}
      drag={!isAnimating}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
    >
      {/* Direction labels */}
      <motion.div
        className="absolute top-6 right-6 px-4 py-2 rounded-full bg-green-500/80 text-white font-bold text-lg pointer-events-none"
        style={{ opacity: rightOpacity }}
      >
        ADD
      </motion.div>
      <motion.div
        className="absolute top-6 left-6 px-4 py-2 rounded-full bg-red-500/80 text-white font-bold text-lg pointer-events-none"
        style={{ opacity: leftOpacity }}
      >
        SKIP
      </motion.div>
      <motion.div
        className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-purple-500/80 text-white font-bold text-lg pointer-events-none"
        style={{ opacity: upOpacity }}
      >
        SAVE
      </motion.div>
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-blue-500/80 text-white font-bold text-lg pointer-events-none"
        style={{ opacity: downOpacity }}
      >
        SIMILAR
      </motion.div>

      {/* Color info */}
      <div className="text-center space-y-3">
        {/* Hex code */}
        <div
          className="text-3xl sm:text-4xl font-mono font-bold tracking-wider"
          style={{ color: textColor }}
        >
          {color.hex}
        </div>

        {/* Color name */}
        <div
          className="text-base sm:text-lg font-medium"
          style={{ color: textColorMuted }}
        >
          {color.name}
        </div>

        {/* Badges row */}
        <div className="flex items-center justify-center gap-2 flex-wrap mt-2">
          {/* Harmony badge */}
          {harmonyLabel && (
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: badgeBg, color: textColor }}
            >
              {harmonyLabel}
            </span>
          )}

          {/* Psychology keyword */}
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: badgeBg, color: textColor }}
          >
            {psychKeyword}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
