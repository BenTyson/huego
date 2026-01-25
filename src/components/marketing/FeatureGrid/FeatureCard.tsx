"use client";

import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  index: number;
}

export function FeatureCard({
  icon,
  title,
  description,
  className = "",
  index,
}: FeatureCardProps) {
  return (
    <motion.div
      className={`group relative p-6 rounded-2xl bg-card border border-glass-border overflow-hidden transition-all duration-300 hover:border-muted-foreground/30 hover:shadow-lg hover:shadow-black/5 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Gradient hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-glass border border-glass-border flex items-center justify-center mb-4 text-foreground group-hover:border-amber-500/30 transition-colors">
          {icon}
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
