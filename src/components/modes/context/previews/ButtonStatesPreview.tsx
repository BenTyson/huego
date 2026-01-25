"use client";

import { motion } from "framer-motion";
import type { Color } from "@/lib/types";
import type { PreviewTheme } from "../PreviewTypeSelector";
import { getPreviewColors } from "../previewUtils";
import { generateShadeScale } from "@/lib/shade-scale";

interface ButtonStatesPreviewProps {
  colors: Color[];
  theme: PreviewTheme;
}

export function ButtonStatesPreview({ colors, theme }: ButtonStatesPreviewProps) {
  const {
    primary,
    secondary,
    accent,
    background,
    surface,
    textPrimary,
    surfaceText,
    surfaceTextMuted,
  } = getPreviewColors(colors, theme);

  // Generate shade scales for hover/active states
  const primaryScale = generateShadeScale(primary);
  const secondaryScale = generateShadeScale(secondary);
  const accentScale = generateShadeScale(accent);

  const buttonConfigs = [
    {
      label: "Primary",
      color: primary,
      hoverColor: primaryScale[600],
      activeColor: primaryScale[700],
    },
    {
      label: "Secondary",
      color: secondary,
      hoverColor: secondaryScale[600],
      activeColor: secondaryScale[700],
    },
    {
      label: "Accent",
      color: accent,
      hoverColor: accentScale[600],
      activeColor: accentScale[700],
    },
  ];

  return (
    <motion.div
      className="w-full h-full rounded-xl overflow-auto shadow-2xl p-6 md:p-8"
      style={{ backgroundColor: background }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-6" style={{ color: textPrimary }}>
        Button States
      </h2>

      <div className="grid gap-8">
        {/* Solid Buttons */}
        <motion.div
          className="p-6 rounded-xl"
          style={{ backgroundColor: surface }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: surfaceText }}>
            Solid Buttons
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium pb-3" style={{ color: surfaceTextMuted }}>
                    Type
                  </th>
                  <th className="text-left text-xs font-medium pb-3" style={{ color: surfaceTextMuted }}>
                    Default
                  </th>
                  <th className="text-left text-xs font-medium pb-3" style={{ color: surfaceTextMuted }}>
                    Hover
                  </th>
                  <th className="text-left text-xs font-medium pb-3" style={{ color: surfaceTextMuted }}>
                    Active
                  </th>
                  <th className="text-left text-xs font-medium pb-3" style={{ color: surfaceTextMuted }}>
                    Disabled
                  </th>
                </tr>
              </thead>
              <tbody>
                {buttonConfigs.map((btn, i) => (
                  <tr key={btn.label}>
                    <td className="py-2 text-sm font-medium" style={{ color: surfaceText }}>
                      {btn.label}
                    </td>
                    <td className="py-2">
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                        style={{ backgroundColor: btn.color }}
                      >
                        Button
                      </button>
                    </td>
                    <td className="py-2">
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                        style={{ backgroundColor: btn.hoverColor }}
                      >
                        Button
                      </button>
                    </td>
                    <td className="py-2">
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                        style={{ backgroundColor: btn.activeColor }}
                      >
                        Button
                      </button>
                    </td>
                    <td className="py-2">
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white opacity-50 cursor-not-allowed"
                        style={{ backgroundColor: btn.color }}
                        disabled
                      >
                        Button
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Outline Buttons */}
        <motion.div
          className="p-6 rounded-xl"
          style={{ backgroundColor: surface }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: surfaceText }}>
            Outline Buttons
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium pb-3" style={{ color: surfaceTextMuted }}>
                    Type
                  </th>
                  <th className="text-left text-xs font-medium pb-3" style={{ color: surfaceTextMuted }}>
                    Default
                  </th>
                  <th className="text-left text-xs font-medium pb-3" style={{ color: surfaceTextMuted }}>
                    Hover
                  </th>
                  <th className="text-left text-xs font-medium pb-3" style={{ color: surfaceTextMuted }}>
                    Active
                  </th>
                  <th className="text-left text-xs font-medium pb-3" style={{ color: surfaceTextMuted }}>
                    Disabled
                  </th>
                </tr>
              </thead>
              <tbody>
                {buttonConfigs.map((btn) => (
                  <tr key={btn.label}>
                    <td className="py-2 text-sm font-medium" style={{ color: surfaceText }}>
                      {btn.label}
                    </td>
                    <td className="py-2">
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium border-2 bg-transparent"
                        style={{ borderColor: btn.color, color: btn.color }}
                      >
                        Button
                      </button>
                    </td>
                    <td className="py-2">
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium border-2"
                        style={{ borderColor: btn.color, backgroundColor: `${btn.color}15`, color: btn.color }}
                      >
                        Button
                      </button>
                    </td>
                    <td className="py-2">
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium border-2"
                        style={{ borderColor: btn.color, backgroundColor: `${btn.color}25`, color: btn.color }}
                      >
                        Button
                      </button>
                    </td>
                    <td className="py-2">
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium border-2 bg-transparent opacity-50 cursor-not-allowed"
                        style={{ borderColor: btn.color, color: btn.color }}
                        disabled
                      >
                        Button
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Button Sizes */}
        <motion.div
          className="p-6 rounded-xl"
          style={{ backgroundColor: surface }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: surfaceText }}>
            Button Sizes
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="px-3 py-1.5 rounded text-xs font-medium text-white"
              style={{ backgroundColor: primary }}
            >
              Small
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: primary }}
            >
              Medium
            </button>
            <button
              className="px-6 py-3 rounded-lg text-base font-medium text-white"
              style={{ backgroundColor: primary }}
            >
              Large
            </button>
            <button
              className="px-8 py-4 rounded-xl text-lg font-medium text-white"
              style={{ backgroundColor: primary }}
            >
              Extra Large
            </button>
          </div>
        </motion.div>

        {/* Icon Buttons */}
        <motion.div
          className="p-6 rounded-xl"
          style={{ backgroundColor: surface }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: surfaceText }}>
            Icon Buttons
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            {buttonConfigs.map((btn) => (
              <button
                key={btn.label}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: btn.color }}
                title={btn.label}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            ))}
            {buttonConfigs.map((btn) => (
              <button
                key={`outline-${btn.label}`}
                className="w-10 h-10 rounded-lg flex items-center justify-center border-2 bg-transparent"
                style={{ borderColor: btn.color, color: btn.color }}
                title={`${btn.label} Outline`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
