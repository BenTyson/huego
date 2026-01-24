"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  usePaletteStore,
  useAISuggestions,
  useAILoading,
  useAIError,
} from "@/store/palette";
import { useIsPremium } from "@/store/subscription";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { CloseButton } from "./ui/CloseButton";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick?: () => void;
  onShowToast?: (message: string) => void;
}

// Example prompts for inspiration
const EXAMPLE_PROMPTS = [
  "Warm sunset",
  "Ocean waves",
  "Forest morning",
  "Neon cyberpunk",
  "Minimalist tech",
  "Autumn leaves",
  "Cotton candy",
  "Vintage retro",
];

export function AIAssistantModal({
  isOpen,
  onClose,
  onShowToast,
}: AIAssistantModalProps) {
  const isPremium = useIsPremium();
  const aiSuggestions = useAISuggestions();
  const aiLoading = useAILoading();
  const aiError = useAIError();

  const { generateAISuggestions, applySuggestion, clearSuggestions } =
    usePaletteStore();

  const [prompt, setPrompt] = useState("");

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    await generateAISuggestions(prompt.trim(), isPremium);
  }, [prompt, isPremium, generateAISuggestions]);

  const handleApply = useCallback(() => {
    applySuggestion();
    onShowToast?.("AI palette applied!");
    onClose();
    setPrompt("");
  }, [applySuggestion, onShowToast, onClose]);

  const handleRegenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    await generateAISuggestions(prompt.trim(), isPremium);
  }, [prompt, isPremium, generateAISuggestions]);

  const handleClose = useCallback(() => {
    clearSuggestions();
    setPrompt("");
    onClose();
  }, [clearSuggestions, onClose]);

  const handleChipClick = useCallback((examplePrompt: string) => {
    setPrompt(examplePrompt);
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
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] md:max-h-[85vh] bg-zinc-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            {/* Header with gradient accent */}
            <div className="relative px-6 py-4 border-b border-white/10">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                      <path d="M19 15l.88 2.62L22.5 18.5l-2.62.88L19 22l-.88-2.62L15.5 18.5l2.62-.88L19 15z" />
                      <path d="M5 17l.44 1.31L6.75 18.75l-1.31.44L5 20.5l-.44-1.31L3.25 18.75l1.31-.44L5 17z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">AI Color Assistant</h2>
                </div>
                <CloseButton onClick={handleClose} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Describe your palette
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., &quot;warm sunset over mountains&quot; or &quot;modern tech startup&quot;"
                  maxLength={500}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  disabled={aiLoading}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-white/40">
                    {prompt.length}/500 characters
                  </span>
                </div>
              </div>

              {/* Example Prompts */}
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Try these prompts
                </label>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map((example) => (
                    <button
                      key={example}
                      onClick={() => handleChipClick(example)}
                      disabled={aiLoading}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white/70 hover:bg-purple-500/30 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              {!aiSuggestions && (
                <motion.button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || aiLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {aiLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Generating...
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
                        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                      </svg>
                      Generate Palette
                    </>
                  )}
                </motion.button>
              )}

              {/* Error Display */}
              {aiError && (
                <div className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                  {aiError}
                </div>
              )}

              {/* Suggestions Preview */}
              {aiSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <label className="block text-sm text-white/60">
                    Generated Palette
                  </label>

                  {/* Color Swatches */}
                  <div className="space-y-2">
                    {aiSuggestions.map((color, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div
                          className="w-12 h-12 rounded-lg shadow-lg flex-shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-sm truncate">
                            {color.name}
                          </div>
                          <div className="text-white/50 text-xs font-mono">
                            {color.hex}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleRegenerate}
                      disabled={aiLoading}
                      className="flex-1 h-11 rounded-xl bg-white/10 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-colors disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {aiLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 2v6h-6" />
                          <path d="M3 12a9 9 0 0115-6.7L21 8" />
                          <path d="M3 22v-6h6" />
                          <path d="M21 12a9 9 0 01-15 6.7L3 16" />
                        </svg>
                      )}
                      Regenerate
                    </motion.button>
                    <motion.button
                      onClick={handleApply}
                      disabled={aiLoading}
                      className="flex-1 h-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Apply Palette
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Premium hint for free users */}
              {!isPremium && (
                <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    Free: 3/minute, 10/day. Upgrade to Pro for unlimited AI generation.
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
