"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ModeSelector } from "./ModeSelector";
import { ExploreLink } from "./ExploreLink";
import { MosaicLink } from "./MosaicLink";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { ThemeToggle } from "../ThemeToggle";

export function NavigationBar() {
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Listen for ? key to show shortcuts
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Only trigger if not in an input
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return;
    }

    if (e.key === "?" || (e.shiftKey && e.key === "/")) {
      e.preventDefault();
      setShowShortcuts(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <>
      <motion.nav
        className="fixed left-1/2 -translate-x-1/2 z-50"
        style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-command-bg/90 backdrop-blur-xl border border-command-border shadow-lg">
          {/* Mode selector */}
          <ModeSelector />

          {/* Logo */}
          <Link href="/" className="hidden sm:block">
            <motion.div
              className="text-lg font-bold text-foreground/90 hover:text-foreground transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              HueGo
            </motion.div>
          </Link>

          {/* Explore link */}
          <ExploreLink />

          {/* Mosaic link */}
          <MosaicLink />

          {/* Help button - 44px touch target on mobile */}
          <motion.button
            className="w-11 h-11 md:w-9 md:h-9 rounded-lg flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-command-hover transition-colors"
            onClick={() => setShowShortcuts(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Keyboard shortcuts (?)"
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
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </motion.button>

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </motion.nav>

      {/* Keyboard shortcuts overlay */}
      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </>
  );
}
