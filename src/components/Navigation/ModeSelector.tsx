"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { GuardedLink } from "./GuardedLink";
import type { Mode } from "@/lib/types";

interface ModeOption {
  id: Mode;
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const modes: ModeOption[] = [
  {
    id: "immersive",
    label: "Immersive",
    description: "Full-screen color experience",
    href: "/immersive",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
  },
  {
    id: "context",
    label: "Context",
    description: "See colors in UI mockups",
    href: "/context",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    description: "Color psychology insights",
    href: "/mood",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    description: "Create smooth gradients",
    href: "/gradient",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
      </svg>
    ),
  },
  {
    id: "playground",
    label: "Playground",
    description: "Experiment freely",
    href: "/play",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
];

export function ModeSelector() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentMode = modes.find((m) => pathname.startsWith(m.href)) || modes[0];

  return (
    <div className="relative">
      <motion.button
        className="flex items-center gap-2 px-3 py-2 rounded-full text-foreground/90 hover:text-foreground hover:bg-command-hover transition-colors text-sm font-medium"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="opacity-70">{currentMode.icon}</span>
        <span className="hidden sm:inline">{currentMode.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`opacity-50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.button>

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

            {/* Dropdown - responsive width for mobile */}
            <motion.div
              className="absolute top-full mt-2 left-0 p-2 rounded-xl bg-command-bg backdrop-blur-xl border border-command-border w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[220px] max-w-[280px] z-50 shadow-xl"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {modes.map((mode, index) => {
                const isActive = currentMode.id === mode.id;

                return (
                  <motion.div
                    key={mode.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <GuardedLink
                      href={mode.href}
                      className={`
                        flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors
                        ${isActive
                          ? "bg-primary/10 text-foreground"
                          : "text-foreground/70 hover:bg-command-hover hover:text-foreground"
                        }
                      `}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className={`mt-0.5 ${isActive ? "opacity-100" : "opacity-60"}`}>
                        {mode.icon}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">{mode.label}</span>
                        <span className="text-xs text-muted-foreground">{mode.description}</span>
                      </div>
                    </GuardedLink>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
