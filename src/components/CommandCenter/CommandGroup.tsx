"use client";

import { motion } from "framer-motion";

interface CommandGroupProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
}

export function CommandGroup({ title, children, delay = 0 }: CommandGroupProps) {
  return (
    <motion.div
      className="space-y-1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
    >
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
        {title}
      </h3>
      <div className="space-y-0.5">
        {children}
      </div>
    </motion.div>
  );
}
