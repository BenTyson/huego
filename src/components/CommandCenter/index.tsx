"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { CommandBar } from "./CommandBar";
import { CommandPanel } from "./CommandPanel";
import { usePaletteStore } from "@/store/palette";

// Lazy load modal components
const ExportModal = dynamic(
  () => import("../ExportModal").then((mod) => mod.ExportModal),
  { ssr: false }
);
const AccessibilityPanel = dynamic(
  () => import("../AccessibilityPanel").then((mod) => mod.AccessibilityPanel),
  { ssr: false }
);
const ImportModal = dynamic(
  () => import("../ImportModal").then((mod) => mod.ImportModal),
  { ssr: false }
);
const ImageDropZone = dynamic(
  () => import("../ImageDropZone").then((mod) => mod.ImageDropZone),
  { ssr: false }
);
const HistoryBrowser = dynamic(
  () => import("../HistoryBrowser").then((mod) => mod.HistoryBrowser),
  { ssr: false }
);
const PublishModal = dynamic(
  () => import("../PublishModal").then((mod) => mod.PublishModal),
  { ssr: false }
);
const AIAssistantModal = dynamic(
  () => import("../AIAssistantModal").then((mod) => mod.AIAssistantModal),
  { ssr: false }
);

// Toast component
function Toast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <motion.div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
    >
      <div className="px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium shadow-lg">
        {message}
      </div>
    </motion.div>
  );
}

export function CommandCenter() {
  const [showPanel, setShowPanel] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [showHistoryBrowser, setShowHistoryBrowser] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { undo, redo, shuffle, invert, savePalette } = usePaletteStore();

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToastMessage = useCallback((message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setShowToast(message);
    toastTimerRef.current = setTimeout(() => setShowToast(null), 2000);
  }, []);

  const handleSave = useCallback(() => {
    savePalette();
    showToastMessage("Palette saved!");
  }, [savePalette, showToastMessage]);

  const handleShuffle = useCallback(() => {
    shuffle();
    showToastMessage("Colors shuffled");
  }, [shuffle, showToastMessage]);

  const handleInvert = useCallback(() => {
    invert();
    showToastMessage("Colors inverted");
  }, [invert, showToastMessage]);

  return (
    <>
      {/* Main command bar */}
      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <CommandBar
          onTogglePanel={() => setShowPanel(!showPanel)}
          isPanelOpen={showPanel}
          onShowToast={showToastMessage}
          onExport={() => setShowExportModal(true)}
        />
      </motion.div>

      {/* Command panel */}
      <CommandPanel
        isOpen={showPanel}
        onClose={() => setShowPanel(false)}
        onUndo={undo}
        onRedo={redo}
        onHistory={() => {
          setShowPanel(false);
          setShowHistoryBrowser(true);
        }}
        onShuffle={handleShuffle}
        onInvert={handleInvert}
        onAI={() => {
          setShowPanel(false);
          setShowAIModal(true);
        }}
        onAccessibility={() => {
          setShowPanel(false);
          setShowAccessibilityPanel(true);
        }}
        onExtract={() => {
          setShowPanel(false);
          setShowExtractModal(true);
        }}
        onImport={() => {
          setShowPanel(false);
          setShowImportModal(true);
        }}
        onExport={() => {
          setShowPanel(false);
          setShowExportModal(true);
        }}
        onPublish={() => {
          setShowPanel(false);
          setShowPublishModal(true);
        }}
        onSave={handleSave}
      />

      {/* Modals */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onUpgradeClick={() => setShowExportModal(false)}
      />
      <AccessibilityPanel
        isOpen={showAccessibilityPanel}
        onClose={() => setShowAccessibilityPanel(false)}
        onUpgradeClick={() => setShowAccessibilityPanel(false)}
      />
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onShowToast={showToastMessage}
      />
      <ImageDropZone
        isOpen={showExtractModal}
        onClose={() => setShowExtractModal(false)}
        onShowToast={showToastMessage}
        onUpgradeClick={() => setShowExtractModal(false)}
      />
      <HistoryBrowser
        isOpen={showHistoryBrowser}
        onClose={() => setShowHistoryBrowser(false)}
      />
      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onUpgradeClick={() => setShowPublishModal(false)}
        onShowToast={showToastMessage}
      />
      <AIAssistantModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onUpgradeClick={() => setShowAIModal(false)}
        onShowToast={showToastMessage}
      />

      {/* Toast */}
      <Toast message={showToast} />
    </>
  );
}
