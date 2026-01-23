"use client";

import { useCallback, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createColor } from "@/lib/colors";
import { generateSuggestions, type SuggestionGroup } from "@/lib/suggestions";

interface ColorEditButtonProps {
  colorHex: string;
  contrastColor: "white" | "black";
  isHovered: boolean;
  onColorChange: (hex: string) => void;
  position?: "top-left" | "top-right";
  size?: "sm" | "md";
  showSuggestions?: boolean;
}

export function ColorEditButton({
  colorHex,
  contrastColor,
  isHovered,
  onColorChange,
  position = "top-left",
  size = "md",
  showSuggestions = true,
}: ColorEditButtonProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [showPopover, setShowPopover] = useState(false);

  const color = useMemo(() => createColor(colorHex), [colorHex]);
  const suggestions = useMemo(
    () => (showSuggestions ? generateSuggestions(color) : []),
    [color, showSuggestions]
  );

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    colorInputRef.current?.click();
  }, []);

  const handleSuggestClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopover((prev) => !prev);
  }, []);

  const handleColorInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onColorChange(e.target.value);
    },
    [onColorChange]
  );

  const handleSuggestionSelect = useCallback(
    (hex: string) => {
      onColorChange(hex);
      setShowPopover(false);
    },
    [onColorChange]
  );

  const textColor = contrastColor === "white" ? "#ffffff" : "#000000";
  const iconSize = size === "sm" ? 14 : 18;

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
  };

  const popoverPosition = position === "top-left" ? "left-0" : "right-0";

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

      {/* Button container */}
      <div className={`absolute ${positionClasses[position]} flex gap-1`}>
        {/* Edit button */}
        <motion.button
          className="p-2 rounded-lg transition-colors"
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
          onClick={handleEditClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Edit color"
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

        {/* Suggestions button */}
        {showSuggestions && (
          <motion.button
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: showPopover
                ? contrastColor === "white"
                  ? "rgba(255,255,255,0.25)"
                  : "rgba(0,0,0,0.2)"
                : isHovered
                ? contrastColor === "white"
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(0,0,0,0.1)"
                : "transparent",
            }}
            initial={false}
            animate={{
              opacity: isHovered || showPopover ? 0.9 : 0,
              scale: isHovered || showPopover ? 1 : 0.8,
            }}
            transition={{ duration: 0.2 }}
            onClick={handleSuggestClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Color suggestions"
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
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Suggestions Popover */}
      <AnimatePresence>
        {showPopover && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPopover(false)}
            />

            {/* Popover */}
            <motion.div
              className={`absolute top-16 ${popoverPosition} z-50 w-64 p-3 rounded-xl bg-zinc-900/95 backdrop-blur-md border border-zinc-700 shadow-xl`}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-xs font-medium text-zinc-400 mb-2">
                Color Suggestions
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {suggestions.map((group) => (
                  <div key={group.category}>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                      {group.label}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {group.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="group relative w-8 h-8 rounded-lg border border-zinc-700 hover:border-white/50 transition-colors overflow-hidden"
                          style={{ backgroundColor: suggestion.hex }}
                          onClick={() => handleSuggestionSelect(suggestion.hex)}
                          title={`${suggestion.label} (${suggestion.hex})`}
                        >
                          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white">
                            {suggestion.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-700">
                <button
                  className="w-full text-xs text-zinc-400 hover:text-white transition-colors text-center"
                  onClick={handleEditClick}
                >
                  Open color picker →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
