"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsPremium } from "@/store/subscription";
import { PricingModal } from "./PricingModal";
import { ThemeToggle } from "./ThemeToggle";
import type { Mode } from "@/lib/types";
import { FREE_MODES } from "@/lib/types";

interface ModeOption {
  id: Mode;
  label: string;
  href: string;
  icon: React.ReactNode;
  premium?: boolean;
}

const modes: ModeOption[] = [
  {
    id: "immersive",
    label: "Immersive",
    href: "/immersive",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
  },
  {
    id: "context",
    label: "Context",
    href: "/context",
    premium: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
  {
    id: "mood",
    label: "Mood",
    href: "/mood",
    premium: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    id: "gradient",
    label: "Gradient",
    href: "/gradient",
    premium: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
      </svg>
    ),
  },
  {
    id: "playground",
    label: "Play",
    href: "/play",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
];

export function ModeToggle() {
  const pathname = usePathname();
  const isPremium = useIsPremium();
  const [showPricingModal, setShowPricingModal] = useState(false);

  // Determine current mode from pathname
  const currentMode = modes.find((m) => pathname.startsWith(m.href))?.id || "immersive";

  return (
    <>
      <motion.nav
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
            {modes.map((mode) => {
              const isActive = currentMode === mode.id;
              const isLocked = mode.premium && !isPremium;

              // If locked, render a button that opens pricing modal
              if (isLocked) {
                return (
                  <button
                    key={mode.id}
                    onClick={() => setShowPricingModal(true)}
                    className="relative"
                  >
                    <motion.div
                      className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-white/40 hover:text-white/60 transition-colors duration-200"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {mode.icon}
                        <span className="hidden sm:inline">{mode.label}</span>
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-amber-500"
                        >
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </span>
                    </motion.div>
                  </button>
                );
              }

              return (
                <Link
                  key={mode.id}
                  href={mode.href}
                  className="relative"
                >
                  <motion.div
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
                      transition-colors duration-200
                      ${isActive ? "text-white" : "text-white/60 hover:text-white/80"}
                    `}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-white/20"
                        layoutId="activeMode"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {mode.icon}
                      <span className="hidden sm:inline">{mode.label}</span>
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Upgrade button for free users */}
          {!isPremium && (
            <motion.button
              onClick={() => setShowPricingModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-orange-500/20"
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
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="hidden sm:inline">Pro</span>
            </motion.button>
          )}

          {/* Premium badge */}
          {isPremium && (
            <motion.button
              onClick={() => setShowPricingModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="hidden sm:inline">Pro</span>
            </motion.button>
          )}

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </motion.nav>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </>
  );
}
