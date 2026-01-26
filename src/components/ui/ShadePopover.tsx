"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateShadeScaleWithBase, SHADE_LEVELS } from "@/lib/shade-scale";
import type { ShadeLevel } from "@/lib/types";

interface ShadePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  baseHex: string;
  onSelectShade?: (hex: string) => void;
  anchorPosition?: { x: number; y: number };
}

export function ShadePopover({
  isOpen,
  onClose,
  baseHex,
  onSelectShade,
  anchorPosition,
}: ShadePopoverProps) {
  const [copiedShade, setCopiedShade] = useState<ShadeLevel | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate shade scale
  const { scale, baseShade } = generateShadeScaleWithBase(baseHex);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleShadeClick = useCallback(
    async (shade: ShadeLevel, hex: string) => {
      try {
        await navigator.clipboard.writeText(hex);
        setCopiedShade(shade);

        if (copyTimerRef.current) {
          clearTimeout(copyTimerRef.current);
        }
        copyTimerRef.current = setTimeout(() => setCopiedShade(null), 1500);

        if (onSelectShade) {
          onSelectShade(hex);
        }
      } catch (err) {
        console.error("Failed to copy shade:", err);
      }
    },
    [onSelectShade]
  );

  // Determine text color based on shade lightness
  const getTextColor = (shade: ShadeLevel) => {
    return shade <= 400 ? "#000000" : "#ffffff";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          className="fixed z-50 p-3 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-2xl border border-zinc-200/50 dark:border-zinc-700/50"
          style={{
            top: anchorPosition?.y ?? "50%",
            left: anchorPosition?.x ?? "50%",
            transform: anchorPosition ? "translate(-50%, 8px)" : "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Shade Scale
            </span>
            <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
              {baseHex.toUpperCase()}
            </span>
          </div>

          {/* Shade strip */}
          <div className="flex gap-1">
            {SHADE_LEVELS.map((shade) => {
              const hex = scale[shade];
              const isBase = shade === baseShade;
              const isCopied = copiedShade === shade;

              return (
                <motion.button
                  key={shade}
                  className="relative flex flex-col items-center group"
                  onClick={() => handleShadeClick(shade, hex)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Color swatch - larger on mobile for touch */}
                  <div
                    className="w-11 h-14 md:w-8 md:h-12 rounded-lg transition-all relative"
                    style={{
                      backgroundColor: hex,
                      boxShadow: isBase
                        ? `0 0 0 2px ${getTextColor(shade)}, 0 0 0 4px ${hex}`
                        : undefined,
                    }}
                  >
                    {/* Copied indicator */}
                    <AnimatePresence>
                      {isCopied && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center rounded-lg"
                          style={{ backgroundColor: hex }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={getTextColor(shade)}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Shade number */}
                  <span
                    className="mt-1 text-[10px] font-mono transition-colors"
                    style={{
                      color: isBase ? "#000" : "#888",
                      fontWeight: isBase ? 600 : 400,
                    }}
                  >
                    {shade}
                  </span>

                  {/* Hover tooltip */}
                  <motion.div
                    className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-zinc-800 text-white text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                    initial={false}
                  >
                    {hex.toUpperCase()}
                  </motion.div>
                </motion.button>
              );
            })}
          </div>

          {/* Click to copy hint */}
          <div className="mt-2 text-center text-[10px] text-zinc-400 dark:text-zinc-500">
            Click to copy
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
