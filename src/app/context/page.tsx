"use client";

import dynamic from "next/dynamic";
import { ModePageLayout } from "@/components/layout/ModePageLayout";

const ContextView = dynamic(
  () => import("@/components/modes/context").then((mod) => mod.ContextView),
  { ssr: false }
);

export default function ContextPage() {
  return (
    <ModePageLayout enableGenerate>
      <ContextView />
    </ModePageLayout>
  );
}
