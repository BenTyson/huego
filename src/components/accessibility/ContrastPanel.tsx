"use client";

import type { Color } from "@/lib/types";
import {
  getPaletteContrasts,
  checkColorAccessibility,
  type WCAGLevel,
} from "@/lib/accessibility";

interface ContrastPanelProps {
  colors: Color[];
  isPremium: boolean;
  onUpgradeClick?: () => void;
}

const levelColors: Record<WCAGLevel, string> = {
  AAA: "bg-green-500",
  AA: "bg-yellow-500",
  "AA-large": "bg-orange-500",
  fail: "bg-red-500",
};

const levelLabels: Record<WCAGLevel, string> = {
  AAA: "AAA",
  AA: "AA",
  "AA-large": "AA Large",
  fail: "Fail",
};

export function ContrastPanel({ colors, isPremium, onUpgradeClick }: ContrastPanelProps) {
  const contrastPairs = getPaletteContrasts(colors);
  const colorAccessibility = colors.map((c) => checkColorAccessibility(c));

  return (
    <div className="space-y-6">
      {/* Individual color accessibility */}
      <div>
        <h3 className="text-sm font-medium text-zinc-400 mb-3">
          Text Contrast (vs White & Black)
        </h3>
        <div className="space-y-2">
          {colorAccessibility.map((ca, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50"
            >
              <div
                className="w-10 h-10 rounded-lg flex-shrink-0"
                style={{ backgroundColor: ca.color.hex }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-mono text-white">
                  {ca.color.hex}
                </div>
                <div className="flex gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-zinc-500">On white:</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${levelColors[ca.onWhite.level]} text-white`}
                    >
                      {ca.onWhite.ratio}:1
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-zinc-500">On black:</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${levelColors[ca.onBlack.level]} text-white`}
                    >
                      {ca.onBlack.ratio}:1
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pair contrasts */}
      <div>
        <h3 className="text-sm font-medium text-zinc-400 mb-3">
          Color Pair Contrasts
        </h3>
        <div className="space-y-2">
          {contrastPairs.map((pair, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50"
            >
              <div className="flex -space-x-2">
                <div
                  className="w-8 h-8 rounded-full border-2 border-zinc-900"
                  style={{ backgroundColor: pair.color1.hex }}
                />
                <div
                  className="w-8 h-8 rounded-full border-2 border-zinc-900"
                  style={{ backgroundColor: pair.color2.hex }}
                />
              </div>
              <div className="flex-1">
                <div className="text-xs text-zinc-500">
                  {pair.color1.hex} + {pair.color2.hex}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-white">
                  {pair.result.ratio}:1
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${levelColors[pair.result.level]} text-white`}
                >
                  {levelLabels[pair.result.level]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WCAG Legend */}
      <div className="p-3 rounded-lg bg-zinc-800/30">
        <h4 className="text-xs font-medium text-zinc-500 mb-2">
          WCAG 2.1 Guidelines
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-green-500" />
            <span className="text-zinc-400 flex items-center gap-1">
              AAA: 7:1+ (enhanced)
              {!isPremium && (
                <svg
                  width="10"
                  height="10"
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
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-yellow-500" />
            <span className="text-zinc-400">AA: 4.5:1+ (normal text)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-orange-500" />
            <span className="text-zinc-400">AA Large: 3:1+ (large text)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-red-500" />
            <span className="text-zinc-400">Fail: Below 3:1</span>
          </div>
        </div>
        {!isPremium && (
          <button
            onClick={onUpgradeClick}
            className="mt-3 text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1"
          >
            Upgrade for AAA checking & all blindness types
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
