"use client";

interface HydrationLoaderProps {
  message?: string;
}

export function HydrationLoader({ message = "Loading..." }: HydrationLoaderProps) {
  return (
    <div className="h-screen w-screen bg-zinc-900 flex items-center justify-center">
      <div className="text-zinc-500 animate-pulse">{message}</div>
    </div>
  );
}
