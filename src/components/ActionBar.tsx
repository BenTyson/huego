"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore, useCanUndo, useCanRedo } from "@/store/palette";
import { copyShareUrl } from "@/lib/share";
import { ExportModal } from "./ExportModal";
import { AccessibilityPanel } from "./AccessibilityPanel";
import type { HarmonyType } from "@/lib/types";

const harmonyOptions: { value: HarmonyType; label: string }[] = [
  { value: "random", label: "Random" },
  { value: "analogous", label: "Analogous" },
  { value: "complementary", label: "Complementary" },
  { value: "triadic", label: "Triadic" },
  { value: "split-complementary", label: "Split Comp." },
  { value: "monochromatic", label: "Mono" },
];

export function ActionBar() {
  const { colors, undo, redo, harmonyType, setHarmonyType, savePalette, savedPalettes } =
    usePaletteStore();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showHarmonyPicker, setShowHarmonyPicker] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);

  const showToastMessage = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 2000);
  };

  const handleShare = async () => {
    const success = await copyShareUrl(colors);
    showToastMessage(success ? "Link copied!" : "Failed to copy");
  };

  const handleSave = () => {
    const result = savePalette();
    if (result) {
      showToastMessage("Palette saved!");
    } else {
      showToastMessage(`Limit reached (${savedPalettes.length}/10)`);
    }
  };

  return (
    <>
      {/* Action buttons */}
      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Harmony selector */}
        <div className="relative">
          <motion.button
            className="h-10 px-4 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/50 transition-colors text-sm font-medium flex items-center gap-2"
            onClick={() => setShowHarmonyPicker(!showHarmonyPicker)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 1 0 20" />
              <path d="M12 2a10 10 0 0 0 0 20" />
              <line x1="2" y1="12" x2="22" y2="12" />
            </svg>
            <span className="hidden sm:inline">
              {harmonyOptions.find((h) => h.value === harmonyType)?.label}
            </span>
          </motion.button>

          <AnimatePresence>
            {showHarmonyPicker && (
              <motion.div
                className="absolute bottom-full mb-2 left-0 p-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
              >
                {harmonyOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      harmonyType === option.value
                        ? "bg-white/20 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                    onClick={() => {
                      setHarmonyType(option.value);
                      setShowHarmonyPicker(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Undo */}
        <motion.button
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={undo}
          disabled={!canUndo}
          whileHover={canUndo ? { scale: 1.1 } : {}}
          whileTap={canUndo ? { scale: 0.9 } : {}}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
          </svg>
        </motion.button>

        {/* Redo */}
        <motion.button
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={redo}
          disabled={!canRedo}
          whileHover={canRedo ? { scale: 1.1 } : {}}
          whileTap={canRedo ? { scale: 0.9 } : {}}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 7v6h-6" />
            <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
          </svg>
        </motion.button>

        {/* Save */}
        <motion.button
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-colors"
          onClick={handleSave}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17,21 17,13 7,13 7,21" />
            <polyline points="7,3 7,8 15,8" />
          </svg>
        </motion.button>

        {/* Export */}
        <motion.button
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-colors"
          onClick={() => setShowExportModal(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </motion.button>

        {/* Accessibility */}
        <motion.button
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-colors"
          onClick={() => setShowAccessibilityPanel(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="8" r="2" />
            <path d="M12 10v4" />
            <path d="M9 14l3 3 3-3" />
            <path d="M8 11h8" />
          </svg>
        </motion.button>

        {/* Share */}
        <motion.button
          className="h-10 px-4 rounded-full bg-white/90 text-zinc-900 font-medium text-sm flex items-center gap-2 hover:bg-white transition-colors"
          onClick={handleShare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span className="hidden sm:inline">Share</span>
        </motion.button>
      </motion.div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      {/* Accessibility Panel */}
      <AccessibilityPanel
        isOpen={showAccessibilityPanel}
        onClose={() => setShowAccessibilityPanel(false)}
      />

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white text-zinc-900 text-sm font-medium shadow-lg z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
