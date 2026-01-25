"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface GhostButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function GhostButton({
  href,
  onClick,
  children,
  size = "md",
  className = "",
}: GhostButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-full border border-glass-border bg-glass/50 text-foreground font-medium hover:bg-glass hover:border-muted-foreground/30 transition-all backdrop-blur-sm ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
        <Link href={href} className={baseClasses}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={baseClasses}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}
