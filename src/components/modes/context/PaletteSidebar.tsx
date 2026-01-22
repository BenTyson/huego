"use client";

import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import type { Color } from "@/lib/types";

interface PaletteSidebarProps {
  colors: Color[];
  onColorChange: (index: number, hex: string) => void;
}

const ROLE_LABELS = ["Primary", "Secondary", "Accent", "Background", "Surface"];

export function PaletteSidebar({ colors, onColorChange }: PaletteSidebarProps) {
  const colorInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleEditClick = useCallback((index: number) => {
    colorInputRefs.current[index]?.click();
  }, []);

  return (
    <div className="w-full md:w-72 flex-shrink-0 p-4 md:p-6 flex flex-col">
      <h2 className="text-lg font-semibold text-white mb-4">Your Palette</h2>

      {/* Color List */}
      <div className="space-y-2 mb-6">
        {colors.map((color, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
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
