"use client";

import { motion } from "framer-motion";
import { usePaletteStore, useSavedPalettes } from "@/store/palette";
import { useIsPremium, useSavedPalettesLimit } from "@/store/subscription";

interface SaveButtonProps {
  onShowToast: (message: string) => void;
  onShowPricing: () => void;
}

export function SaveButton({ onShowToast, onShowPricing }: SaveButtonProps) {
  const savedPalettes = useSavedPalettes();
  const isPremium = useIsPremium();
  const savedPalettesLimit = useSavedPalettesLimit();
  const { savePalette } = usePaletteStore();

  const handleSave = () => {
    // Check limit for free users
    if (!isPremium && savedPalettes.length >= savedPalettesLimit) {
      onShowPricing();
      return;
    }

    const result = savePalette();
    if (result) {
      onShowToast("Palette saved!");
    } else {
      onShowToast(`Limit reached (${savedPalettes.length}/${savedPalettesLimit})`);
    }
  };

  return (
    <motion.button
      className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-colors"
      onClick={handleSave}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17,21 17,13 7,13 7,21" />
        <polyline points="7,3 7,8 15,8" />
      </svg>
    </motion.button>
  );
}
