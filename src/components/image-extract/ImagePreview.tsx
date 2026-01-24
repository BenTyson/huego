"use client";

import { LoadingSpinner } from "../ui/LoadingSpinner";

interface ImagePreviewProps {
  previewUrl: string;
  isProcessing: boolean;
}

export function ImagePreview({ previewUrl, isProcessing }: ImagePreviewProps) {
  return (
    <div className="relative rounded-xl overflow-hidden bg-zinc-800">
      <img
        src={previewUrl}
        alt="Uploaded image"
        className="w-full h-48 object-contain"
      />
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <LoadingSpinner size="md" variant="light" />
        </div>
      )}
    </div>
  );
}
