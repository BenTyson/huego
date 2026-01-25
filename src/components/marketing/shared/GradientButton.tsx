"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface GradientButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function GradientButton({
  href,
  onClick,
  children,
  size = "md",
  className = "",
}: GradientButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-orange-500/20 ${sizeClasses[size]} ${className}`;

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
