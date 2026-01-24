"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Color variant for the spinner */
  variant?: "light" | "dark";
}

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-3",
};

export function LoadingSpinner({
  size = "md",
  className = "",
  variant = "light",
}: LoadingSpinnerProps) {
  const borderColor = variant === "light"
    ? "border-white/30 border-t-white"
    : "border-zinc-400 border-t-zinc-900";

  return (
    <motion.div
      className={`${sizeClasses[size]} ${borderColor} rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}
