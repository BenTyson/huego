"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MosaicLink() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/mosaic");

  return (
    <Link href="/mosaic">
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
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span className="hidden sm:inline">Mosaic</span>
      </motion.div>
    </Link>
  );
}
