"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { decodePalette } from "@/lib/share";
import { usePaletteStore } from "@/store/palette";
import type { Color } from "@/lib/types";

export default function SharedPalettePage() {
  const params = useParams();
  const router = useRouter();
  const [colors, setColors] = useState<Color[] | null>(null);
  const [error, setError] = useState(false);
  const { setColors: loadColors } = usePaletteStore();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const id = params.id as string;
    if (!id) {
      setError(true);
      return;
    }

    const decoded = decodePalette(id);
    if (!decoded) {
      setError(true);
      return;
    }

    setColors(decoded);
  }, [params.id]);

  const handleUseColors = () => {
    if (colors) {
      loadColors(colors);
      router.push("/immersive");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center gap-6 p-8">
        <h1 className="text-2xl font-semibold text-white">Invalid Palette</h1>
        <p className="text-zinc-400 text-center max-w-md">
          This palette link appears to be invalid or corrupted.
        </p>
        <button
          onClick={() => router.push("/immersive")}
          className="px-6 py-3 bg-white text-zinc-900 rounded-full font-medium hover:bg-zinc-200 transition-colors"
        >
          Create New Palette
        </button>
      </div>
    );
  }

  if (!colors) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse">Loading palette...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      {/* Palette preview */}
      <div className="flex-1 flex flex-col md:flex-row">
        {colors.map((color, index) => (
          <motion.div
            key={`${color.hex}-${index}`}
            className="flex-1 flex flex-col items-center justify-center min-h-[100px] md:min-h-0"
            style={{ backgroundColor: color.hex }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span
              className="text-lg md:text-2xl font-mono font-semibold tracking-wider"
              style={{
                color: color.contrastColor === "white" ? "#ffffff" : "#000000",
              }}
            >
              {color.hex}
            </span>
            <span
              className="text-sm mt-1 opacity-70"
              style={{
                color: color.contrastColor === "white" ? "#ffffff" : "#000000",
              }}
            >
              {color.name}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Actions bar */}
      <motion.div
        className="flex items-center justify-center gap-4 p-6 bg-zinc-950"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={handleUseColors}
          className="px-6 py-3 bg-white text-zinc-900 rounded-full font-medium hover:bg-zinc-200 transition-colors"
        >
          Use This Palette
        </button>
        <button
          onClick={() => router.push("/immersive")}
          className="px-6 py-3 border border-zinc-700 text-white rounded-full font-medium hover:bg-zinc-800 transition-colors"
        >
          Start Fresh
        </button>
      </motion.div>
    </div>
  );
}
