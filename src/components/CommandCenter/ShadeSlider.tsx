"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { usePaletteStore, useColors } from "@/store/palette";
import { SHADE_LEVELS, detectShadeLevel } from "@/lib/shade-scale";
import type { ShadeLevel } from "@/lib/types";

interface ShadeSliderProps {
  onShowToast?: (message: string) => void;
}

export function ShadeSlider({ onShowToast }: ShadeSliderProps) {
  const colors = useColors();
  const shiftToShade = usePaletteStore((state) => state.shiftToShade);

  // Detect the average shade level of current palette
  const avgShade = Math.round(
    colors.reduce((sum, c) => sum + detectShadeLevel(c.hex), 0) / colors.length
  );

  const [selectedShade, setSelectedShade] = useState<ShadeLevel>(
    SHADE_LEVELS.find(s => s >= avgShade) || 500
  );

  const handleShadeClick = useCallback((shade: ShadeLevel) => {
    setSelectedShade(shade);
    shiftToShade(shade);
    onShowToast?.(`Shifted to shade ${shade}`);
  }, [shiftToShade, onShowToast]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Global Shade
        </span>
        <span className="text-xs font-mono text-muted-foreground">
          {selectedShade}
        </span>
      </div>

      <div className="flex gap-0.5">
        {SHADE_LEVELS.map((shade) => {
          const isSelected = shade === selectedShade;
          // Calculate a grayscale preview for the shade level
          const lightness = shade <= 100 ? 95 : shade <= 300 ? 80 : shade <= 500 ? 55 : shade <= 700 ? 35 : 15;

          return (
            <motion.button
              key={shade}
              className="flex-1 h-6 rounded-sm transition-all cursor-pointer relative"
              style={{
                backgroundColor: `hsl(0, 0%, ${lightness}%)`,
              }}
              onClick={() => handleShadeClick(shade)}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              title={`Shade ${shade}`}
            >
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-sm ring-2 ring-primary ring-offset-1 ring-offset-background"
                  layoutId="shade-indicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>Light</span>
        <span>Dark</span>
      </div>
    </div>
  );
}
