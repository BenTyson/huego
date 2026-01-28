"use client";

import dynamic from "next/dynamic";
import { ModePageLayout } from "@/components/layout/ModePageLayout";

const PlaygroundView = dynamic(
  () => import("@/components/modes/playground").then((mod) => mod.PlaygroundView),
  { ssr: false }
);

export default function PlaygroundPage() {
  return (
    <ModePageLayout enableGenerate={true}>
      <PlaygroundView />
    </ModePageLayout>
  );
}
