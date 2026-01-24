"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore } from "@/store/palette";
import { useIsPremium } from "@/store/subscription";
import {
  extractColorsFromImage,
  harmonizeExtractedColors,
  canExtract,
  getRemainingExtractions,
  incrementExtractionCount,
} from "@/lib/extract";
import { createColor } from "@/lib/colors";
import { CloseButton } from "./ui/CloseButton";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { ExtractedPalette } from "./image-extract/ExtractedPalette";
import { HarmonizeToggle } from "./image-extract/HarmonizeToggle";

interface ImageDropZoneProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (message: string) => void;
  onUpgradeClick?: () => void;
}

export function ImageDropZone({
  isOpen,
  onClose,
  onShowToast,
  onUpgradeClick,
}: ImageDropZoneProps) {
  const { setColors } = usePaletteStore();
  const isPremium = useIsPremium();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<
    { hex: string; name: string; contrastColor: string }[] | null
  >(null);
  const [harmonize, setHarmonize] = useState(true);

  // Cleanup object URL on unmount or when URL changes to prevent memory leak
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const remaining = getRemainingExtractions(isPremium);
  const canExtractNow = canExtract(isPremium);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      if (!canExtractNow) {
        setError("Free extraction limit reached. Upgrade to Premium for unlimited extractions.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please drop an image file");
        return;
      }

      setError(null);
      setIsProcessing(true);
      setExtractedColors(null);

      // Revoke previous URL if exists to prevent memory leak
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }

      // Show preview
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setPreviewUrl(url);

      try {
        let colors = await extractColorsFromImage(file);

        if (harmonize) {
          colors = harmonizeExtractedColors(colors);
        }

        setExtractedColors(
          colors.map((c) => ({
            hex: c.hex,
            name: c.name,
            contrastColor: c.contrastColor,
          }))
        );

        incrementExtractionCount();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to extract colors");
        // Cleanup URL on error
        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
          previewUrlRef.current = null;
        }
        setPreviewUrl(null);
      } finally {
        setIsProcessing(false);
      }
    },
    [canExtractNow, harmonize]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleApply = useCallback(() => {
    if (!extractedColors) return;

    // Reconstruct Color objects
    const colors = extractedColors.map((c) => createColor(c.hex));

    setColors(colors);
    onShowToast?.("Colors extracted!");
    onClose();

    // Cleanup URL to prevent memory leak
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    setExtractedColors(null);
  }, [extractedColors, setColors, onShowToast, onClose]);

  const handleReset = useCallback(() => {
    // Cleanup URL to prevent memory leak
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    setExtractedColors(null);
    setError(null);
  }, []);

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
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Extract Colors from Image
                </h2>
                {!isPremium && (
                  <p className="text-xs text-zinc-500 mt-1">
                    {remaining} free extraction{remaining !== 1 ? "s" : ""} remaining this session
                  </p>
                )}
              </div>
              <CloseButton onClick={onClose} />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Drop Zone */}
              {!previewUrl && (
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
                    isDragging
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-zinc-700 hover:border-zinc-600"
                  } ${!canExtractNow ? "opacity-50" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={!canExtractNow}
                  />

                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-zinc-400"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    <p className="text-white font-medium mb-1">
                      {isDragging ? "Drop image here" : "Drop an image or click to upload"}
                    </p>
                    <p className="text-zinc-500 text-sm">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              )}

              {/* Image Preview & Extracted Colors */}
              {previewUrl && (
                <div className="space-y-4">
                  {/* Image Preview */}
                  <div className="relative rounded-xl overflow-hidden bg-zinc-800">
                    <img
                      src={previewUrl}
                      alt="Uploaded image"
                      className="w-full h-48 object-contain"
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <LoadingSpinner size="md" variant="light" />
                      </div>
                    )}
                  </div>

                  {/* Harmonize Toggle */}
                  <HarmonizeToggle enabled={harmonize} onChange={setHarmonize} />

                  {/* Extracted Colors */}
                  {extractedColors && <ExtractedPalette colors={extractedColors} />}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm">{error}</p>
                  {!canExtractNow && onUpgradeClick && (
                    <button
                      onClick={onUpgradeClick}
                      className="mt-2 text-amber-500 hover:text-amber-400 text-sm font-medium"
                    >
                      Upgrade to Premium for unlimited extractions →
                    </button>
                  )}
                </div>
              )}

              {/* Premium Upsell */}
              {!isPremium && !error && (
                <div className="p-4 rounded-lg bg-zinc-800/50 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-300">
                      Want unlimited extractions?
                    </p>
                    <p className="text-xs text-zinc-500">
                      Premium members get unlimited extractions + URL extraction
                    </p>
                  </div>
                  <button
                    onClick={onUpgradeClick}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:from-amber-400 hover:to-orange-400 transition-all"
                  >
                    Upgrade
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-800">
              {previewUrl && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Try Another
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!extractedColors}
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
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Apply Palette
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
