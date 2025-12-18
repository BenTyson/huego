"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore } from "@/store/palette";
import { createColor } from "@/lib/colors";
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
  const { colors, setColor } = usePaletteStore();
  const [activePreview, setActivePreview] = useState<PreviewType>("website");
  const colorInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleColorChange = useCallback((index: number, hex: string) => {
    const newColor = createColor(hex);
    setColor(index, newColor);
  }, [setColor]);

  const handleEditClick = useCallback((index: number) => {
    colorInputRefs.current[index]?.click();
  }, []);

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
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Hidden color input */}
              <input
                ref={(el) => { colorInputRefs.current[index] = el; }}
                type="color"
                value={color.hex}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="sr-only"
                aria-label={`Edit color ${index + 1}`}
              />
              {/* Clickable color swatch */}
              <button
                className="w-10 h-10 rounded-lg flex-shrink-0 relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: color.hex }}
                onClick={() => handleEditClick(index)}
                title="Click to edit color"
              >
                {/* Edit icon on hover */}
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={color.contrastColor === "white" ? "#fff" : "#000"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </span>
              </button>
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
        {/* Preview Type Selector - positioned top-right */}
        <div className="flex items-center justify-end gap-2 p-4 pr-6">
          {previewOptions.map((option) => (
            <motion.button
              key={option.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activePreview === option.id
                  ? "bg-white/20 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/10"
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
