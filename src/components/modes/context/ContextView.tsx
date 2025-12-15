"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore } from "@/store/palette";
import { WebsitePreview } from "./WebsitePreview";
import { MobileAppPreview } from "./MobileAppPreview";
import { DashboardPreview } from "./DashboardPreview";

type PreviewType = "website" | "mobile" | "dashboard";

const previewOptions: { id: PreviewType; label: string; icon: React.ReactNode }[] = [
  {
    id: "website",
    label: "Website",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
];

export function ContextView() {
  const { colors } = usePaletteStore();
  const [activePreview, setActivePreview] = useState<PreviewType>("website");

  const renderPreview = () => {
    switch (activePreview) {
      case "website":
        return <WebsitePreview colors={colors} />;
      case "mobile":
        return <MobileAppPreview colors={colors} />;
      case "dashboard":
        return <DashboardPreview colors={colors} />;
      default:
        return <WebsitePreview colors={colors} />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-zinc-900">
      {/* Palette Sidebar */}
      <div className="w-full md:w-72 flex-shrink-0 p-4 md:p-6 flex flex-col">
        <h2 className="text-lg font-semibold text-white mb-4">Your Palette</h2>

        {/* Color List */}
        <div className="space-y-2 mb-6">
          {colors.map((color, index) => (
            <motion.div
              key={`${color.hex}-${index}`}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className="w-10 h-10 rounded-lg flex-shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-mono text-white">{color.hex}</div>
                <div className="text-xs text-zinc-400 truncate">{color.name}</div>
              </div>
              <div className="text-xs text-zinc-500">
                {["Primary", "Secondary", "Accent", "Background", "Surface"][index]}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Role Legend */}
        <div className="mt-auto">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Color Roles</h3>
          <div className="text-xs text-zinc-500 space-y-1">
            <div><span className="text-zinc-300">Primary:</span> Main brand color</div>
            <div><span className="text-zinc-300">Secondary:</span> Supporting color</div>
            <div><span className="text-zinc-300">Accent:</span> Highlights & CTAs</div>
            <div><span className="text-zinc-300">Background:</span> Page background</div>
            <div><span className="text-zinc-300">Surface:</span> Cards & panels</div>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Preview Type Selector */}
        <div className="flex items-center justify-center gap-2 p-4">
          {previewOptions.map((option) => (
            <motion.button
              key={option.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activePreview === option.id
                  ? "bg-white text-zinc-900"
                  : "bg-white/10 text-white/70 hover:text-white hover:bg-white/20"
              }`}
              onClick={() => setActivePreview(option.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {option.icon}
              <span className="hidden sm:inline">{option.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Preview Container */}
        <div className="flex-1 p-4 md:p-6 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePreview}
              className="w-full h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderPreview()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
