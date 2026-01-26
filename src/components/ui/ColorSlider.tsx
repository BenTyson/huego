"use client";

import { useCallback, useRef, useState, useEffect } from "react";

interface ColorSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  gradient?: string;
  onChange: (value: number) => void;
}

export function ColorSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  gradient,
  onChange,
}: ColorSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const trackRef = useRef<HTMLDivElement>(null);

  // Sync local value when prop changes (and not dragging)
  useEffect(() => {
    if (!isDragging) {
      setLocalValue(value);
    }
  }, [value, isDragging]);

  const calculateValue = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + percentage * (max - min);
      return Math.round(rawValue / step) * step;
    },
    [min, max, step, value]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      const newValue = calculateValue(e.clientX);
      setLocalValue(newValue);
      onChange(newValue);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [calculateValue, onChange]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const newValue = calculateValue(e.clientX);
      setLocalValue(newValue);
      onChange(newValue);
    },
    [isDragging, calculateValue, onChange]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const percentage = ((localValue - min) / (max - min)) * 100;

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">{label}</span>
          <span className="text-zinc-300 font-mono tabular-nums">
            {Math.round(localValue)}{unit}
          </span>
        </div>
      )}
      <div
        ref={trackRef}
        className="relative h-8 md:h-5 flex items-center cursor-pointer touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Track background */}
        <div
          className="absolute inset-y-2.5 md:inset-y-1.5 left-0 right-0 rounded-full"
          style={{
            background: gradient || "linear-gradient(to right, #374151, #6b7280, #9ca3af)",
          }}
        />
        {/* Thumb - 44px touch target on mobile */}
        <div
          className="absolute w-6 h-6 md:w-4 md:h-4 rounded-full bg-white shadow-md border-2 border-zinc-300 -ml-3 md:-ml-2 transition-transform"
          style={{
            left: `${percentage}%`,
            transform: isDragging ? "scale(1.2)" : "scale(1)",
          }}
        />
      </div>
    </div>
  );
}
