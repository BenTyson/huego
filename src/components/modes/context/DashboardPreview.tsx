"use client";

import { motion } from "framer-motion";
import type { Color } from "@/lib/types";
import type { PreviewTheme } from "./PreviewTypeSelector";
import { getPreviewColors } from "./previewUtils";

interface DashboardPreviewProps {
  colors: Color[];
  theme: PreviewTheme;
}

export function DashboardPreview({ colors, theme }: DashboardPreviewProps) {
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

  // Sample chart data
  const chartBars = [35, 58, 42, 75, 63, 80, 45];

  return (
    <motion.div
      className="w-full h-full rounded-xl overflow-hidden shadow-2xl flex"
      style={{ backgroundColor: background }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sidebar */}
      <div
        className="w-16 md:w-56 flex-shrink-0 p-4 flex flex-col"
        style={{ backgroundColor: surface }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-8 h-8 rounded-lg flex-shrink-0"
            style={{ backgroundColor: primary }}
          />
          <span
            className="hidden md:block font-semibold"
            style={{ color: surfaceText }}
          >
            Dashboard
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-2">
          {[
            { label: "Overview", active: true },
            { label: "Analytics", active: false },
            { label: "Reports", active: false },
            { label: "Settings", active: false },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: item.active ? `${primary}15` : "transparent",
              }}
            >
              <div
                className="w-5 h-5 rounded"
                style={{
                  backgroundColor: item.active ? primary : surfaceTextMuted,
                  opacity: item.active ? 1 : 0.5,
                }}
              />
              <span
                className="hidden md:block text-sm font-medium"
                style={{ color: item.active ? primary : surfaceTextMuted }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: `${surfaceTextMuted}20` }}>
          <div
            className="w-8 h-8 rounded-full flex-shrink-0"
            style={{ backgroundColor: secondary }}
          />
          <div className="hidden md:block">
            <div className="text-sm font-medium" style={{ color: surfaceText }}>
              John Doe
            </div>
            <div className="text-xs" style={{ color: surfaceTextMuted }}>
              Admin
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold" style={{ color: textPrimary }}>
              Overview
            </h1>
            <p className="text-sm" style={{ color: textSecondary }}>
              Welcome back, John
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: primary }}
          >
            Export
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Revenue", value: "$45,231", change: "+20.1%", color: primary },
            { label: "Subscriptions", value: "2,350", change: "+15.2%", color: secondary },
            { label: "Active Users", value: "12,234", change: "+8.4%", color: accent },
            { label: "Growth Rate", value: "23.5%", change: "+4.3%", color: primary },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="p-4 rounded-xl"
              style={{ backgroundColor: surface }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <div className="text-xs mb-1" style={{ color: surfaceTextMuted }}>
                {stat.label}
              </div>
              <div className="text-xl font-bold mb-1" style={{ color: surfaceText }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: stat.color }}>
                {stat.change}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <motion.div
          className="p-5 rounded-xl mb-6"
          style={{ backgroundColor: surface }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: surfaceText }}>
              Revenue Over Time
            </h3>
            <div className="flex gap-2">
              {["Week", "Month", "Year"].map((period, i) => (
                <button
                  key={period}
                  className="px-3 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: i === 1 ? primary : "transparent",
                    color: i === 1 ? "white" : surfaceTextMuted,
                  }}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between h-32 gap-2">
            {chartBars.map((height, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t"
                style={{
                  backgroundColor: i === chartBars.length - 2 ? primary : `${primary}40`,
                  height: `${height}%`,
                }}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <span key={day} className="text-xs" style={{ color: surfaceTextMuted }}>
                {day}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="p-5 rounded-xl"
          style={{ backgroundColor: surface }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-semibold mb-4" style={{ color: surfaceText }}>
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { action: "New subscription", user: "Sarah K.", time: "2 min ago", color: accent },
              { action: "Payment received", user: "Mike R.", time: "15 min ago", color: primary },
              { action: "Report generated", user: "System", time: "1 hour ago", color: secondary },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: activity.color }}
                />
                <div className="flex-1">
                  <span className="text-sm" style={{ color: surfaceText }}>
                    {activity.action}
                  </span>
                  <span className="text-sm" style={{ color: surfaceTextMuted }}>
                    {" "}by {activity.user}
                  </span>
                </div>
                <span className="text-xs" style={{ color: surfaceTextMuted }}>
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
