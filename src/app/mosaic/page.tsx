"use client";

import dynamic from "next/dynamic";

const MosaicView = dynamic(
  () => import("@/components/mosaic").then((mod) => mod.MosaicView),
  { ssr: false }
);

export default function MosaicPage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      <MosaicView />
    </div>
  );
}
