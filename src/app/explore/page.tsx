"use client";

import dynamic from "next/dynamic";
import { ModePageLayout } from "@/components/layout/ModePageLayout";

const ExploreView = dynamic(
  () => import("@/components/modes/explore").then((mod) => mod.ExploreView),
  { ssr: false }
);

export default function ExplorePage() {
  return (
    <ModePageLayout showBannerAd={false} enableGenerate={false}>
      <ExploreView />
    </ModePageLayout>
  );
}
