"use client";

import { motion } from "framer-motion";
import { GradientButton, GhostButton } from "../shared";
import { LivePaletteDemo } from "./LivePaletteDemo";
import { HeroBackground } from "./HeroBackground";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 overflow-hidden">
      <HeroBackground />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Headline */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="block">Wherever HueGo,</span>
          <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            color follows.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          6 unique modes. AI-powered palettes. Zero creative blocks.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GradientButton href="/immersive" size="lg">
            Start Creating
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </GradientButton>

          <GhostButton href="#pricing" size="lg">
            See Pro Features
          </GhostButton>
        </motion.div>

        {/* Live Palette Demo */}
        <LivePaletteDemo />
      </div>
    </section>
  );
}
