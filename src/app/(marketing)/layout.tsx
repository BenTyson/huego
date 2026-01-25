"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/marketing/Navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Set body class for marketing mode (enables scrolling)
  useEffect(() => {
    document.body.classList.add("marketing-mode");
    document.body.classList.remove("app-mode");

    return () => {
      document.body.classList.remove("marketing-mode");
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
