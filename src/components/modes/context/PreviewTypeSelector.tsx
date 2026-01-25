"use client";

import { motion } from "framer-motion";

export type PreviewType = "website" | "mobile" | "dashboard" | "buttons" | "forms" | "pricing" | "stats";
export type PreviewTheme = "light" | "dark";

interface PreviewTypeSelectorProps {
  activePreview: PreviewType;
  onSelect: (preview: PreviewType) => void;
  theme: PreviewTheme;
  onThemeChange: (theme: PreviewTheme) => void;
}

const previewOptions: { id: PreviewType; label: string }[] = [
  { id: "website", label: "Website" },
  { id: "mobile", label: "Mobile" },
  { id: "dashboard", label: "Dashboard" },
  { id: "buttons", label: "Buttons" },
  { id: "forms", label: "Forms" },
  { id: "pricing", label: "Pricing" },
  { id: "stats", label: "Stats" },
];

export function PreviewTypeSelector({ activePreview, onSelect, theme, onThemeChange }: PreviewTypeSelectorProps) {
  return (
    <div className="pt-16 px-4">
      {/* Secondary nav bar with clear visual separation */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-800/80 border border-zinc-700/50">
        {/* Preview Type Buttons */}
        <div className="flex items-center gap-1">
          {previewOptions.map((option) => (
            <motion.button
              key={option.id}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activePreview === option.id
                  ? "bg-white/15 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => onSelect(option.id)}
              whileTap={{ scale: 0.97 }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-zinc-700 mx-2" />

        {/* Theme Toggle */}
        <button
          onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          title={`Switch to ${theme === "light" ? "dark" : "light"} preview`}
        >
          {theme === "light" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          <span>{theme === "light" ? "Light" : "Dark"}</span>
        </button>
      </div>
    </div>
  );
}
