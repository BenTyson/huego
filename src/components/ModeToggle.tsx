"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Mode } from "@/lib/types";

interface ModeOption {
  id: Mode;
  label: string;
  href: string;
  icon: React.ReactNode;
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

  // Determine current mode from pathname
  const currentMode = modes.find((m) => pathname.startsWith(m.href))?.id || "immersive";

  return (
    <motion.nav
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-1 p-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
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
    </motion.nav>
  );
}
