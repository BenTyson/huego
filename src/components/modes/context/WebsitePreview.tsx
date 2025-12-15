"use client";

import { motion } from "framer-motion";
import type { Color } from "@/lib/types";

interface WebsitePreviewProps {
  colors: Color[];
}

export function WebsitePreview({ colors }: WebsitePreviewProps) {
  // Assign colors to roles
  const primary = colors[0]?.hex || "#6366f1";
  const secondary = colors[1]?.hex || "#8b5cf6";
  const accent = colors[2]?.hex || "#ec4899";
  const background = colors[3]?.hex || "#f8fafc";
  const surface = colors[4]?.hex || "#ffffff";

  // Determine text colors based on background lightness
  const bgLight = colors[3]?.oklch.l > 0.6;
  const textPrimary = bgLight ? "#1f2937" : "#f9fafb";
  const textSecondary = bgLight ? "#6b7280" : "#9ca3af";

  const surfaceLight = colors[4]?.oklch.l > 0.6;
  const surfaceText = surfaceLight ? "#1f2937" : "#f9fafb";
  const surfaceTextMuted = surfaceLight ? "#6b7280" : "#9ca3af";

  return (
    <motion.div
      className="w-full h-full rounded-xl overflow-hidden shadow-2xl"
      style={{ backgroundColor: background }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Navigation */}
      <nav
        className="flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: surface }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg"
            style={{ backgroundColor: primary }}
          />
          <span className="font-semibold" style={{ color: surfaceText }}>
            Brand
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          {["Home", "Features", "Pricing", "About"].map((item) => (
            <span
              key={item}
              className="text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity"
              style={{ color: surfaceTextMuted }}
            >
              {item}
            </span>
          ))}
        </div>
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: primary }}
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <div className="px-6 py-12 md:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: textPrimary }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Build something{" "}
            <span style={{ color: primary }}>amazing</span> today
          </motion.h1>
          <motion.p
            className="text-base md:text-lg mb-8"
            style={{ color: textSecondary }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            The modern platform for teams who want to ship faster and build better products together.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              className="px-6 py-3 rounded-lg font-medium text-white transition-transform hover:scale-105"
              style={{ backgroundColor: primary }}
            >
              Start Free Trial
            </button>
            <button
              className="px-6 py-3 rounded-lg font-medium border-2 transition-transform hover:scale-105"
              style={{ borderColor: secondary, color: secondary }}
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { title: "Fast", desc: "Lightning quick performance" },
            { title: "Secure", desc: "Enterprise-grade security" },
            { title: "Scalable", desc: "Grows with your team" },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              className="p-5 rounded-xl"
              style={{ backgroundColor: surface }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <div
                className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${[primary, secondary, accent][i]}20` }}
              >
                <div
                  className="w-5 h-5 rounded"
                  style={{ backgroundColor: [primary, secondary, accent][i] }}
                />
              </div>
              <h3 className="font-semibold mb-1" style={{ color: surfaceText }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: surfaceTextMuted }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
