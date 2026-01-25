"use client";

import { motion } from "framer-motion";
import type { Color } from "@/lib/types";
import type { PreviewTheme } from "./PreviewTypeSelector";
import { getPreviewColors } from "./previewUtils";

interface MobileAppPreviewProps {
  colors: Color[];
  theme: PreviewTheme;
}

export function MobileAppPreview({ colors, theme }: MobileAppPreviewProps) {
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
  } = getPreviewColors(colors, theme);

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Phone Frame */}
      <div
        className="relative w-[280px] h-[560px] rounded-[40px] p-3 shadow-2xl"
        style={{ backgroundColor: "#1f2937" }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1f2937] rounded-b-2xl z-10" />

        {/* Screen */}
        <div
          className="w-full h-full rounded-[32px] overflow-hidden relative"
          style={{ backgroundColor: background }}
        >
          {/* Status Bar */}
          <div className="flex items-center justify-between px-6 pt-3 pb-2">
            <span className="text-xs font-medium" style={{ color: textSecondary }}>
              9:41
            </span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 rounded-sm" style={{ backgroundColor: textSecondary }} />
              <div className="w-4 h-2 rounded-sm" style={{ backgroundColor: textSecondary }} />
              <div className="w-6 h-3 rounded border" style={{ borderColor: textSecondary }}>
                <div className="w-4 h-full rounded-sm" style={{ backgroundColor: textSecondary }} />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="px-5 py-3">
            <h1 className="text-xl font-bold" style={{ color: textPrimary }}>
              Good morning
            </h1>
            <p className="text-sm" style={{ color: textSecondary }}>
              Here&apos;s your dashboard
            </p>
          </div>

          {/* Stats Card */}
          <motion.div
            className="mx-4 p-4 rounded-2xl mb-3"
            style={{ backgroundColor: primary }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/80 text-sm">Total Balance</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded bg-white/60" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">$12,458.00</div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-white/60">+12.5%</span>
              <span className="text-xs text-white/40">this month</span>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="px-4 mb-4">
            <div className="flex gap-3">
              {[
                { label: "Send", color: secondary },
                { label: "Receive", color: accent },
                { label: "History", color: primary },
              ].map((action, i) => (
                <motion.div
                  key={action.label}
                  className="flex-1 py-3 rounded-xl flex flex-col items-center gap-1"
                  style={{ backgroundColor: surface }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${action.color}20` }}
                  >
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: action.color }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: surfaceTextMuted }}>
                    {action.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="px-4">
            <h3 className="text-sm font-semibold mb-2" style={{ color: textPrimary }}>
              Recent
            </h3>
            {[
              { name: "Coffee Shop", amount: "-$4.50" },
              { name: "Salary", amount: "+$3,200" },
              { name: "Groceries", amount: "-$67.80" },
            ].map((tx, i) => (
              <motion.div
                key={tx.name}
                className="flex items-center justify-between py-3 border-b"
                style={{ borderColor: `${textSecondary}20` }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ backgroundColor: surface }}
                  />
                  <span className="text-sm font-medium" style={{ color: textPrimary }}>
                    {tx.name}
                  </span>
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: tx.amount.startsWith("+") ? accent : textSecondary }}
                >
                  {tx.amount}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Tab Bar */}
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-around py-4 px-6"
            style={{ backgroundColor: surface }}
          >
            {["home", "search", "card", "profile"].map((tab, i) => (
              <div
                key={tab}
                className="w-6 h-6 rounded"
                style={{
                  backgroundColor: i === 0 ? primary : surfaceTextMuted,
                  opacity: i === 0 ? 1 : 0.3,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
