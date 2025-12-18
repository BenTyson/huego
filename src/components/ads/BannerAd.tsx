"use client";

import { useIsPremium } from "@/store/subscription";
import { AdUnit } from "./AdUnit";

interface BannerAdProps {
  position?: "top" | "bottom";
}

// Default ad slot IDs - replace with actual slots from AdSense dashboard
const AD_SLOTS = {
  banner_top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER_TOP || "1234567890",
  banner_bottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER_BOTTOM || "0987654321",
};

export function BannerAd({ position = "bottom" }: BannerAdProps) {
  const isPremium = useIsPremium();

  if (isPremium) {
    return null;
  }

  const slot = position === "top" ? AD_SLOTS.banner_top : AD_SLOTS.banner_bottom;

  return (
    <div
      className={`w-full bg-zinc-900/50 backdrop-blur-sm ${
        position === "top" ? "border-b" : "border-t"
      } border-zinc-800`}
    >
      <div className="max-w-4xl mx-auto px-4 py-2">
        <AdUnit
          slot={slot}
          format="horizontal"
          responsive={true}
          className="min-h-[90px]"
        />
      </div>
    </div>
  );
}
