"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EXAMPLE_PROMPTS = [
  {
    text: "Warm sunset over the ocean",
    colors: ["#FF6B35", "#F7931E", "#FFCD3C", "#9B4DCA", "#1A1A2E"],
  },
  {
    text: "Neon cyberpunk city",
    colors: ["#FF00FF", "#00FFFF", "#FF1493", "#7B68EE", "#0D0D0D"],
  },
  {
    text: "Peaceful forest morning",
    colors: ["#2D5016", "#4A7C23", "#8BC34A", "#C5E1A5", "#F5F5DC"],
  },
  {
    text: "Minimalist Japanese zen",
    colors: ["#1A1A1A", "#8B7355", "#C4A35A", "#E8DCC4", "#FAFAFA"],
  },
];

export function PromptDemo() {
  const [activePrompt, setActivePrompt] = useState<number | null>(null);
  const [typedText, setTypedText] = useState("");
  const [showColors, setShowColors] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handlePromptClick = useCallback((index: number) => {
    setActivePrompt(index);
    setTypedText("");
    setShowColors(false);
    setIsTyping(true);

    const prompt = EXAMPLE_PROMPTS[index].text;
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < prompt.length) {
        setTypedText(prompt.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        setTimeout(() => setShowColors(true), 300);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, []);

  // Auto-play on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      handlePromptClick(0);
    }, 1000);
    return () => clearTimeout(timer);
  }, [handlePromptClick]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input display */}
      <div className="relative mb-8">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-glass-border">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground mb-1">
              Describe your palette
            </div>
            <div className="text-foreground min-h-[1.5rem]">
              {typedText}
              {isTyping && (
                <motion.span
                  className="inline-block w-0.5 h-5 bg-amber-500 ml-0.5"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </div>
          </div>
          <motion.button
            className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Generate
          </motion.button>
        </div>
      </div>

      {/* Generated palette */}
      <AnimatePresence mode="wait">
        {showColors && activePrompt !== null && (
          <motion.div
            key={activePrompt}
            className="flex h-20 rounded-xl overflow-hidden shadow-lg border border-glass-border"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            {EXAMPLE_PROMPTS[activePrompt].colors.map((color, i) => (
              <motion.div
                key={color}
                className="flex-1"
                style={{ backgroundColor: color }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt chips */}
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {EXAMPLE_PROMPTS.map((prompt, i) => (
          <motion.button
            key={i}
            onClick={() => handlePromptClick(i)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activePrompt === i
                ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                : "bg-glass border border-glass-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {prompt.text}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
