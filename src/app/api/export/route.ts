import { NextRequest, NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import type { ExportFormat } from "@/lib/types";

const PREMIUM_FORMATS: ExportFormat[] = ["scss", "tailwind", "svg", "png"];

/**
 * Server-side validation for premium export formats
 * This prevents users from faking premium status via localStorage
 */
export async function POST(request: NextRequest) {
  try {
    const { format, subscriptionId, customerId } = await request.json();

    // Free formats don't need validation
    if (!PREMIUM_FORMATS.includes(format)) {
      return NextResponse.json({ allowed: true });
    }

    // Premium format requested - validate subscription
    if (!subscriptionId || !customerId) {
      return NextResponse.json(
        { allowed: false, error: "Premium subscription required" },
        { status: 403 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      // In development without Stripe, allow all
      console.warn("Stripe not configured - allowing premium format in dev");
      return NextResponse.json({ allowed: true });
    }

    const stripe = getStripeServer();

    // Verify subscription is active with Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Check if subscription belongs to the customer
    if (subscription.customer !== customerId) {
      return NextResponse.json(
        { allowed: false, error: "Subscription mismatch" },
        { status: 403 }
      );
    }

    // Check subscription status
    const isActive =
      subscription.status === "active" || subscription.status === "trialing";

    if (!isActive) {
      return NextResponse.json(
        { allowed: false, error: "Subscription not active" },
        { status: 403 }
      );
    }

    return NextResponse.json({ allowed: true });
  } catch (error) {
    console.error("Export validation error:", error);
    return NextResponse.json(
      { allowed: false, error: "Validation failed" },
      { status: 500 }
    );
  }
}
