"use client";

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

const iconSizes = {
  sm: 12,
  md: 16,
  lg: 20,
};

export function CloseButton({ onClick, className = "", size = "md" }: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${sizeClasses[size]} rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors ${className}`}
      aria-label="Close"
    >
      <svg
        width={iconSizes[size]}
        height={iconSizes[size]}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}
