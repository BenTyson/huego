"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore, useColors } from "@/store/palette";
import { createColor } from "@/lib/colors";
import { PaletteSidebar } from "./PaletteSidebar";
import { PreviewTypeSelector, type PreviewType } from "./PreviewTypeSelector";
import { WebsitePreview } from "./WebsitePreview";
import { MobileAppPreview } from "./MobileAppPreview";
import { DashboardPreview } from "./DashboardPreview";

export function ContextView() {
  // Use individual selectors for optimized re-renders
  const colors = useColors();
  const { setColor } = usePaletteStore();
  const [activePreview, setActivePreview] = useState<PreviewType>("website");

  const handleColorChange = useCallback(
    (index: number, hex: string) => {
      const newColor = createColor(hex);
      setColor(index, newColor);
    },
    [setColor]
  );

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
      <PaletteSidebar colors={colors} onColorChange={handleColorChange} />

      {/* Preview Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Preview Type Selector */}
        <PreviewTypeSelector activePreview={activePreview} onSelect={setActivePreview} />

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
