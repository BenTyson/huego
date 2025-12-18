"use client";

import Script from "next/script";

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export function AdSenseScript() {
  // Don't load if no client ID configured
  if (!ADSENSE_CLIENT_ID) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
}
