"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useColors, useLastModifiedIn } from "@/store/palette";

const MAX_VISIBLE = 6;

function formatSource(source: string | null): string {
  if (!source) return "";
  const map: Record<string, string> = {
    immersive: "Immersive",
    context: "Context",
    mood: "Mood",
    gradient: "Gradient",
    playground: "Playground",
    explore: "Explore",
    loaded: "Saved",
    ai: "AI",
  };
  return map[source] || source;
}

export function PalettePreview() {
  const colors = useColors();
  const lastModifiedIn = useLastModifiedIn();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [pulsing, setPulsing] = useState(false);

  const prevHexRef = useRef<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Track color changes for pulse animation
  const currentHex = colors.map((c) => c.hex).join(",");
  useEffect(() => {
    if (prevHexRef.current && prevHexRef.current !== currentHex) {
      setPulsing(true);
      const timer = setTimeout(() => setPulsing(false), 300);
      return () => clearTimeout(timer);
    }
    prevHexRef.current = currentHex;
  }, [currentHex]);

  // Close dropdown on pathname change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const handleCopy = useCallback(async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // Clipboard API not available
    }
  }, []);

  if (colors.length === 0) return null;

  const visible = colors.slice(0, MAX_VISIBLE);
  const overflow = colors.length - MAX_VISIBLE;
  const source = formatSource(lastModifiedIn);

  return (
    <div className="relative" ref={containerRef}>
      {/* Dot strip button */}
      <motion.button
        className="flex items-center gap-0.5 px-1.5 py-2 rounded-full hover:bg-command-hover transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        title="Current palette"
      >
        {visible.map((color, i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-white/20 flex-shrink-0"
            style={{ backgroundColor: color.hex }}
            animate={
              pulsing
                ? { scale: [1, 1.4, 1], transition: { duration: 0.3, delay: i * 0.03 } }
                : { scale: 1 }
            }
          />
        ))}
        {overflow > 0 && (
          <span className="text-[10px] text-foreground/50 ml-0.5 font-medium">
            +{overflow}
          </span>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="absolute top-full mt-2 left-0 p-3 rounded-xl bg-command-bg backdrop-blur-xl border border-command-border w-56 z-50 shadow-xl"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground/70">
                  Current Palette
                </span>
                {source && (
                  <span className="text-[10px] text-foreground/40">
                    From: {source}
                  </span>
                )}
              </div>

              {/* Swatches */}
              <div className="space-y-1">
                {colors.map((color, i) => (
                  <motion.button
                    key={i}
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-command-hover transition-colors group"
                    onClick={() => handleCopy(color.hex)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <div
                      className="w-6 h-6 rounded-md border border-white/15 flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs font-mono text-foreground/70 group-hover:text-foreground transition-colors flex-1 text-left">
                      {color.hex}
                    </span>
                    <span className="text-[10px] text-foreground/30 group-hover:text-foreground/60 transition-colors">
                      {copied === color.hex ? "Copied!" : "Copy"}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
