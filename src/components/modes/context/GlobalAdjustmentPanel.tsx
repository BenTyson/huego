"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ColorSlider } from "@/components/ui/ColorSlider";
import {
  type GlobalAdjustments,
  isAdjusted,
  getHueGradient,
  getSaturationGradient,
  getTemperatureGradient,
} from "@/lib/global-adjustments";

interface GlobalAdjustmentPanelProps {
  adjustments: GlobalAdjustments;
  onChange: (adjustments: GlobalAdjustments) => void;
  onReset: () => void;
  onApply: () => void;
}

export function GlobalAdjustmentPanel({
  adjustments,
  onChange,
  onReset,
  onApply,
}: GlobalAdjustmentPanelProps) {
  const hasChanges = isAdjusted(adjustments);

  const handleHueChange = useCallback(
    (value: number) => {
      onChange({ ...adjustments, hue: value });
    },
    [adjustments, onChange]
  );

  const handleSaturationChange = useCallback(
    (value: number) => {
      onChange({ ...adjustments, saturation: value });
    },
    [adjustments, onChange]
  );

  const handleTemperatureChange = useCallback(
    (value: number) => {
      onChange({ ...adjustments, temperature: value });
    },
    [adjustments, onChange]
  );

  // Format temperature label
  const getTemperatureLabel = (value: number): string => {
    if (value === 0) return "Neutral";
    if (value < -50) return "Very Cool";
    if (value < 0) return "Cool";
    if (value > 50) return "Very Warm";
    return "Warm";
  };

  return (
    <div className="mb-6 p-3 rounded-lg bg-white/5 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Global Adjustments</h3>
        <AnimatePresence>
          {hasChanges && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded"
            >
              Modified
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        {/* Hue Slider */}
        <div>
          <ColorSlider
            label="Hue"
            value={adjustments.hue}
            min={-180}
            max={180}
            step={1}
            unit="°"
            gradient={getHueGradient()}
            onChange={handleHueChange}
          />
        </div>

        {/* Saturation Slider */}
        <div>
          <ColorSlider
            label="Saturation"
            value={adjustments.saturation}
            min={-100}
            max={100}
            step={1}
            unit="%"
            gradient={getSaturationGradient()}
            onChange={handleSaturationChange}
          />
        </div>

        {/* Temperature Slider */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-zinc-400">Temperature</span>
            <span className="text-zinc-300">
              <span className="font-medium">{getTemperatureLabel(adjustments.temperature)}</span>
              {adjustments.temperature !== 0 && (
                <span className="text-zinc-500 font-mono ml-1">
                  ({adjustments.temperature > 0 ? "+" : ""}{adjustments.temperature})
                </span>
              )}
            </span>
          </div>
          <ColorSlider
            label=""
            value={adjustments.temperature}
            min={-100}
            max={100}
            step={1}
            unit=""
            gradient={getTemperatureGradient()}
            onChange={handleTemperatureChange}
          />
          <div className="flex justify-between mt-1 text-[10px] text-zinc-500">
            <span>Cool</span>
            <span>Warm</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
              <button
                onClick={onReset}
                className="flex-1 px-3 py-1.5 text-sm font-medium text-zinc-300 bg-zinc-700/50 hover:bg-zinc-700 rounded-md transition-colors"
              >
                Reset
              </button>
              <button
                onClick={onApply}
                className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors"
              >
                Apply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
