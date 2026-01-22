"use client";

import dynamic from "next/dynamic";
import { ModePageLayout } from "@/components/layout/ModePageLayout";

const ImmersiveView = dynamic(
  () => import("@/components/modes/immersive").then((mod) => mod.ImmersiveView),
  { ssr: false }
);

export default function ImmersivePage() {
  return (
    <ModePageLayout showBannerAd enableGenerate>
      <ImmersiveView />
    </ModePageLayout>
  );
}
