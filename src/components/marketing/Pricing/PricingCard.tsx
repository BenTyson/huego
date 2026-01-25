"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface PricingCardProps {
  name: string;
  description: string;
  price: string | null;
  priceNote?: string;
  features: { name: string; included: boolean | string }[];
  ctaText: string;
  ctaHref: string;
  highlighted?: boolean;
  index: number;
}

export function PricingCard({
  name,
  description,
  price,
  priceNote,
  features,
  ctaText,
  ctaHref,
  highlighted = false,
  index,
}: PricingCardProps) {
  return (
    <motion.div
      className={`relative flex flex-col p-6 md:p-8 rounded-2xl border ${
        highlighted
          ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30"
          : "bg-card border-glass-border"
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Popular badge */}
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium">
          Most Popular
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        {price === null ? (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-foreground">Free</span>
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-foreground">{price}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
        )}
        {priceNote && (
          <p className="text-sm text-green-500 mt-1">{priceNote}</p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            {feature.included === true ? (
              <svg
                className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            ) : feature.included === false ? (
              <svg
                className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span
              className={`text-sm ${
                feature.included === false
                  ? "text-muted-foreground/50"
                  : "text-foreground"
              }`}
            >
              {typeof feature.included === "string"
                ? feature.included
                : feature.name}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          href={ctaHref}
          className={`block w-full py-3 rounded-xl text-center text-sm font-semibold transition-all ${
            highlighted
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-orange-500/20"
              : "bg-secondary text-foreground hover:bg-secondary/80"
          }`}
        >
          {ctaText}
        </Link>
      </motion.div>
    </motion.div>
  );
}
