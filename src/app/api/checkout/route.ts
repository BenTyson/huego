import { NextRequest, NextResponse } from "next/server";
import { getStripeServer, PREMIUM_PRICES, CHECKOUT_URLS } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PREMIUM_PRICE_ID) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const billingPeriod = body.billingPeriod || "monthly";

    // Get the appropriate price ID
    const priceConfig = billingPeriod === "annual" ? PREMIUM_PRICES.annual : PREMIUM_PRICES.monthly;
    const priceId = priceConfig.priceId;

    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID not configured for ${billingPeriod} billing` },
        { status: 503 }
      );
    }

    const stripe = getStripeServer();

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: CHECKOUT_URLS.success,
      cancel_url: CHECKOUT_URLS.cancel,
      // Allow promotion codes
      allow_promotion_codes: true,
      // Collect billing address
      billing_address_collection: "auto",
      // Subscription settings
      subscription_data: {
        metadata: {
          product: "huego-premium",
          billingPeriod,
        },
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
