"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useColors } from "@/store/palette";
import { copyShareUrl } from "@/lib/share";

interface UtilityButtonsProps {
  onShowToast: (message: string) => void;
  onShowExport: () => void;
  onShowAccessibility: () => void;
  onShowImport: () => void;
  onShowExtract: () => void;
  onShowPublish: () => void;
  onShowAI: () => void;
}

export function UtilityButtons({
  onShowToast,
  onShowExport,
  onShowAccessibility,
  onShowImport,
  onShowExtract,
  onShowPublish,
  onShowAI,
}: UtilityButtonsProps) {
  const colors = useColors();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    }
    if (showMoreMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMoreMenu]);

  const handleShare = async () => {
    const success = await copyShareUrl(colors);
    onShowToast(success ? "Link copied!" : "Failed to copy");
  };

  const menuItems = [
    {
      label: "Import Palette",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
      onClick: () => { onShowImport(); setShowMoreMenu(false); },
    },
    {
      label: "Extract from Image",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
      onClick: () => { onShowExtract(); setShowMoreMenu(false); },
    },
    {
      label: "Accessibility Check",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="8" r="2" />
          <path d="M12 10v4" />
          <path d="M9 14l3 3 3-3" />
          <path d="M8 11h8" />
        </svg>
      ),
      onClick: () => { onShowAccessibility(); setShowMoreMenu(false); },
    },
    {
      label: "Publish to Community",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      ),
      onClick: () => { onShowPublish(); setShowMoreMenu(false); },
    },
  ];

  return (
    <>
      {/* AI Assistant - Special styling */}
      <motion.button
        className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-md border border-purple-400/30 flex items-center justify-center text-purple-200 hover:text-white hover:from-purple-500/50 hover:to-pink-500/50 transition-colors"
        onClick={onShowAI}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="AI Color Assistant"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
          <path d="M19 15l.88 2.62L22.5 18.5l-2.62.88L19 22l-.88-2.62L15.5 18.5l2.62-.88L19 15z" />
        </svg>
      </motion.button>

      {/* Export - Primary action, prominent button */}
      <motion.button
        className="h-10 px-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm flex items-center gap-2 hover:from-indigo-400 hover:to-purple-400 transition-all shadow-lg shadow-indigo-500/25"
        onClick={onShowExport}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>Export</span>
      </motion.button>

      {/* Share */}
      <motion.button
        className="h-10 px-4 rounded-full bg-white/90 text-zinc-900 font-medium text-sm flex items-center gap-2 hover:bg-white transition-colors"
        onClick={handleShare}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span className="hidden sm:inline">Share</span>
      </motion.button>

      {/* More Menu */}
      <div className="relative" ref={menuRef}>
        <motion.button
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-colors"
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="More options"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showMoreMenu && (
            <motion.div
              className="absolute bottom-full right-0 mb-2 w-56 bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {menuItems.map((item, index) => (
                <button
                  key={item.label}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors ${
                    index < menuItems.length - 1 ? "border-b border-zinc-800/50" : ""
                  }`}
                  onClick={item.onClick}
                >
                  <span className="text-zinc-500">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
