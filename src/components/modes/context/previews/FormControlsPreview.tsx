"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Color } from "@/lib/types";
import type { PreviewTheme } from "../PreviewTypeSelector";
import { getPreviewColors } from "../previewUtils";

interface FormControlsPreviewProps {
  colors: Color[];
  theme: PreviewTheme;
}

export function FormControlsPreview({ colors, theme }: FormControlsPreviewProps) {
  const {
    primary,
    secondary,
    accent,
    background,
    surface,
    textPrimary,
    textSecondary,
    surfaceText,
    surfaceTextMuted,
    border,
  } = getPreviewColors(colors, theme);

  const [checked, setChecked] = useState(true);
  const [toggle, setToggle] = useState(true);
  const [selectedRadio, setSelectedRadio] = useState("option1");

  return (
    <motion.div
      className="w-full h-full rounded-xl overflow-auto shadow-2xl p-6 md:p-8"
      style={{ backgroundColor: background }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-6" style={{ color: textPrimary }}>
        Form Controls
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Text Inputs */}
        <motion.div
          className="p-6 rounded-xl"
          style={{ backgroundColor: surface }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: surfaceText }}>
            Text Inputs
          </h3>
          <div className="space-y-4">
            {/* Default Input */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: surfaceText }}>
                Default
              </label>
              <input
                type="text"
                placeholder="Enter text..."
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  backgroundColor: background,
                  border: `1.5px solid ${border}`,
                  color: textPrimary,
                }}
              />
            </div>

            {/* Focused Input */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: surfaceText }}>
                Focused
              </label>
              <input
                type="text"
                placeholder="Focused state"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: background,
                  border: `2px solid ${primary}`,
                  color: textPrimary,
                  boxShadow: `0 0 0 3px ${primary}20`,
                }}
              />
            </div>

            {/* Error Input */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: surfaceText }}>
                Error
              </label>
              <input
                type="text"
                placeholder="Invalid input"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: background,
                  border: `2px solid ${accent}`,
                  color: textPrimary,
                }}
              />
              <p className="text-xs mt-1" style={{ color: accent }}>
                This field is required
              </p>
            </div>

            {/* Disabled Input */}
            <div>
              <label className="block text-sm font-medium mb-1.5 opacity-50" style={{ color: surfaceText }}>
                Disabled
              </label>
              <input
                type="text"
                placeholder="Disabled input"
                disabled
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none opacity-50 cursor-not-allowed"
                style={{
                  backgroundColor: border,
                  border: `1.5px solid ${border}`,
                  color: textSecondary,
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Select & Textarea */}
        <motion.div
          className="p-6 rounded-xl"
          style={{ backgroundColor: surface }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: surfaceText }}>
            Select & Textarea
          </h3>
          <div className="space-y-4">
            {/* Select */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: surfaceText }}>
                Select
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none appearance-none cursor-pointer"
                style={{
                  backgroundColor: background,
                  border: `1.5px solid ${border}`,
                  color: textPrimary,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: surfaceText }}>
                Textarea
              </label>
              <textarea
                placeholder="Enter message..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none transition-all"
                style={{
                  backgroundColor: background,
                  border: `1.5px solid ${border}`,
                  color: textPrimary,
                }}
              />
            </div>

            {/* Input with icon */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: surfaceText }}>
                With Icon
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={textSecondary}
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none"
                  style={{
                    backgroundColor: background,
                    border: `1.5px solid ${border}`,
                    color: textPrimary,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Checkboxes & Radios */}
        <motion.div
          className="p-6 rounded-xl"
          style={{ backgroundColor: surface }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: surfaceText }}>
            Checkboxes & Radio Buttons
          </h3>
          <div className="space-y-4">
            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: checked ? primary : "transparent",
                    border: `2px solid ${checked ? primary : border}`,
                  }}
                  onClick={() => setChecked(!checked)}
                >
                  {checked && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
                <span className="text-sm" style={{ color: surfaceText }}>
                  Checked checkbox
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center"
                  style={{ border: `2px solid ${border}` }}
                >
                </div>
                <span className="text-sm" style={{ color: surfaceText }}>
                  Unchecked checkbox
                </span>
              </label>
            </div>

            {/* Radio Buttons */}
            <div className="space-y-2 pt-2">
              {["option1", "option2", "option3"].map((option, i) => (
                <label key={option} className="flex items-center gap-3 cursor-pointer">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                    style={{
                      border: `2px solid ${selectedRadio === option ? primary : border}`,
                    }}
                    onClick={() => setSelectedRadio(option)}
                  >
                    {selectedRadio === option && (
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: primary }}
                      />
                    )}
                  </div>
                  <span className="text-sm" style={{ color: surfaceText }}>
                    Option {i + 1}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Toggle Switches */}
        <motion.div
          className="p-6 rounded-xl"
          style={{ backgroundColor: surface }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: surfaceText }}>
            Toggle Switches
          </h3>
          <div className="space-y-4">
            {/* Primary Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: surfaceText }}>
                Primary toggle
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={toggle}
                onClick={() => setToggle(!toggle)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{ backgroundColor: toggle ? primary : border }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm"
                  style={{ transform: toggle ? "translateX(24px)" : "translateX(4px)" }}
                />
              </button>
            </div>

            {/* Secondary Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: surfaceText }}>
                Secondary toggle
              </span>
              <button
                type="button"
                role="switch"
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{ backgroundColor: secondary }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm"
                  style={{ transform: "translateX(24px)" }}
                />
              </button>
            </div>

            {/* Accent Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: surfaceText }}>
                Accent toggle
              </span>
              <button
                type="button"
                role="switch"
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{ backgroundColor: accent }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm"
                  style={{ transform: "translateX(24px)" }}
                />
              </button>
            </div>

            {/* Disabled Toggle */}
            <div className="flex items-center justify-between opacity-50">
              <span className="text-sm" style={{ color: surfaceText }}>
                Disabled toggle
              </span>
              <button
                type="button"
                role="switch"
                disabled
                className="relative inline-flex h-6 w-11 items-center rounded-full cursor-not-allowed"
                style={{ backgroundColor: border }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm"
                  style={{ transform: "translateX(4px)" }}
                />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
