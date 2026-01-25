"use client";

import { motion } from "framer-motion";
import { GenerateButton } from "./GenerateButton";
import { PaletteControls } from "./PaletteControls";
import { useColors } from "@/store/palette";
import { copyShareUrl } from "@/lib/share";

interface CommandBarProps {
  onTogglePanel: () => void;
  isPanelOpen: boolean;
  onShowToast: (message: string) => void;
  onExport: () => void;
}

export function CommandBar({ onTogglePanel, isPanelOpen, onShowToast, onExport }: CommandBarProps) {
  const colors = useColors();

  const handleShare = async () => {
    const success = await copyShareUrl(colors);
    onShowToast(success ? "Link copied!" : "Failed to copy");
  };

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.15 }}
    >
      {/* Primary action: Generate */}
      <GenerateButton />

      {/* Palette controls: Size + Harmony */}
      <PaletteControls />

      {/* Divider */}
      <div className="w-px h-6 bg-border/50" />

      {/* More actions button */}
      <motion.button
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          transition-colors duration-150
          ${isPanelOpen
            ? "bg-primary text-primary-foreground"
            : "bg-command-bg backdrop-blur-md border border-command-border text-foreground/70 hover:text-foreground hover:bg-command-hover"
          }
        `}
        onClick={onTogglePanel}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="More commands"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.35 }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </motion.button>

      {/* Export button - Primary action */}
      <motion.button
        className="h-10 px-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm flex items-center gap-2 hover:from-indigo-400 hover:to-purple-400 transition-all shadow-lg shadow-indigo-500/25"
        onClick={onExport}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.37 }}
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

      {/* Share button */}
      <motion.button
        className="h-10 px-4 rounded-full bg-primary-cta text-primary-cta-text font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
        onClick={handleShare}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.4 }}
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
    </motion.div>
  );
}
