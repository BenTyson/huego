export function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://huego.app";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "HueGo",
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    description:
      "A beautiful color palette generator with 4 unique modes: Immersive, Context, Mood, and Playground. Export to CSS, Tailwind, SCSS, and more.",
    url: siteUrl,
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        description: "Free tier with ads and 10 saved palettes",
      },
      {
        "@type": "Offer",
        name: "Premium",
        price: "3.00",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "3.00",
          priceCurrency: "USD",
          billingDuration: "P1M",
        },
        description: "Ad-free experience with unlimited saves and all export formats",
      },
    ],
    featureList: [
      "4 unique palette generation modes",
      "6 color harmony algorithms",
      "WCAG contrast checker",
      "Color blindness simulation",
      "Export to CSS, SCSS, Tailwind, JSON, SVG, PNG",
      "URL sharing",
      "Keyboard shortcuts",
    ],
    screenshot: `${siteUrl}/og-image.png`,
    softwareVersion: "1.0.0",
    author: {
      "@type": "Organization",
      name: "HueGo",
      url: siteUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
