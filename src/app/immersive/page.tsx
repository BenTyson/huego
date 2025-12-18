"use client";

import { useEffect, useState } from "react";
import { ImmersiveView } from "@/components/modes/immersive";
import { ModeToggle } from "@/components/ModeToggle";
import { ActionBar } from "@/components/ActionBar";
import { BannerAd } from "@/components/ads";
import { useKeyboard } from "@/hooks/useKeyboard";

export default function ImmersivePage() {
  const [mounted, setMounted] = useState(false);

  // Enable keyboard shortcuts
  useKeyboard();

  // Prevent hydration mismatch (intentional setState in effect for client-only rendering)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <BannerAd position="top" />
      <ModeToggle />
      <ImmersiveView />
      <ActionBar />
    </>
  );
}
