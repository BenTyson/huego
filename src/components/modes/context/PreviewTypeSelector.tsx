"use client";

import { motion } from "framer-motion";

export type PreviewType = "website" | "mobile" | "dashboard";

interface PreviewTypeSelectorProps {
  activePreview: PreviewType;
  onSelect: (preview: PreviewType) => void;
}

const previewOptions: { id: PreviewType; label: string; icon: React.ReactNode }[] = [
  {
    id: "website",
    label: "Website",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
];

export function PreviewTypeSelector({ activePreview, onSelect }: PreviewTypeSelectorProps) {
  return (
    <div className="flex items-center justify-end gap-2 p-4 pr-6">
      {previewOptions.map((option) => (
        <motion.button
          key={option.id}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activePreview === option.id
              ? "bg-white/20 text-white"
              : "text-white/50 hover:text-white hover:bg-white/10"
          }`}
          onClick={() => onSelect(option.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {option.icon}
          <span className="hidden sm:inline">{option.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
