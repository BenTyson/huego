"use client";

import dynamic from "next/dynamic";
import { ModePageLayout } from "@/components/layout/ModePageLayout";

const MosaicSuccessView = dynamic(
  () => import("@/components/mosaic").then((mod) => mod.MosaicSuccessView),
  { ssr: false }
);

export default function MosaicSuccessPage() {
  return (
    <ModePageLayout enableGenerate={false}>
      <MosaicSuccessView />
    </ModePageLayout>
  );
}
