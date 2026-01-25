"use client";

import { motion } from "framer-motion";
import type { Color } from "@/lib/types";
import type { PreviewTheme } from "../PreviewTypeSelector";
import { getPreviewColors } from "../previewUtils";

interface StatsCardsPreviewProps {
  colors: Color[];
  theme: PreviewTheme;
}

export function StatsCardsPreview({ colors, theme }: StatsCardsPreviewProps) {
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

  const stats = [
    {
      label: "Total Revenue",
      value: "$48,352",
      change: "+12.5%",
      trend: "up",
      color: primary,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: "Active Users",
      value: "12,847",
      change: "+8.2%",
      trend: "up",
      color: secondary,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Bounce Rate",
      value: "24.3%",
      change: "-3.1%",
      trend: "down",
      color: accent,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      label: "Conversion Rate",
      value: "3.24%",
      change: "+0.8%",
      trend: "up",
      color: primary,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
    {
      label: "New Orders",
      value: "1,284",
      change: "+15.3%",
      trend: "up",
      color: secondary,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      ),
    },
    {
      label: "Avg. Session",
      value: "4m 32s",
      change: "+12s",
      trend: "up",
      color: accent,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
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
        Dashboard Statistics
      </h2>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="p-5 rounded-xl"
            style={{ backgroundColor: surface }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full`}
                style={{
                  backgroundColor: stat.trend === "up" ? `${primary}15` : `${accent}15`,
                  color: stat.trend === "up" ? primary : accent,
                }}
              >
                {stat.trend === "up" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                )}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: surfaceText }}>
              {stat.value}
            </div>
            <div className="text-sm" style={{ color: surfaceTextMuted }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Stats Row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Progress Stats */}
        <motion.div
          className="p-5 rounded-xl"
          style={{ backgroundColor: surface }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: surfaceText }}>
            Goal Progress
          </h3>
          <div className="space-y-4">
            {[
              { label: "Monthly Target", progress: 75, color: primary },
              { label: "User Growth", progress: 62, color: secondary },
              { label: "Revenue Goal", progress: 88, color: accent },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm" style={{ color: surfaceText }}>
                    {item.label}
                  </span>
                  <span className="text-sm font-medium" style={{ color: item.color }}>
                    {item.progress}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats List */}
        <motion.div
          className="p-5 rounded-xl"
          style={{ backgroundColor: surface }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: surfaceText }}>
            Quick Stats
          </h3>
          <div className="space-y-3">
            {[
              { label: "Total Customers", value: "8,249", color: primary },
              { label: "Pending Orders", value: "23", color: accent },
              { label: "Support Tickets", value: "12", color: secondary },
              { label: "Products Sold", value: "3,847", color: primary },
            ].map((item, i) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
                style={{ borderColor: `${surfaceTextMuted}20` }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm" style={{ color: surfaceTextMuted }}>
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-semibold" style={{ color: surfaceText }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
