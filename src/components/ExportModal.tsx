"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore } from "@/store/palette";
import { useIsPremium } from "@/store/subscription";
import {
  exportOptions,
  exportPalette,
  exportCSS,
  exportSCSS,
  exportTailwindWithOptions,
  exportJSON,
  exportArray,
  exportSVG,
  type ExportFormat,
  type TailwindVersion,
  type ColorSpace,
} from "@/lib/export";
import { FREE_EXPORT_FORMATS } from "@/lib/feature-limits";
import { AdUnit } from "./ads/AdUnit";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { CloseButton } from "./ui/CloseButton";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick?: () => void;
}

export function ExportModal({ isOpen, onClose, onUpgradeClick }: ExportModalProps) {
  const { colors } = usePaletteStore();
  const isPremium = useIsPremium();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("css");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [includeShadeScales, setIncludeShadeScales] = useState(true);
  const [tailwindVersion, setTailwindVersion] = useState<TailwindVersion>("v3");
  const [colorSpace, setColorSpace] = useState<ColorSpace>("hex");

  const isFormatLocked = (format: ExportFormat) => {
    if (isPremium) return false;
    return !FREE_EXPORT_FORMATS.includes(format as typeof FREE_EXPORT_FORMATS[number]);
  };

  const getPreview = useCallback((): string => {
    switch (selectedFormat) {
      case "css":
        return exportCSS(colors);
      case "scss":
        return exportSCSS(colors);
      case "tailwind":
        return exportTailwindWithOptions(colors, {
          version: tailwindVersion,
          colorSpace: colorSpace,
          includeShades: includeShadeScales,
        });
      case "json":
        return exportJSON(colors);
      case "array":
        return exportArray(colors);
      case "svg":
        return exportSVG(colors);
      case "png":
        return "/* PNG preview not available - click Download to save */";
      case "pdf":
        return "/* PDF preview not available - click Download to save */";
      case "ase":
        return "/* ASE (Adobe Swatch Exchange) preview not available - click Download to save */";
      default:
        return "";
    }
  }, [selectedFormat, colors, includeShadeScales, tailwindVersion, colorSpace]);

  const handleCopy = useCallback(async () => {
    // For text formats, copy the preview content directly (includes Tailwind options)
    const textFormats: ExportFormat[] = ["css", "scss", "tailwind", "json", "array", "svg"];
    if (textFormats.includes(selectedFormat)) {
      try {
        await navigator.clipboard.writeText(getPreview());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback to exportPalette
        const success = await exportPalette(selectedFormat, colors, "copy");
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }
    } else {
      const success = await exportPalette(selectedFormat, colors, "copy");
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  }, [selectedFormat, colors, getPreview]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);

    // For Tailwind, handle the custom options
    if (selectedFormat === "tailwind") {
      const content = getPreview();
      const extension = tailwindVersion === "v4" ? ".css" : ".js";
      const mimeType = tailwindVersion === "v4" ? "text/css" : "text/javascript";
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `huego-palette${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      await exportPalette(selectedFormat, colors, "download");
    }

    setDownloading(false);
  }, [selectedFormat, colors, getPreview, tailwindVersion]);

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
              <CloseButton onClick={onClose} />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
              {/* Format Selector & Options */}
              <div className="w-full md:w-56 flex-shrink-0 border-b md:border-b-0 md:border-r border-zinc-800 overflow-y-auto">
                {/* Format List */}
                <div className="p-4">
                  <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
                    Format
                  </div>
                  <div className="space-y-1">
                    {exportOptions.map((option) => {
                      const locked = isFormatLocked(option.id);
                      return (
                        <button
                          key={option.id}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors relative ${
                            selectedFormat === option.id && !locked
                              ? "bg-white/10 text-white"
                              : locked
                              ? "text-zinc-500 cursor-not-allowed"
                              : "text-zinc-400 hover:text-white hover:bg-white/5"
                          }`}
                          onClick={() => {
                            if (locked && onUpgradeClick) {
                              onUpgradeClick();
                            } else if (!locked) {
                              setSelectedFormat(option.id);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm">{option.label}</div>
                            {locked && (
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-amber-500"
                              >
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                            )}
                          </div>
                          <div className="text-xs opacity-60">
                            {locked ? "Premium" : option.description}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tailwind Options - shown when Tailwind is selected */}
                {selectedFormat === "tailwind" && (
                  <div className="p-4 pt-0">
                    <div className="border-t border-zinc-800 pt-4">
                      <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
                        Tailwind Options
                      </div>

                      {/* Version Selection */}
                      <div className="mb-4">
                        <div className="text-xs text-zinc-400 mb-2">Version</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(["v3", "v4"] as TailwindVersion[]).map((version) => (
                            <button
                              key={version}
                              onClick={() => setTailwindVersion(version)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                                tailwindVersion === version
                                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                                  : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                              }`}
                            >
                              {version === "v3" ? "v3" : "v4"}
                              <span className="block text-[10px] opacity-70 mt-0.5">
                                {version === "v3" ? "JS Config" : "CSS Theme"}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color Space Selection */}
                      <div className="mb-4">
                        <div className="text-xs text-zinc-400 mb-2">Color Space</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(["hex", "oklch", "rgb", "hsl"] as ColorSpace[]).map((space) => (
                            <button
                              key={space}
                              onClick={() => setColorSpace(space)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                                colorSpace === space
                                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                                  : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                              }`}
                            >
                              {space === "hex" ? "Hex" : space === "oklch" ? "OKLCH" : space === "rgb" ? "RGB" : "HSL"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Include Shades Toggle */}
                      <div>
                        <div className="text-xs text-zinc-400 mb-2">Shade Scale</div>
                        <button
                          onClick={() => setIncludeShadeScales(!includeShadeScales)}
                          className={`w-full px-3 py-2.5 rounded-lg transition-all flex items-center justify-between ${
                            includeShadeScales
                              ? "bg-indigo-500/20 border border-indigo-500/50 text-white"
                              : "bg-zinc-800 border border-transparent text-zinc-400 hover:text-white hover:bg-zinc-700"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {includeShadeScales ? "Full scale (50-950)" : "Single color only"}
                          </span>
                          <div
                            className={`w-8 h-5 rounded-full transition-colors relative ${
                              includeShadeScales ? "bg-indigo-500" : "bg-zinc-600"
                            }`}
                          >
                            <span
                              className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                              style={{ left: includeShadeScales ? "14px" : "2px" }}
                            />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Preview Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                  <span className="text-sm text-zinc-400">
                    {selectedOption?.label} Preview
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {selectedFormat === "tailwind" && tailwindVersion === "v4" ? ".css" : selectedOption?.extension}
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

            {/* Ad Banner for free users */}
            {!isPremium && (
              <div className="border-t border-zinc-800 p-3 bg-zinc-900/50">
                <AdUnit
                  slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_EXPORT || "export-modal"}
                  format="horizontal"
                  responsive={true}
                  className="min-h-[90px]"
                />
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              {!["png", "pdf", "ase"].includes(selectedFormat) && (
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
                    <LoadingSpinner size="sm" variant="dark" />
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
