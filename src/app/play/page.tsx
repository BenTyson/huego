"use client";

import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/ModeToggle";
import { ActionBar } from "@/components/ActionBar";
import { PlaygroundView } from "@/components/modes/playground";
import { useKeyboard } from "@/hooks/useKeyboard";

export default function PlaygroundPage() {
  const [mounted, setMounted] = useState(false);

  // Disable spacebar generation in playground mode (use swipe instead)
  useKeyboard({ enableGenerate: false });

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
      <ModeToggle />
      <PlaygroundView />
      <ActionBar />
    </>
  );
}
