"use client";

import { motion } from "framer-motion";
import { usePaletteStore, useCanUndo, useCanRedo } from "@/store/palette";

export function UndoRedoButtons() {
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const { undo, redo } = usePaletteStore();

  return (
    <>
      {/* Undo */}
      <motion.button
        className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={undo}
        disabled={!canUndo}
        whileHover={canUndo ? { scale: 1.1 } : {}}
        whileTap={canUndo ? { scale: 0.9 } : {}}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </svg>
      </motion.button>

      {/* Redo */}
      <motion.button
        className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={redo}
        disabled={!canRedo}
        whileHover={canRedo ? { scale: 1.1 } : {}}
        whileTap={canRedo ? { scale: 0.9 } : {}}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
        </svg>
      </motion.button>
    </>
  );
}
