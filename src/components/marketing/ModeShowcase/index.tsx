"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "../shared";
import { ModeCard } from "./ModeCard";
import {
  ImmersivePreview,
  PlaygroundPreview,
  ExplorePreview,
  ContextPreview,
  MoodPreview,
  GradientPreview,
} from "./ModePreviews";

const modes = [
  {
    name: "Immersive",
    description: "Classic spacebar generation. Full-screen color columns that inspire.",
    href: "/immersive",
    isPro: false,
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
    preview: <ImmersivePreview />,
  },
  {
    name: "Playground",
    description: "Swipe through palettes like a deck of cards. Discover with play.",
    href: "/play",
    isPro: false,
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    ),
    preview: <PlaygroundPreview />,
  },
  {
    name: "Explore",
    description: "Browse community palettes. Get inspired by what others create.",
    href: "/explore",
    isPro: false,
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    preview: <ExplorePreview />,
  },
  {
    name: "Context",
    description: "See your colors in real UI mockups. Dashboard, app, website previews.",
    href: "/context",
    isPro: true,
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
    preview: <ContextPreview />,
  },
  {
    name: "Mood",
    description: "Match colors to emotions. Create palettes that feel exactly right.",
    href: "/mood",
    isPro: true,
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    preview: <MoodPreview />,
  },
  {
    name: "Gradient",
    description: "Beautiful mesh gradients. Linear, radial, and conic options.",
    href: "/gradient",
    isPro: true,
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
      </svg>
    ),
    preview: <GradientPreview />,
  },
];

export function ModeShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate modes for seamless loop
  const duplicatedModes = [...modes, ...modes];

  return (
    <SectionWrapper id="modes" className="overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            One tool.{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Six ways to create.
            </span>
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Every creative workflow is different. HueGo adapts to yours.
          </motion.p>
        </div>

        {/* Auto-scrolling container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden -mx-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Scrolling track */}
          <motion.div
            className="flex gap-6 px-4 pb-4"
            animate={{
              x: isPaused ? undefined : [0, -((320 + 24) * modes.length)],
            }}
            transition={{
              x: {
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            style={{ width: "max-content" }}
          >
            {duplicatedModes.map((mode, index) => (
              <ModeCard
                key={`${mode.name}-${index}`}
                name={mode.name}
                description={mode.description}
                icon={mode.icon}
                href={mode.href}
                isPro={mode.isPro}
                preview={mode.preview}
                index={index % modes.length}
              />
            ))}
          </motion.div>
        </div>

        {/* Pause indicator */}
        <motion.p
          className="text-center text-sm text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isPaused ? "Paused" : "Hover to pause"}
        </motion.p>
      </div>
    </SectionWrapper>
  );
}
