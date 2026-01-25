"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface ShortcutGroup {
  title: string;
  shortcuts: { key: string; description: string }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Generation",
    shortcuts: [
      { key: "Space", description: "Generate new palette" },
      { key: "Ctrl+Z", description: "Undo" },
      { key: "Ctrl+Y", description: "Redo" },
    ],
  },
  {
    title: "Colors",
    shortcuts: [
      { key: "1-9", description: "Copy color to clipboard" },
      { key: "Shift+1-9", description: "Toggle lock on color" },
      { key: "C", description: "Copy all colors" },
    ],
  },
  {
    title: "Adjustments",
    shortcuts: [
      { key: "R", description: "Shuffle colors" },
      { key: "I", description: "Invert colors" },
      { key: "D", description: "Decrease saturation" },
      { key: "V", description: "Increase saturation" },
    ],
  },
  {
    title: "Navigation",
    shortcuts: [
      { key: "H", description: "Open history" },
      { key: "?", description: "Show this help" },
      { key: "Esc", description: "Close panel/modal" },
    ],
  },
];

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-overlay backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg bg-command-bg backdrop-blur-xl border border-command-border rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-command-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-foreground"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M6 8h.01" />
                      <path d="M10 8h.01" />
                      <path d="M14 8h.01" />
                      <path d="M18 8h.01" />
                      <path d="M8 12h8" />
                      <path d="M6 16h.01" />
                      <path d="M18 16h.01" />
                      <path d="M10 16h4" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Keyboard Shortcuts</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-command-hover transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="grid grid-cols-2 gap-6 p-6">
                {shortcutGroups.map((group, groupIndex) => (
                  <motion.div
                    key={group.title}
                    className="space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.05 }}
                  >
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.title}
                    </h3>
                    <div className="space-y-2">
                      {group.shortcuts.map((shortcut, index) => (
                        <motion.div
                          key={shortcut.key}
                          className="flex items-center justify-between gap-4"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: groupIndex * 0.05 + index * 0.02 }}
                        >
                          <span className="text-sm text-foreground/80">{shortcut.description}</span>
                          <kbd className="text-xs font-mono bg-secondary/50 text-muted-foreground px-2 py-1 rounded border border-border/50">
                            {shortcut.key}
                          </kbd>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-command-border bg-command-hover/30">
                <p className="text-xs text-muted-foreground text-center">
                  Press <kbd className="font-mono bg-secondary/50 px-1 rounded">Esc</kbd> to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
