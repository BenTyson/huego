"use client";

import { useState, useMemo } from "react";
import type { Color } from "@/lib/types";
import {
  colorBlindnessOptions,
  simulatePaletteColorBlindness,
  findConfusablePairs,
  type ColorBlindnessType,
} from "@/lib/accessibility";

interface ColorBlindnessPanelProps {
  colors: Color[];
  isPremium: boolean;
  onUpgradeClick?: () => void;
}

// Free tier blindness types
const PREMIUM_BLINDNESS_TYPES: ColorBlindnessType[] = ["tritanopia", "achromatopsia"];

export function ColorBlindnessPanel({ colors, isPremium, onUpgradeClick }: ColorBlindnessPanelProps) {
  const [selectedBlindness, setSelectedBlindness] = useState<ColorBlindnessType>("normal");

  const isBlindnessLocked = (type: ColorBlindnessType) => {
    if (isPremium) return false;
    return PREMIUM_BLINDNESS_TYPES.includes(type);
  };

  const simulatedColors = useMemo(
    () => simulatePaletteColorBlindness(colors, selectedBlindness),
    [colors, selectedBlindness]
  );

  const confusablePairs = useMemo(
    () => findConfusablePairs(colors, selectedBlindness, 0.85),
    [colors, selectedBlindness]
  );

  return (
    <div className="space-y-6">
      {/* Color blindness type selector */}
      <div>
        <h3 className="text-sm font-medium text-zinc-400 mb-3">
          Simulation Type
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {colorBlindnessOptions.map((option) => {
            const locked = isBlindnessLocked(option.id);
            return (
              <button
                key={option.id}
                className={`p-3 rounded-lg text-left transition-colors relative ${
                  selectedBlindness === option.id && !locked
                    ? "bg-white/10 border border-white/20"
                    : locked
                    ? "bg-zinc-800/30 cursor-not-allowed opacity-60"
                    : "bg-zinc-800/50 hover:bg-zinc-800"
                }`}
                onClick={() => {
                  if (locked && onUpgradeClick) {
                    onUpgradeClick();
                  } else if (!locked) {
                    setSelectedBlindness(option.id);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-white">
                    {option.name}
                  </div>
                  {locked && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-amber-500"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  {locked ? "Premium" : option.description}
                </div>
                {!locked && (
                  <div className="text-xs text-zinc-600 mt-1">
                    {option.prevalence}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulated palette */}
      <div>
        <h3 className="text-sm font-medium text-zinc-400 mb-3">
          Simulated View
        </h3>
        <div className="flex rounded-lg overflow-hidden h-20">
          {simulatedColors.map((hex, index) => (
            <div
              key={index}
              className="flex-1 flex items-center justify-center"
              style={{ backgroundColor: hex }}
            >
              <span
                className="text-xs font-mono"
                style={{
                  color: colors[index].contrastColor === "white" ? "#fff" : "#000",
                }}
              >
                {hex}
              </span>
            </div>
          ))}
        </div>
        <div className="flex rounded-lg overflow-hidden h-20 mt-2">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex-1 flex items-center justify-center"
              style={{ backgroundColor: color.hex }}
            >
              <span
                className="text-xs font-mono"
                style={{
                  color: color.contrastColor === "white" ? "#fff" : "#000",
                }}
              >
                {color.hex}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          <span>↑ Simulated ({colorBlindnessOptions.find(o => o.id === selectedBlindness)?.name})</span>
          <span>↑ Original</span>
        </div>
      </div>

      {/* Confusable pairs warning */}
      {selectedBlindness !== "normal" && confusablePairs.length > 0 && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-yellow-500"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="text-sm font-medium text-yellow-500">
              Potentially Confusable Colors
            </span>
          </div>
          <div className="space-y-2">
            {confusablePairs.map((pair, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: pair.originalColors[0] }}
                />
                <span className="text-zinc-400">and</span>
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: pair.originalColors[1] }}
                />
                <span className="text-zinc-500">
                  may look similar ({Math.round(pair.similarity * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedBlindness !== "normal" && confusablePairs.length === 0 && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-green-500"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="text-sm text-green-500">
              All colors are distinguishable for {colorBlindnessOptions.find(o => o.id === selectedBlindness)?.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
