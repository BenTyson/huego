"use client";

import { useState, useCallback, useRef, useEffect, useMemo, memo } from "react";
import { motion } from "framer-motion";
import type { Color } from "@/lib/types";

interface ColorColumnProps {
  color: Color;
  index: number;
  isLocked: boolean;
  onToggleLock: () => void;
  onColorChange: (hex: string) => void;
  onShowInfo?: () => void;
  isActive: boolean;
}

export const ColorColumn = memo(function ColorColumn({
  color,
  index,
  isLocked,
  onToggleLock,
  onColorChange,
  onShowInfo,
  isActive,
}: ColorColumnProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(color.hex);
      setCopied(true);
      // Clear any existing timer before setting a new one
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [color.hex]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    colorInputRef.current?.click();
  }, []);

  const handleColorInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value);
  }, [onColorChange]);

  // Memoize text colors based on contrast color
  const { textColor, textColorMuted } = useMemo(() => ({
    textColor: color.contrastColor === "white" ? "#ffffff" : "#000000",
    textColorMuted: color.contrastColor === "white"
      ? "rgba(255,255,255,0.6)"
      : "rgba(0,0,0,0.5)",
  }), [color.contrastColor]);

  return (
    <motion.div
      className="relative flex-1 flex flex-col items-center justify-center cursor-pointer no-select"
      style={{ backgroundColor: color.hex }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { delay: index * 0.05, duration: 0.3 },
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onToggleLock}
    >
      {/* Hidden color input */}
      <input
        ref={colorInputRef}
        type="color"
        value={color.hex}
        onChange={handleColorInput}
        className="sr-only"
        aria-label={`Edit color ${index + 1}`}
      />

      {/* Edit and Info buttons - subtle, positioned below nav */}
      <motion.div
        className="absolute top-16 left-4 md:top-20 md:left-6 flex gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.9 : 0.35 }}
        transition={{ duration: 0.2 }}
      >
        <motion.button
          className="p-1.5 rounded-md transition-all"
          style={{
            backgroundColor: isHovered
              ? color.contrastColor === "white"
                ? "rgba(255,255,255,0.15)"
                : "rgba(0,0,0,0.1)"
              : "transparent",
          }}
          onClick={handleEditClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Edit color"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={textColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </motion.button>
        {onShowInfo && (
          <motion.button
            className="p-1.5 rounded-md transition-all"
            style={{
              backgroundColor: isHovered
                ? color.contrastColor === "white"
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(0,0,0,0.1)"
                : "transparent",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onShowInfo();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Color psychology info"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={textColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </motion.button>
        )}
      </motion.div>

      {/* Lock indicator - subtle, positioned below nav */}
      <motion.div
        className="absolute top-16 right-4 md:top-20 md:right-6"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isLocked ? 0.8 : isHovered ? 0.4 : 0.2,
        }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.1, opacity: 1 }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={textColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isLocked ? (
            // Locked icon
            <>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </>
          ) : (
            // Unlocked icon
            <>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </>
          )}
        </svg>
      </motion.div>

      {/* Color info - always visible on mobile, hover on desktop */}
      <motion.div
        className="flex flex-col items-center gap-2 md:gap-3"
        initial={false}
        animate={{
          opacity: isHovered || isActive ? 1 : 0.8,
          y: isHovered ? -5 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Hex code */}
        <motion.button
          className="text-lg md:text-2xl font-mono font-semibold tracking-wider px-3 py-1 rounded-lg transition-colors"
          style={{
            color: textColor,
            backgroundColor: isHovered
              ? color.contrastColor === "white"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)"
              : "transparent",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? "Copied!" : color.hex}
        </motion.button>

        {/* Color name */}
        <motion.span
          className="text-xs md:text-sm font-medium opacity-70"
          style={{ color: textColorMuted }}
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0.6 }}
        >
          {color.name}
        </motion.span>

        {/* RGB values on hover */}
        <motion.div
          className="hidden md:flex gap-3 text-xs font-mono"
          style={{ color: textColorMuted }}
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isHovered ? 0.8 : 0,
            height: isHovered ? "auto" : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <span>R {color.rgb.r}</span>
          <span>G {color.rgb.g}</span>
          <span>B {color.rgb.b}</span>
        </motion.div>
      </motion.div>

      {/* Bottom index indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-mono"
        style={{ color: textColorMuted }}
        initial={false}
        animate={{ opacity: isHovered ? 0.6 : 0.3 }}
      >
        {index + 1}
      </motion.div>
    </motion.div>
  );
});
