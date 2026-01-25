"use client";

import { motion } from "framer-motion";
import { StatCounter } from "./StatCounter";

export function SocialProof() {
  return (
    <section className="py-16 border-y border-glass-border bg-card/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <StatCounter value={50000} suffix="+" label="Palettes generated" />
          <div className="hidden md:block w-px h-12 bg-glass-border" />
          <StatCounter value={6} label="Unique modes" />
          <div className="hidden md:block w-px h-12 bg-glass-border" />
          <StatCounter value={9} label="Export formats" />
          <div className="hidden md:block w-px h-12 bg-glass-border" />
          <StatCounter value={5} label="Blindness simulations" />
        </div>
      </div>
    </section>
  );
}
