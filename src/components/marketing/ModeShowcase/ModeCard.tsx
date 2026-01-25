"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ModeCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  isPro?: boolean;
  preview: React.ReactNode;
  index: number;
}

export function ModeCard({
  name,
  description,
  icon,
  href,
  isPro = false,
  preview,
  index,
}: ModeCardProps) {
  return (
    <motion.div
      className="group relative flex-shrink-0 w-[280px] sm:w-[320px]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative h-full p-6 rounded-2xl bg-card border border-glass-border overflow-hidden transition-all duration-300 group-hover:border-muted-foreground/30 group-hover:shadow-lg group-hover:shadow-black/10">
        {/* Pro badge */}
        {isPro && (
          <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <span className="text-xs font-medium text-amber-500">Pro</span>
          </div>
        )}

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-glass border border-glass-border flex items-center justify-center mb-4 text-foreground">
          {icon}
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-foreground mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>

        {/* Preview animation */}
        <div className="h-32 rounded-lg bg-background/50 border border-glass-border overflow-hidden mb-4">
          {preview}
        </div>

        {/* CTA */}
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-amber-500 transition-colors"
        >
          Try it
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
