"use client";

import dynamic from "next/dynamic";
import { ModePageLayout } from "@/components/layout/ModePageLayout";

const MosaicView = dynamic(
  () => import("@/components/mosaic").then((mod) => mod.MosaicView),
  { ssr: false }
);

export default function MosaicPage() {
  return (
    <ModePageLayout enableGenerate={false}>
      <MosaicView />
    </ModePageLayout>
  );
}
