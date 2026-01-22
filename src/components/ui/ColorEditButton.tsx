"use client";

import { useCallback, useRef } from "react";
import { motion } from "framer-motion";

interface ColorEditButtonProps {
  colorHex: string;
  contrastColor: "white" | "black";
  isHovered: boolean;
  onColorChange: (hex: string) => void;
  position?: "top-left" | "top-right";
  size?: "sm" | "md";
}

export function ColorEditButton({
  colorHex,
  contrastColor,
  isHovered,
  onColorChange,
  position = "top-left",
  size = "md",
}: ColorEditButtonProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    colorInputRef.current?.click();
  }, []);

  const handleColorInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onColorChange(e.target.value);
    },
    [onColorChange]
  );

  const textColor = contrastColor === "white" ? "#ffffff" : "#000000";
  const iconSize = size === "sm" ? 14 : 18;

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
  };

  return (
    <>
      <input
        ref={colorInputRef}
        type="color"
        value={colorHex}
        onChange={handleColorInput}
        className="sr-only"
        aria-label="Edit color"
      />
      <motion.button
        className={`absolute ${positionClasses[position]} p-2 rounded-lg transition-colors`}
        style={{
          backgroundColor: isHovered
            ? contrastColor === "white"
              ? "rgba(255,255,255,0.15)"
              : "rgba(0,0,0,0.1)"
            : "transparent",
        }}
        initial={false}
        animate={{
          opacity: isHovered ? 0.9 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke={textColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </motion.button>
    </>
  );
}
