"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore, useColors } from "@/store/palette";
import { SHADE_LEVELS, detectShadeLevel } from "@/lib/shade-scale";
import type { ShadeLevel } from "@/lib/types";

interface ShadeBarProps {
  onShowToast?: (message: string) => void;
}

export function ShadeBar({ onShowToast }: ShadeBarProps) {
  const colors = useColors();
  const shiftToShade = usePaletteStore((state) => state.shiftToShade);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect the average shade level of current palette
  const avgShade = Math.round(
    colors.reduce((sum, c) => sum + detectShadeLevel(c.hex), 0) / colors.length
  );

  const currentShade = SHADE_LEVELS.find(s => s >= avgShade) || 500;

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleShadeClick = useCallback((shade: ShadeLevel) => {
    shiftToShade(shade);
    onShowToast?.(`Shade ${shade}`);
    setIsOpen(false);
  }, [shiftToShade, onShowToast]);

  // Get lightness for preview
  const getLightness = (shade: ShadeLevel) => {
    if (shade <= 100) return 95;
    if (shade <= 300) return 75;
    if (shade <= 500) return 50;
    if (shade <= 700) return 30;
    return 15;
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Toggle button */}
      <motion.button
        className={`
          h-10 px-3 rounded-full flex items-center gap-2
          bg-command-bg backdrop-blur-md border border-command-border
          text-foreground/70 hover:text-foreground hover:bg-command-hover
          transition-colors duration-150
        `}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        title="Adjust shade level"
      >
        {/* Shade preview strip */}
        <div className="flex gap-0.5">
          {[100, 300, 500, 700, 900].map((shade) => (
            <div
              key={shade}
              className="w-2 h-4 rounded-sm"
              style={{ backgroundColor: `hsl(0, 0%, ${getLightness(shade as ShadeLevel)}%)` }}
            />
          ))}
        </div>
        <span className="text-xs font-mono hidden sm:inline">{currentShade}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 rounded-xl bg-command-bg backdrop-blur-xl border border-command-border shadow-xl"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="text-xs font-medium text-muted-foreground mb-2 text-center">
              Global Shade
            </div>

            <div className="flex gap-1">
              {SHADE_LEVELS.map((shade) => {
                const isSelected = shade === currentShade;
                const lightness = getLightness(shade);

                return (
                  <motion.button
                    key={shade}
                    className={`
                      w-7 h-10 rounded-md cursor-pointer relative
                      ${isSelected ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}
                    `}
                    style={{ backgroundColor: `hsl(0, 0%, ${lightness}%)` }}
                    onClick={() => handleShadeClick(shade)}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                    title={`Shade ${shade}`}
                  />
                );
              })}
            </div>

            <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5 px-1">
              <span>50</span>
              <span>Light → Dark</span>
              <span>950</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
