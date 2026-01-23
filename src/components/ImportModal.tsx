"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore } from "@/store/palette";
import { importPalette, formatLabels, type ImportFormat } from "@/lib/import";
import type { Color } from "@/lib/types";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (message: string) => void;
}

const placeholderText = `Paste your colors in any format:

• Hex codes: #FF5733, #33FF57, #3357FF
• CSS variables:
  --primary: #FF5733;
  --secondary: #33FF57;
• Tailwind config:
  colors: { primary: '#FF5733' }
• JSON: ["#FF5733", "#33FF57"]
• HueGo JSON export

Auto-detected format will be shown below.`;

export function ImportModal({ isOpen, onClose, onShowToast }: ImportModalProps) {
  const { setColors } = usePaletteStore();
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) {
      return null;
    }
    return importPalette(input);
  }, [input]);

  const handleImport = () => {
    if (result?.success && result.colors.length > 0) {
      setColors(result.colors);
      onShowToast?.("Palette imported!");
      setInput("");
      onClose();
    }
  };

  const handleClear = () => {
    setInput("");
  };

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
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[80vh] bg-zinc-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white">Import Palette</h2>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Textarea */}
              <div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={placeholderText}
                  className="w-full h-48 p-4 rounded-xl bg-zinc-800 text-white text-sm font-mono placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                />
              </div>

              {/* Format detection */}
              {result && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-500">Detected format:</span>
                  <span
                    className={`px-2 py-1 rounded-lg ${
                      result.success
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {formatLabels[result.format]}
                  </span>
                  {result.success && (
                    <span className="text-zinc-500">
                      ({result.colors.length} colors)
                    </span>
                  )}
                </div>
              )}

              {/* Error message */}
              {result && !result.success && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {result.error}
                </div>
              )}

              {/* Preview */}
              {result?.success && result.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-2">
                    Preview
                  </h3>
                  <div className="flex rounded-lg overflow-hidden h-20">
                    {result.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center justify-center gap-1"
                        style={{ backgroundColor: color.hex }}
                      >
                        <span
                          className="text-xs font-mono"
                          style={{
                            color:
                              color.contrastColor === "white" ? "#fff" : "#000",
                          }}
                        >
                          {color.hex}
                        </span>
                        <span
                          className="text-[10px] opacity-70"
                          style={{
                            color:
                              color.contrastColor === "white" ? "#fff" : "#000",
                          }}
                        >
                          {color.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supported formats info */}
              {!input && (
                <div className="p-4 rounded-lg bg-zinc-800/50 space-y-2">
                  <h4 className="text-sm font-medium text-zinc-300">
                    Supported Formats
                  </h4>
                  <ul className="text-xs text-zinc-500 space-y-1">
                    <li>• Hex codes (comma, space, or newline separated)</li>
                    <li>• CSS custom properties (--color-name: #hex)</li>
                    <li>• Tailwind color config</li>
                    <li>• JSON arrays or objects with hex values</li>
                    <li>• HueGo JSON export format</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-800">
              {input && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!result?.success}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-zinc-900 hover:bg-zinc-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Import Palette
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
