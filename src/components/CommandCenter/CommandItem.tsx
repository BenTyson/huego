"use client";

import { motion } from "framer-motion";

interface CommandItemProps {
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "accent";
}

export function CommandItem({
  label,
  shortcut,
  icon,
  onClick,
  variant = "default",
}: CommandItemProps) {
  return (
    <motion.button
      className={`
        w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm
        transition-colors duration-150
        ${variant === "accent"
          ? "text-purple-300 hover:bg-purple-500/10"
          : "text-foreground/80 hover:bg-command-hover hover:text-foreground"
        }
      `}
      onClick={onClick}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="flex items-center gap-2.5">
        {icon && <span className="w-4 h-4 flex items-center justify-center opacity-60">{icon}</span>}
        <span>{label}</span>
      </span>
      {shortcut && (
        <kbd className="text-xs font-mono text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
          {shortcut}
        </kbd>
      )}
    </motion.button>
  );
}
