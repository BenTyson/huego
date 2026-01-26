"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore, useColors } from "@/store/palette";
import { createColor } from "@/lib/colors";
import { PaletteSidebar } from "./PaletteSidebar";
import { PreviewTypeSelector, type PreviewType, type PreviewTheme } from "./PreviewTypeSelector";
import { WebsitePreview } from "./WebsitePreview";
import { MobileAppPreview } from "./MobileAppPreview";
import { DashboardPreview } from "./DashboardPreview";
import { ButtonStatesPreview } from "./previews/ButtonStatesPreview";
import { FormControlsPreview } from "./previews/FormControlsPreview";
import { PricingCardsPreview } from "./previews/PricingCardsPreview";
import { StatsCardsPreview } from "./previews/StatsCardsPreview";
import {
  type GlobalAdjustments,
  DEFAULT_ADJUSTMENTS,
  applyGlobalAdjustments,
} from "@/lib/global-adjustments";

export function ContextView() {
  // Use individual selectors for optimized re-renders
  const colors = useColors();
  const { setColor } = usePaletteStore();
  const [activePreview, setActivePreview] = useState<PreviewType>("website");
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>("light");

  // Global adjustment state
  const [adjustments, setAdjustments] = useState<GlobalAdjustments>(DEFAULT_ADJUSTMENTS);

  // Compute adjusted colors for display
  const adjustedColors = useMemo(
    () => applyGlobalAdjustments(colors, adjustments),
    [colors, adjustments]
  );

  const handleColorChange = useCallback(
    (index: number, hex: string) => {
      const newColor = createColor(hex);
      setColor(index, newColor);
    },
    [setColor]
  );

  const handleAdjustmentChange = useCallback((newAdj: GlobalAdjustments) => {
    setAdjustments(newAdj);
  }, []);

  const handleAdjustmentReset = useCallback(() => {
    setAdjustments(DEFAULT_ADJUSTMENTS);
  }, []);

  const handleAdjustmentApply = useCallback(() => {
    // Commit adjusted colors to store
    adjustedColors.forEach((color, i) => {
      setColor(i, color);
    });
    // Reset adjustments
    setAdjustments(DEFAULT_ADJUSTMENTS);
  }, [adjustedColors, setColor]);

  const renderPreview = () => {
    switch (activePreview) {
      case "website":
        return <WebsitePreview colors={adjustedColors} theme={previewTheme} />;
      case "mobile":
        return <MobileAppPreview colors={adjustedColors} theme={previewTheme} />;
      case "dashboard":
        return <DashboardPreview colors={adjustedColors} theme={previewTheme} />;
      case "buttons":
        return <ButtonStatesPreview colors={adjustedColors} theme={previewTheme} />;
      case "forms":
        return <FormControlsPreview colors={adjustedColors} theme={previewTheme} />;
      case "pricing":
        return <PricingCardsPreview colors={adjustedColors} theme={previewTheme} />;
      case "stats":
        return <StatsCardsPreview colors={adjustedColors} theme={previewTheme} />;
      default:
        return <WebsitePreview colors={adjustedColors} theme={previewTheme} />;
    }
  };

  return (
    <div className="h-dvh w-screen flex flex-col md:flex-row overflow-hidden bg-zinc-900">
      {/* Palette Sidebar */}
      <PaletteSidebar
        colors={adjustedColors}
        onColorChange={handleColorChange}
        adjustments={adjustments}
        onAdjustmentChange={handleAdjustmentChange}
        onAdjustmentReset={handleAdjustmentReset}
        onAdjustmentApply={handleAdjustmentApply}
      />

      {/* Preview Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Preview Type Selector */}
        <PreviewTypeSelector
          activePreview={activePreview}
          onSelect={setActivePreview}
          theme={previewTheme}
          onThemeChange={setPreviewTheme}
        />

        {/* Preview Container */}
        <div className="flex-1 p-4 md:p-6 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activePreview}-${previewTheme}`}
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
