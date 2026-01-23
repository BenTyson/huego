"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePaletteStore, useHistory, useHistoryIndex } from "@/store/palette";

interface HistoryBrowserProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryBrowser({ isOpen, onClose }: HistoryBrowserProps) {
  const { loadPalette, colors } = usePaletteStore();
  const history = useHistory();
  const currentIndex = useHistoryIndex();

  const handleSelect = (index: number) => {
    if (history[index]) {
      loadPalette(history[index]);
      onClose();
    }
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

          {/* Panel */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[700px] md:max-h-[80vh] bg-zinc-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Palette History
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  {history.length} palette{history.length !== 1 ? "s" : ""} in
                  history
                </p>
              </div>
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
            <div className="flex-1 overflow-y-auto p-4">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-zinc-500 mb-2">No history yet</div>
                  <p className="text-xs text-zinc-600">
                    Generate some palettes with Spacebar to see history
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Current palette */}
                  <button
                    className="group relative rounded-lg overflow-hidden border-2 border-amber-500"
                    disabled
                  >
                    <div className="flex h-16">
                      {colors.map((color, i) => (
                        <div
                          key={i}
                          className="flex-1"
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="text-xs font-medium text-amber-400">
                        Current
                      </span>
                    </div>
                  </button>

                  {/* History items (most recent first) */}
                  {[...history].reverse().map((palette, reverseIndex) => {
                    const originalIndex = history.length - 1 - reverseIndex;
                    const isCurrent = originalIndex === currentIndex;

                    return (
                      <button
                        key={palette.id}
                        onClick={() => handleSelect(originalIndex)}
                        className={`group relative rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-lg ${
                          isCurrent
                            ? "border-2 border-white/50"
                            : "border border-zinc-700 hover:border-zinc-500"
                        }`}
                      >
                        <div className="flex h-16">
                          {palette.colors.map((color, i) => (
                            <div
                              key={i}
                              className="flex-1"
                              style={{ backgroundColor: color.hex }}
                            />
                          ))}
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <span className="text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            Load
                          </span>
                        </div>

                        {/* Index badge */}
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/50 text-[10px] text-white/70">
                          {originalIndex + 1}
                        </div>

                        {/* Timestamp */}
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/50 text-[10px] text-white/50">
                          {formatTimestamp(palette.createdAt)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with shortcuts hint */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-800/30">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <div className="flex gap-4">
                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-300">
                      Ctrl+Z
                    </kbd>{" "}
                    Undo
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-300">
                      Ctrl+Y
                    </kbd>{" "}
                    Redo
                  </span>
                </div>
                <span>Click any palette to load</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(timestamp).toLocaleDateString();
}
