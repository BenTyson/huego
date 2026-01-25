"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Color } from "@/lib/types";
import { generateShadeScaleWithBase, SHADE_LEVELS } from "@/lib/shade-scale";
import { getContrastColor, hexToRgb } from "@/lib/colors";
import { GlobalAdjustmentPanel } from "./GlobalAdjustmentPanel";
import type { GlobalAdjustments } from "@/lib/global-adjustments";

interface PaletteSidebarProps {
  colors: Color[];
  onColorChange: (index: number, hex: string) => void;
  adjustments: GlobalAdjustments;
  onAdjustmentChange: (adjustments: GlobalAdjustments) => void;
  onAdjustmentReset: () => void;
  onAdjustmentApply: () => void;
}

const ROLE_LABELS = ["Primary", "Secondary", "Accent", "Background", "Surface"];

interface ShadeScaleDisplayProps {
  hex: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function ShadeScaleDisplay({ hex, isExpanded, onToggle }: ShadeScaleDisplayProps) {
  const { scale, baseShade } = generateShadeScaleWithBase(hex);
  const [hoveredShade, setHoveredShade] = useState<number | null>(null);

  return (
    <div className="mt-2">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        Shade Scale
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-11 gap-0.5 mt-2 rounded overflow-hidden">
              {SHADE_LEVELS.map((shade) => {
                const shadeHex = scale[shade];
                const isBase = shade === baseShade;
                const rgb = hexToRgb(shadeHex);
                const contrast = getContrastColor(rgb);

                return (
                  <div
                    key={shade}
                    className="relative aspect-square cursor-pointer transition-transform hover:scale-110 hover:z-10"
                    style={{ backgroundColor: shadeHex }}
                    onMouseEnter={() => setHoveredShade(shade)}
                    onMouseLeave={() => setHoveredShade(null)}
                    title={`${shade}: ${shadeHex}`}
                  >
                    {isBase && (
                      <div
                        className="absolute inset-0 border-2"
                        style={{
                          borderColor: contrast === "white" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.5)",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tooltip showing hovered shade info */}
            <AnimatePresence>
              {hoveredShade !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-1 text-xs text-zinc-400 font-mono"
                >
                  {hoveredShade}: {scale[hoveredShade as keyof typeof scale]}
                  {hoveredShade === baseShade && (
                    <span className="ml-2 text-zinc-500">(base)</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Shade labels */}
            <div className="flex justify-between mt-1 text-[8px] text-zinc-600">
              <span>50</span>
              <span>500</span>
              <span>950</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PaletteSidebar({
  colors,
  onColorChange,
  adjustments,
  onAdjustmentChange,
  onAdjustmentReset,
  onAdjustmentApply,
}: PaletteSidebarProps) {
  const colorInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [expandedScales, setExpandedScales] = useState<Set<number>>(new Set());

  const handleEditClick = useCallback((index: number) => {
    colorInputRefs.current[index]?.click();
  }, []);

  const toggleScaleExpansion = useCallback((index: number) => {
    setExpandedScales((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  return (
    <div className="w-full md:w-72 flex-shrink-0 p-4 md:p-6 flex flex-col overflow-y-auto">
      <h2 className="text-lg font-semibold text-white mb-4">Your Palette</h2>

      {/* Global Adjustments Panel */}
      <GlobalAdjustmentPanel
        adjustments={adjustments}
        onChange={onAdjustmentChange}
        onReset={onAdjustmentReset}
        onApply={onAdjustmentApply}
      />

      {/* Color List */}
      <div className="space-y-2 mb-6">
        {colors.map((color, index) => (
          <motion.div
            key={index}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center gap-3">
              {/* Hidden color input */}
              <input
                ref={(el) => {
                  colorInputRefs.current[index] = el;
                }}
                type="color"
                value={color.hex}
                onChange={(e) => onColorChange(index, e.target.value)}
                className="sr-only"
                aria-label={`Edit color ${index + 1}`}
              />
              {/* Clickable color swatch */}
              <button
                className="w-10 h-10 rounded-lg flex-shrink-0 relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: color.hex }}
                onClick={() => handleEditClick(index)}
                title="Click to edit color"
              >
                {/* Edit icon on hover */}
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={color.contrastColor === "white" ? "#fff" : "#000"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </span>
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-mono text-white">{color.hex}</div>
                <div className="text-xs text-zinc-400 truncate">{color.name}</div>
              </div>
              <div className="text-xs text-zinc-500">{ROLE_LABELS[index]}</div>
            </div>

            {/* Shade Scale Display */}
            <ShadeScaleDisplay
              hex={color.hex}
              isExpanded={expandedScales.has(index)}
              onToggle={() => toggleScaleExpansion(index)}
            />
          </motion.div>
        ))}
      </div>

      {/* Role Legend */}
      <div className="mt-auto">
        <h3 className="text-sm font-medium text-zinc-400 mb-2">Color Roles</h3>
        <div className="text-xs text-zinc-500 space-y-1">
          <div>
            <span className="text-zinc-300">Primary:</span> Main brand color
          </div>
          <div>
            <span className="text-zinc-300">Secondary:</span> Supporting color
          </div>
          <div>
            <span className="text-zinc-300">Accent:</span> Highlights & CTAs
          </div>
          <div>
            <span className="text-zinc-300">Background:</span> Page background
          </div>
          <div>
            <span className="text-zinc-300">Surface:</span> Cards & panels
          </div>
        </div>
      </div>
    </div>
  );
}
