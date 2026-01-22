"use client";

import dynamic from "next/dynamic";
import { ModePageLayout } from "@/components/layout/ModePageLayout";

const MoodView = dynamic(
  () => import("@/components/modes/mood").then((mod) => mod.MoodView),
  { ssr: false }
);

export default function MoodPage() {
  return (
    <ModePageLayout enableGenerate={false}>
      <MoodView />
    </ModePageLayout>
  );
}
