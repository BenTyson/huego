"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore } from "@/store/palette";
import { useIsPremium } from "@/store/subscription";
import { CloseButton } from "./ui/CloseButton";
import { ContrastPanel } from "./accessibility/ContrastPanel";
import { ColorBlindnessPanel } from "./accessibility/ColorBlindnessPanel";

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick?: () => void;
}

type Tab = "contrast" | "colorblind";

export function AccessibilityPanel({ isOpen, onClose, onUpgradeClick }: AccessibilityPanelProps) {
  const { colors } = usePaletteStore();
  const isPremium = useIsPremium();
  const [activeTab, setActiveTab] = useState<Tab>("contrast");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[80vh] bg-zinc-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white">Accessibility</h2>
              <CloseButton onClick={onClose} />
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-800">
              <button
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === "contrast"
                    ? "text-white border-b-2 border-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                onClick={() => setActiveTab("contrast")}
              >
                WCAG Contrast
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === "colorblind"
                    ? "text-white border-b-2 border-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                onClick={() => setActiveTab("colorblind")}
              >
                Color Blindness
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "contrast" ? (
                <ContrastPanel
                  colors={colors}
                  isPremium={isPremium}
                  onUpgradeClick={onUpgradeClick}
                />
              ) : (
                <ColorBlindnessPanel
                  colors={colors}
                  isPremium={isPremium}
                  onUpgradeClick={onUpgradeClick}
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-zinc-900 hover:bg-zinc-200 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
