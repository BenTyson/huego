"use client";

import { motion } from "framer-motion";
import { useColors } from "@/store/palette";
import { copyShareUrl } from "@/lib/share";

interface UtilityButtonsProps {
  onShowToast: (message: string) => void;
  onShowExport: () => void;
  onShowAccessibility: () => void;
  onShowImport: () => void;
  onShowExtract: () => void;
  onShowPublish: () => void;
}

export function UtilityButtons({
  onShowToast,
  onShowExport,
  onShowAccessibility,
  onShowImport,
  onShowExtract,
  onShowPublish,
}: UtilityButtonsProps) {
  const colors = useColors();

  const handleShare = async () => {
    const success = await copyShareUrl(colors);
    onShowToast(success ? "Link copied!" : "Failed to copy");
  };

  return (
    <>
      {/* Image Extract */}
      <motion.button
        className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-colors"
        onClick={onShowExtract}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Extract from Image"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </motion.button>

      {/* Import */}
      <motion.button
        className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-colors"
        onClick={onShowImport}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Import Palette"
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
      </motion.button>

      {/* Export */}
      <motion.button
        className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-colors"
        onClick={onShowExport}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Export Palette"
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
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </motion.button>

      {/* Accessibility */}
      <motion.button
        className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-colors"
        onClick={onShowAccessibility}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Accessibility Check"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="8" r="2" />
          <path d="M12 10v4" />
          <path d="M9 14l3 3 3-3" />
          <path d="M8 11h8" />
        </svg>
      </motion.button>

      {/* Publish to Community */}
      <motion.button
        className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-colors"
        onClick={onShowPublish}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Publish to Community"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
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
    </>
  );
}
