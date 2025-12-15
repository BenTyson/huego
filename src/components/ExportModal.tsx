"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore } from "@/store/palette";
import {
  exportOptions,
  exportPalette,
  exportCSS,
  exportSCSS,
  exportTailwind,
  exportJSON,
  exportArray,
  exportSVG,
  type ExportFormat,
} from "@/lib/export";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { colors } = usePaletteStore();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("css");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const getPreview = useCallback((): string => {
    switch (selectedFormat) {
      case "css":
        return exportCSS(colors);
      case "scss":
        return exportSCSS(colors);
      case "tailwind":
        return exportTailwind(colors);
      case "json":
        return exportJSON(colors);
      case "array":
        return exportArray(colors);
      case "svg":
        return exportSVG(colors);
      case "png":
        return "/* PNG preview not available - click Download to save */";
      default:
        return "";
    }
  }, [selectedFormat, colors]);

  const handleCopy = useCallback(async () => {
    const success = await exportPalette(selectedFormat, colors, "copy");
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [selectedFormat, colors]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    await exportPalette(selectedFormat, colors, "download");
    setDownloading(false);
  }, [selectedFormat, colors]);

  const selectedOption = exportOptions.find((o) => o.id === selectedFormat);

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

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[700px] md:max-h-[80vh] bg-zinc-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white">Export Palette</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
              {/* Format Selector */}
              <div className="w-full md:w-48 flex-shrink-0 p-4 border-b md:border-b-0 md:border-r border-zinc-800 overflow-y-auto">
                <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
                  Format
                </div>
                <div className="space-y-1">
                  {exportOptions.map((option) => (
                    <button
                      key={option.id}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedFormat === option.id
                          ? "bg-white/10 text-white"
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                      onClick={() => setSelectedFormat(option.id)}
                    >
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs opacity-60">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Preview Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                  <span className="text-sm text-zinc-400">
                    {selectedOption?.label} Preview
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {selectedOption?.extension}
                  </span>
                </div>

                {/* Code Preview */}
                <div className="flex-1 overflow-auto p-4">
                  <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap break-all">
                    {getPreview()}
                  </pre>
                </div>

                {/* Palette Preview Strip */}
                <div className="flex h-12 border-t border-zinc-800">
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex-1"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              {selectedFormat !== "png" && (
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-800 text-white hover:bg-zinc-700 transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy Code
                    </>
                  )}
                </button>
              )}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-zinc-900 hover:bg-zinc-200 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {downloading ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Exporting...
                  </>
                ) : (
                  <>
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
                    Download
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
