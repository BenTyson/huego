"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CommandGroup } from "./CommandGroup";
import { CommandItem } from "./CommandItem";

interface CommandPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onHistory: () => void;
  onShuffle: () => void;
  onInvert: () => void;
  onAI: () => void;
  onAccessibility: () => void;
  onExtract: () => void;
  onImport: () => void;
  onExport: () => void;
  onPublish: () => void;
  onSave: () => void;
}

export function CommandPanel({
  isOpen,
  onClose,
  onUndo,
  onRedo,
  onHistory,
  onShuffle,
  onInvert,
  onAI,
  onAccessibility,
  onExtract,
  onImport,
  onExport,
  onPublish,
  onSave,
}: CommandPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 35,
            }}
          >
            <div className="bg-command-bg backdrop-blur-xl border border-command-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-command-border">
                <span className="text-sm font-medium text-foreground/90">Commands</span>
                <button
                  onClick={onClose}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-command-hover transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="grid grid-cols-3 gap-4 p-4">
                {/* Edit Group */}
                <CommandGroup title="Edit" delay={0.05}>
                  <CommandItem
                    label="Undo"
                    shortcut="Z"
                    onClick={onUndo}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 7v6h6" />
                        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                      </svg>
                    }
                  />
                  <CommandItem
                    label="Redo"
                    shortcut="Y"
                    onClick={onRedo}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 7v6h-6" />
                        <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
                      </svg>
                    }
                  />
                  <CommandItem
                    label="History"
                    shortcut="H"
                    onClick={onHistory}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    }
                  />
                  <CommandItem
                    label="Shuffle"
                    shortcut="R"
                    onClick={onShuffle}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="16 3 21 3 21 8" />
                        <line x1="4" y1="20" x2="21" y2="3" />
                        <polyline points="21 16 21 21 16 21" />
                        <line x1="15" y1="15" x2="21" y2="21" />
                        <line x1="4" y1="4" x2="9" y2="9" />
                      </svg>
                    }
                  />
                  <CommandItem
                    label="Invert"
                    shortcut="I"
                    onClick={onInvert}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2v20" />
                        <path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" opacity="0.3" />
                      </svg>
                    }
                  />
                </CommandGroup>

                {/* Tools Group */}
                <CommandGroup title="Tools" delay={0.1}>
                  <CommandItem
                    label="AI Assistant"
                    onClick={onAI}
                    variant="accent"
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                        <path d="M19 15l.88 2.62L22.5 18.5l-2.62.88L19 22l-.88-2.62L15.5 18.5l2.62-.88L19 15z" />
                      </svg>
                    }
                  />
                  <CommandItem
                    label="Accessibility"
                    onClick={onAccessibility}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="8" r="2" />
                        <path d="M12 10v4" />
                        <path d="M9 14l3 3 3-3" />
                        <path d="M8 11h8" />
                      </svg>
                    }
                  />
                  <CommandItem
                    label="Extract Image"
                    onClick={onExtract}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    }
                  />
                  <CommandItem
                    label="Import"
                    onClick={onImport}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    }
                  />
                </CommandGroup>

                {/* Output Group */}
                <CommandGroup title="Output" delay={0.15}>
                  <CommandItem
                    label="Export"
                    onClick={onExport}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    }
                  />
                  <CommandItem
                    label="Publish"
                    onClick={onPublish}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13" />
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                      </svg>
                    }
                  />
                  <CommandItem
                    label="Save"
                    shortcut="S"
                    onClick={onSave}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                    }
                  />
                </CommandGroup>
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2.5 border-t border-command-border bg-command-hover/50">
                <p className="text-xs text-muted-foreground text-center">
                  Press <kbd className="font-mono bg-secondary/50 px-1 rounded">?</kbd> to see all keyboard shortcuts
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
