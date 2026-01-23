"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Color } from "@/lib/types";
import { analyzeColor, type ColorAnalysis } from "@/lib/color-psychology";

interface ColorInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  color: Color | null;
}

export function ColorInfoPanel({ isOpen, onClose, color }: ColorInfoPanelProps) {
  if (!color) return null;

  const analysis = analyzeColor(color.hsl.h, color.hsl.s, color.hsl.l);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-900 border-l border-zinc-800 z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800">
              <div className="flex items-center justify-between p-4">
                <h2 className="text-lg font-semibold text-white">Color Psychology</h2>
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

              {/* Color preview strip */}
              <div
                className="h-24 w-full flex items-center justify-center"
                style={{ backgroundColor: color.hex }}
              >
                <div
                  className="text-center"
                  style={{ color: color.contrastColor === "white" ? "#fff" : "#000" }}
                >
                  <div className="text-2xl font-mono font-bold">{color.hex}</div>
                  <div className="text-sm opacity-70">{color.name}</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* Summary */}
              <section>
                <p className="text-white/90 text-lg leading-relaxed">
                  {analysis.summary}
                </p>
              </section>

              {analysis.isNeutral && analysis.neutral ? (
                <NeutralColorInfo neutral={analysis.neutral} />
              ) : analysis.baseColor ? (
                <ChromaticColorInfo analysis={analysis} />
              ) : null}

              {/* Color Values */}
              <section>
                <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
                  Color Values
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <ValueCard label="RGB" value={`${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`} />
                  <ValueCard label="HSL" value={`${Math.round(color.hsl.h)}°, ${Math.round(color.hsl.s)}%, ${Math.round(color.hsl.l)}%`} />
                  <ValueCard label="OKLCH" value={`${color.oklch.l.toFixed(2)}, ${color.oklch.c.toFixed(3)}, ${Math.round(color.oklch.h)}°`} />
                  <ValueCard label="Contrast" value={color.contrastColor === "white" ? "Light text" : "Dark text"} />
                </div>
              </section>

              {/* Saturation & Lightness Effects */}
              <section>
                <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
                  Tone Effects
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-zinc-800/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-zinc-300">
                        {analysis.saturation.modifier} saturation
                      </span>
                      <span className="text-xs text-zinc-500">
                        {Math.round(color.hsl.s)}%
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{analysis.saturation.effect}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-800/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-zinc-300">
                        {analysis.lightness.modifier} tone
                      </span>
                      <span className="text-xs text-zinc-500">
                        {Math.round(color.hsl.l)}%
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{analysis.lightness.effect}</p>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Sub-components for organization

function NeutralColorInfo({ neutral }: { neutral: NonNullable<ColorAnalysis["neutral"]> }) {
  return (
    <>
      <section>
        <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
          Emotions & Associations
        </h3>
        <div className="flex flex-wrap gap-2">
          {neutral.emotions.map((emotion) => (
            <span
              key={emotion}
              className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-sm"
            >
              {emotion}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
          Best Use Cases
        </h3>
        <ul className="space-y-2">
          {neutral.useCases.map((useCase) => (
            <li key={useCase} className="flex items-start gap-2 text-sm text-zinc-400">
              <svg className="w-4 h-4 mt-0.5 text-zinc-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              {useCase}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function ChromaticColorInfo({ analysis }: { analysis: ColorAnalysis }) {
  const { baseColor } = analysis;
  if (!baseColor) return null;

  return (
    <>
      {/* Emotions */}
      <section>
        <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
          Emotions & Associations
        </h3>
        <div className="flex flex-wrap gap-2">
          {baseColor.emotions.map((emotion) => (
            <span
              key={emotion}
              className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-sm"
            >
              {emotion}
            </span>
          ))}
        </div>
      </section>

      {/* Traits */}
      <section>
        <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
          Color Traits
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs text-green-500 mb-2 flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Positive
            </h4>
            <ul className="space-y-1">
              {baseColor.positiveTraits.map((trait) => (
                <li key={trait} className="text-sm text-zinc-400">{trait}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs text-red-400 mb-2 flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Caution
            </h4>
            <ul className="space-y-1">
              {baseColor.negativeTraits.map((trait) => (
                <li key={trait} className="text-sm text-zinc-400">{trait}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section>
        <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
          Best Use Cases
        </h3>
        <ul className="space-y-2">
          {baseColor.useCases.map((useCase) => (
            <li key={useCase} className="flex items-start gap-2 text-sm text-zinc-400">
              <svg className="w-4 h-4 mt-0.5 text-zinc-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              {useCase}
            </li>
          ))}
        </ul>
      </section>

      {/* Industries */}
      <section>
        <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
          Common Industries
        </h3>
        <div className="flex flex-wrap gap-2">
          {baseColor.industries.map((industry) => (
            <span
              key={industry}
              className="px-2 py-1 rounded bg-zinc-800/50 text-zinc-400 text-xs"
            >
              {industry}
            </span>
          ))}
        </div>
      </section>

      {/* Cultural Context */}
      <section>
        <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
          Cultural Context
        </h3>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-zinc-800/50">
            <h4 className="text-xs font-medium text-zinc-400 mb-1">Western Cultures</h4>
            <p className="text-sm text-zinc-300">{baseColor.cultures.western}</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-800/50">
            <h4 className="text-xs font-medium text-zinc-400 mb-1">Eastern Cultures</h4>
            <p className="text-sm text-zinc-300">{baseColor.cultures.eastern}</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-800/50">
            <h4 className="text-xs font-medium text-zinc-400 mb-1">Universal</h4>
            <p className="text-sm text-zinc-300">{baseColor.cultures.general}</p>
          </div>
        </div>
      </section>
    </>
  );
}

function ValueCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-zinc-800/50">
      <div className="text-xs text-zinc-500 mb-1">{label}</div>
      <div className="text-sm font-mono text-zinc-300">{value}</div>
    </div>
  );
}
