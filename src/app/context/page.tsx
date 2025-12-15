"use client";

import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/ModeToggle";
import { ActionBar } from "@/components/ActionBar";
import { ContextView } from "@/components/modes/context";
import { useKeyboard } from "@/hooks/useKeyboard";

export default function ContextPage() {
  const [mounted, setMounted] = useState(false);

  useKeyboard();

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
      <ContextView />
      <ActionBar />
    </>
  );
}
