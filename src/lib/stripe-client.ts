// Client-side Stripe utilities
import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!key) {
    console.warn("Stripe publishable key not configured");
    return Promise.resolve(null);
  }

  if (!stripePromise) {
    stripePromise = loadStripe(key);
  }

  return stripePromise;
}

// Redirect to Stripe Checkout using URL (modern approach)
export async function redirectToCheckout(checkoutUrl: string): Promise<void> {
  // Simply redirect to Stripe's hosted checkout page
  window.location.href = checkoutUrl;
}
