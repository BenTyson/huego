"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { HarmonySelector } from "./HarmonySelector";
import { UndoRedoButtons } from "./UndoRedoButtons";
import { SaveButton } from "./SaveButton";
import { UtilityButtons } from "./UtilityButtons";
import { Toast } from "./Toast";

// Lazy load modal components for better initial page load
const ExportModal = dynamic(
  () => import("../ExportModal").then((mod) => mod.ExportModal),
  { ssr: false }
);
const AccessibilityPanel = dynamic(
  () => import("../AccessibilityPanel").then((mod) => mod.AccessibilityPanel),
  { ssr: false }
);
const PricingModal = dynamic(
  () => import("../PricingModal").then((mod) => mod.PricingModal),
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

export function ActionBar() {
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [showHistoryBrowser, setShowHistoryBrowser] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToastMessage = useCallback((message: string) => {
    // Clear any existing timer before setting a new one
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setShowToast(message);
    toastTimerRef.current = setTimeout(() => setShowToast(null), 2000);
  }, []);

  return (
    <>
      {/* Action buttons */}
      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <HarmonySelector onUpgradeClick={() => setShowPricingModal(true)} />
        <UndoRedoButtons onShowHistory={() => setShowHistoryBrowser(true)} />
        <SaveButton
          onShowToast={showToastMessage}
          onShowPricing={() => setShowPricingModal(true)}
        />
        <UtilityButtons
          onShowToast={showToastMessage}
          onShowExport={() => setShowExportModal(true)}
          onShowAccessibility={() => setShowAccessibilityPanel(true)}
          onShowImport={() => setShowImportModal(true)}
          onShowExtract={() => setShowExtractModal(true)}
        />
      </motion.div>

      {/* Modals */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onUpgradeClick={() => {
          setShowExportModal(false);
          setShowPricingModal(true);
        }}
      />
      <AccessibilityPanel
        isOpen={showAccessibilityPanel}
        onClose={() => setShowAccessibilityPanel(false)}
        onUpgradeClick={() => {
          setShowAccessibilityPanel(false);
          setShowPricingModal(true);
        }}
      />
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
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
        onUpgradeClick={() => {
          setShowExtractModal(false);
          setShowPricingModal(true);
        }}
      />
      <HistoryBrowser
        isOpen={showHistoryBrowser}
        onClose={() => setShowHistoryBrowser(false)}
      />

      {/* Toast notification */}
      <Toast message={showToast} />
    </>
  );
}
