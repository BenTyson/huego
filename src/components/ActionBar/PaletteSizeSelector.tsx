"use client";

import { motion } from "framer-motion";
import { usePaletteStore, usePaletteSize } from "@/store/palette";
import { useSubscriptionStore } from "@/store/subscription";
import { MIN_PALETTE_SIZE } from "@/lib/types";

interface PaletteSizeSelectorProps {
  onUpgradeClick: () => void;
}

export function PaletteSizeSelector({ onUpgradeClick }: PaletteSizeSelectorProps) {
  const paletteSize = usePaletteSize();
  const { addColor, removeColor } = usePaletteStore();
  const maxSize = useSubscriptionStore((state) => state.getMaxPaletteSize());
  const isPremium = useSubscriptionStore((state) => state.isPremium);

  const canAdd = paletteSize < maxSize;
  const canRemove = paletteSize > MIN_PALETTE_SIZE;
  const isAtPremiumLimit = paletteSize >= 7 && !isPremium;

  const handleAdd = () => {
    if (isAtPremiumLimit) {
      onUpgradeClick();
      return;
    }
    addColor();
  };

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
      <motion.button
        onClick={removeColor}
        disabled={!canRemove}
        className={`
          w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium
          transition-colors duration-200
          ${canRemove
            ? "text-white/80 hover:text-white hover:bg-white/10"
            : "text-white/30 cursor-not-allowed"
          }
        `}
        whileHover={canRemove ? { scale: 1.1 } : undefined}
        whileTap={canRemove ? { scale: 0.95 } : undefined}
        title="Remove color"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </motion.button>

      <div className="px-2 min-w-[2.5rem] text-center">
        <span className="text-white/90 text-sm font-medium tabular-nums">{paletteSize}</span>
      </div>

      <motion.button
        onClick={handleAdd}
        disabled={!canAdd && !isAtPremiumLimit}
        className={`
          w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium
          transition-colors duration-200
          ${canAdd || isAtPremiumLimit
            ? "text-white/80 hover:text-white hover:bg-white/10"
            : "text-white/30 cursor-not-allowed"
          }
          ${isAtPremiumLimit ? "text-amber-400" : ""}
        `}
        whileHover={canAdd || isAtPremiumLimit ? { scale: 1.1 } : undefined}
        whileTap={canAdd || isAtPremiumLimit ? { scale: 0.95 } : undefined}
        title={isAtPremiumLimit ? "Upgrade for 8-10 colors" : "Add color"}
      >
        {isAtPremiumLimit ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-500">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        )}
      </motion.button>
    </div>
  );
}
