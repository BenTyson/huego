import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Mosaic — HueGo",
  description:
    "A living artwork of 4,096 colors. Claim a color, name it, and make it yours forever.",
  openGraph: {
    title: "The Mosaic — HueGo",
    description:
      "A living artwork of 4,096 colors. Claim a color, name it, and make it yours forever.",
  },
};

export default function MosaicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
