"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { ModeToggle } from "@/components/ModeToggle";
import { ActionBar } from "@/components/ActionBar";
import { HydrationLoader } from "@/components/ui/HydrationLoader";
import { useKeyboard } from "@/hooks/useKeyboard";

// Lazy load BannerAd only when needed
const BannerAd = dynamic(
  () => import("@/components/ads").then((mod) => mod.BannerAd),
  { ssr: false }
);

interface ModePageLayoutProps {
  children: ReactNode;
  enableGenerate?: boolean;
  showBannerAd?: boolean;
}

export function ModePageLayout({
  children,
  enableGenerate = true,
  showBannerAd = false,
}: ModePageLayoutProps) {
  const [mounted, setMounted] = useState(false);

  // Enable keyboard shortcuts
  useKeyboard({ enableGenerate });

  // Prevent hydration mismatch (intentional setState in effect for client-only rendering)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setMounted(true);
    // Set app mode for overflow hidden behavior
    document.body.classList.add("app-mode");
    document.body.classList.remove("marketing-mode");

    return () => {
      document.body.classList.remove("app-mode");
    };
  }, []);

  if (!mounted) {
    return <HydrationLoader />;
  }

  return (
    <>
      {showBannerAd && <BannerAd position="top" />}
      <ModeToggle />
      {children}
      <ActionBar />
    </>
  );
}
