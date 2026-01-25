"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Immersive Preview - Color columns cycling
export function ImmersivePreview() {
  const [colors, setColors] = useState([
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#F59E0B",
    "#10B981",
  ]);

  useEffect(() => {
    const palettes = [
      ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"],
      ["#EF4444", "#F97316", "#FBBF24", "#84CC16", "#22C55E"],
      ["#6366F1", "#8B5CF6", "#A855F7", "#D946EF", "#EC4899"],
      ["#0EA5E9", "#14B8A6", "#22C55E", "#84CC16", "#EAB308"],
    ];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % palettes.length;
      setColors(palettes[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full">
      <AnimatePresence mode="sync">
        {colors.map((color, i) => (
          <motion.div
            key={`${color}-${i}`}
            className="flex-1"
            style={{ backgroundColor: color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Playground Preview - Card stack animation
export function PlaygroundPreview() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const colors = ["#8B5CF6", "#3B82F6", "#10B981"];

  return (
    <div className="relative h-full flex items-center justify-center">
      {colors.map((color, i) => {
        const adjustedIndex = (i - offset + 3) % 3;
        return (
          <motion.div
            key={i}
            className="absolute w-16 h-20 rounded-lg shadow-lg"
            style={{ backgroundColor: color }}
            animate={{
              x: adjustedIndex * 8 - 8,
              y: adjustedIndex * 4 - 4,
              scale: 1 - adjustedIndex * 0.05,
              zIndex: 3 - adjustedIndex,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        );
      })}
    </div>
  );
}

// Explore Preview - Scrolling grid
export function ExplorePreview() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScroll((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const palettes = [
    ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
    ["#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE"],
    ["#85C1E9", "#73C6B6", "#F5B041", "#E74C3C"],
    ["#5DADE2", "#58D68D", "#F4D03F", "#EC7063"],
  ];

  return (
    <motion.div
      className="flex flex-col gap-2 p-2"
      animate={{ y: -scroll * 0.4 }}
    >
      {[...palettes, ...palettes].map((palette, i) => (
        <div key={i} className="flex gap-1">
          {palette.map((color, j) => (
            <div
              key={j}
              className="w-6 h-6 rounded"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      ))}
    </motion.div>
  );
}

// Context Preview - Rotating mockups
export function ContextPreview() {
  const [mockup, setMockup] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMockup((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const mockups = [
    { bg: "#1F2937", accent: "#3B82F6", text: "#F9FAFB" },
    { bg: "#FEF3C7", accent: "#D97706", text: "#92400E" },
    { bg: "#ECFDF5", accent: "#10B981", text: "#065F46" },
  ];

  return (
    <div className="h-full flex items-center justify-center p-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={mockup}
          className="w-full h-full rounded-lg overflow-hidden"
          style={{ backgroundColor: mockups[mockup].bg }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div
            className="h-3"
            style={{ backgroundColor: mockups[mockup].accent }}
          />
          <div className="p-2">
            <div
              className="w-12 h-2 rounded mb-1"
              style={{ backgroundColor: mockups[mockup].text, opacity: 0.8 }}
            />
            <div
              className="w-20 h-1.5 rounded"
              style={{ backgroundColor: mockups[mockup].text, opacity: 0.4 }}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Mood Preview - Mood chips + sliders
export function MoodPreview() {
  const [mood, setMood] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMood((prev) => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const moods = [
    { name: "Calm", color: "#60A5FA" },
    { name: "Energy", color: "#F59E0B" },
    { name: "Nature", color: "#10B981" },
    { name: "Passion", color: "#EF4444" },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center gap-2 p-3">
      <div className="flex gap-2">
        {moods.map((m, i) => (
          <motion.div
            key={m.name}
            className="px-2 py-1 rounded-full text-xs"
            style={{
              backgroundColor: mood === i ? m.color : "transparent",
              color: mood === i ? "#fff" : m.color,
              border: `1px solid ${m.color}`,
            }}
            animate={{ scale: mood === i ? 1.1 : 1 }}
          >
            {m.name}
          </motion.div>
        ))}
      </div>
      <motion.div
        className="w-24 h-2 rounded-full"
        style={{ backgroundColor: moods[mood].color }}
        animate={{ scaleX: [1, 0.6, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );
}

// Gradient Preview - Gradient type switching
export function GradientPreview() {
  const [gradientIndex, setGradientIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "radial-gradient(circle, #667eea 0%, #764ba2 100%)",
    "conic-gradient(from 180deg, #667eea, #764ba2, #f093fb, #667eea)",
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={gradientIndex}
        className="h-full rounded"
        style={{ background: gradients[gradientIndex] }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
    </AnimatePresence>
  );
}
