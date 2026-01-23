// Stripe configuration and utilities
import Stripe from "stripe";

// Lazy-initialized Stripe instance (only created when needed)
let stripeInstance: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2025-11-17.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}


// Subscription price configuration
export const PREMIUM_PRICES = {
  monthly: {
    amount: 500, // $5.00 in cents
    currency: "usd",
    interval: "month" as const,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || "",
    label: "$5/month",
    description: "Billed monthly",
  },
  annual: {
    amount: 3600, // $36.00 in cents ($3/month effective)
    currency: "usd",
    interval: "year" as const,
    priceId: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID || "",
    label: "$36/year",
    description: "Save 40% - $3/month",
  },
};

// Legacy export for backward compatibility
export const PREMIUM_PRICE = PREMIUM_PRICES.monthly;

// URLs for checkout
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3377";

export const CHECKOUT_URLS = {
  success: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel: `${siteUrl}/checkout/cancel`,
};
