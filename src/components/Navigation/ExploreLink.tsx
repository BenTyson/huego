"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { GuardedLink } from "./GuardedLink";

export function ExploreLink() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/explore");

  return (
    <GuardedLink href="/explore">
      <motion.div
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
          transition-colors duration-200
          ${isActive
            ? "bg-primary/10 text-foreground"
            : "text-foreground/70 hover:text-foreground hover:bg-command-hover"
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="opacity-70"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
        <span className="hidden sm:inline">Explore</span>
      </motion.div>
    </GuardedLink>
  );
}
