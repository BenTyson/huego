import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HueGo - Color Palette Generator",
  description: "Ready, set, HueGo. A beautiful color palette generator with multiple modes for designers and developers.",
  keywords: ["color palette", "color generator", "design tools", "color scheme", "UI colors"],
  authors: [{ name: "HueGo" }],
  openGraph: {
    title: "HueGo - Color Palette Generator",
    description: "Ready, set, HueGo. Generate beautiful color palettes instantly.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HueGo - Color Palette Generator",
    description: "Ready, set, HueGo. Generate beautiful color palettes instantly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
