"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore } from "@/store/palette";
import { useIsPremium } from "@/store/subscription";
import {
  getPaletteContrasts,
  checkColorAccessibility,
  colorBlindnessOptions,
  simulatePaletteColorBlindness,
  findConfusablePairs,
  type ColorBlindnessType,
  type WCAGLevel,
} from "@/lib/accessibility";

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick?: () => void;
}

// Free tier blindness types
const FREE_BLINDNESS_TYPES: ColorBlindnessType[] = ["normal", "protanopia", "deuteranopia"];
const PREMIUM_BLINDNESS_TYPES: ColorBlindnessType[] = ["tritanopia", "achromatopsia"];

type Tab = "contrast" | "colorblind";

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

export function AccessibilityPanel({ isOpen, onClose, onUpgradeClick }: AccessibilityPanelProps) {
  const { colors } = usePaletteStore();
  const isPremium = useIsPremium();
  const [activeTab, setActiveTab] = useState<Tab>("contrast");
  const [selectedBlindness, setSelectedBlindness] = useState<ColorBlindnessType>("normal");

  const isBlindnessLocked = (type: ColorBlindnessType) => {
    if (isPremium) return false;
    return PREMIUM_BLINDNESS_TYPES.includes(type);
  };

  const contrastPairs = useMemo(() => getPaletteContrasts(colors), [colors]);
  const colorAccessibility = useMemo(
    () => colors.map((c) => checkColorAccessibility(c)),
    [colors]
  );
  const simulatedColors = useMemo(
    () => simulatePaletteColorBlindness(colors, selectedBlindness),
    [colors, selectedBlindness]
  );
  const confusablePairs = useMemo(
    () => findConfusablePairs(colors, selectedBlindness, 0.85),
    [colors, selectedBlindness]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[80vh] bg-zinc-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white">Accessibility</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-800">
              <button
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === "contrast"
                    ? "text-white border-b-2 border-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                onClick={() => setActiveTab("contrast")}
              >
                WCAG Contrast
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === "colorblind"
                    ? "text-white border-b-2 border-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                onClick={() => setActiveTab("colorblind")}
              >
                Color Blindness
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "contrast" ? (
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
              ) : (
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
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-zinc-900 hover:bg-zinc-200 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
