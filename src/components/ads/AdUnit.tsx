"use client";

import { useEffect, useRef } from "react";
import { useIsPremium } from "@/store/subscription";

// Extend window type for adsbygoogle
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdUnitProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
}

export function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isPremium = useIsPremium();
  const isLoaded = useRef(false);

  useEffect(() => {
    // Don't show ads to premium users
    if (isPremium) return;

    // Don't load if no client ID
    const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    if (!clientId) return;

    // Only load once
    if (isLoaded.current) return;

    try {
      // Push ad to adsbygoogle queue
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isLoaded.current = true;
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, [isPremium]);

  // Don't render for premium users
  if (isPremium) {
    return null;
  }

  // Don't render if no client ID configured (development mode)
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!clientId) {
    // Show placeholder in development
    if (process.env.NODE_ENV === "development") {
      return (
        <div
          className={`bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center text-zinc-500 text-sm ${className}`}
          style={{ minHeight: 90 }}
        >
          Ad Placeholder (slot: {slot})
        </div>
      );
    }
    return null;
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{ display: "block" }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}
