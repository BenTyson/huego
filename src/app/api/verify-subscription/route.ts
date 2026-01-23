import { NextRequest, NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";

/**
 * Server-side subscription verification
 * Used to verify that a subscription is genuinely active
 */
export async function POST(request: NextRequest) {
  try {
    const { subscriptionId, customerId } = await request.json();

    if (!subscriptionId || !customerId) {
      return NextResponse.json({
        valid: false,
        isPremium: false,
        error: "Missing subscription or customer ID",
      });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("Stripe not configured - subscription verification skipped");
      return NextResponse.json({
        valid: true,
        isPremium: true,
        message: "Stripe not configured (dev mode)",
      });
    }

    const stripe = getStripeServer();

    // Retrieve and verify the subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Verify customer matches
    if (subscription.customer !== customerId) {
      return NextResponse.json({
        valid: false,
        isPremium: false,
        error: "Customer mismatch",
      });
    }

    // Check subscription status
    const isActive =
      subscription.status === "active" || subscription.status === "trialing";

    return NextResponse.json({
      valid: true,
      isPremium: isActive,
      status: subscription.status,
      currentPeriodEnd: subscription.items.data[0]?.current_period_end || null,
    });
  } catch (error) {
    console.error("Subscription verification error:", error);
    return NextResponse.json({
      valid: false,
      isPremium: false,
      error: "Verification failed",
    });
  }
}
