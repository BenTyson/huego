"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ModePageLayout } from "@/components/layout/ModePageLayout";
import { useIsPremium } from "@/store/subscription";

const GradientView = dynamic(
  () => import("@/components/modes/gradient").then((mod) => mod.GradientView),
  { ssr: false }
);

export default function GradientPage() {
  const isPremium = useIsPremium();
  const router = useRouter();

  // Redirect non-premium users
  useEffect(() => {
    if (!isPremium) {
      router.push("/immersive");
    }
  }, [isPremium, router]);

  // Don't render if not premium
  if (!isPremium) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="text-center">
          <div className="text-zinc-400 mb-2">Redirecting...</div>
          <div className="text-xs text-zinc-600">
            Gradient mode is a premium feature
          </div>
        </div>
      </div>
    );
  }

  return (
    <ModePageLayout enableGenerate>
      <GradientView />
    </ModePageLayout>
  );
}
