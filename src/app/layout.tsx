import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { AdSenseScript } from "@/components/ads";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://huego.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HueGo - Color Palette Generator",
    template: "%s | HueGo",
  },
  description: "Ready, set, HueGo. A beautiful color palette generator with 4 unique modes: Immersive, Context, Mood, and Playground. Perfect for designers and developers.",
  keywords: [
    "color palette generator",
    "color scheme creator",
    "design tools",
    "UI color picker",
    "hex color palette",
    "color harmony",
    "tailwind colors",
    "css color variables",
    "color accessibility",
    "WCAG contrast checker",
  ],
  authors: [{ name: "HueGo" }],
  creator: "HueGo",
  publisher: "HueGo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "HueGo - Color Palette Generator",
    description: "Ready, set, HueGo. Generate beautiful color palettes with 4 unique modes. Export to CSS, Tailwind, SCSS, and more.",
    url: siteUrl,
    siteName: "HueGo",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HueGo - Color Palette Generator",
    description: "Ready, set, HueGo. Generate beautiful color palettes instantly.",
    creator: "@huego_app",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Design Tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
        <AdSenseScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
