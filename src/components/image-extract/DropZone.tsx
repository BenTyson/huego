"use client";

import { useCallback, useRef } from "react";

interface DropZoneProps {
  onFile: (file: File) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  disabled?: boolean;
}

export function DropZone({ onFile, isDragging, setIsDragging, disabled }: DropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, [setIsDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, [setIsDragging]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        onFile(file);
      }
    },
    [onFile, setIsDragging]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFile(file);
      }
    },
    [onFile]
  );

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
        isDragging
          ? "border-amber-500 bg-amber-500/10"
          : "border-zinc-700 hover:border-zinc-600"
      } ${disabled ? "opacity-50" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={disabled}
      />

      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-zinc-400"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <p className="text-white font-medium mb-1">
          {isDragging ? "Drop image here" : "Drop an image or click to upload"}
        </p>
        <p className="text-zinc-500 text-sm">
          PNG, JPG, GIF up to 10MB
        </p>
      </div>
    </div>
  );
}
