import { NextRequest, NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import type Stripe from "stripe";

// Get subscription status from Stripe
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID required" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  try {
    const stripe = getStripeServer();

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });

    if (!session.subscription) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    const subscription = session.subscription as Stripe.Subscription;

    return NextResponse.json({
      isPremium: subscription.status === "active" || subscription.status === "trialing",
      status: subscription.status,
      subscriptionId: subscription.id,
      customerId: session.customer,
      currentPeriodEnd: subscription.items.data[0]?.current_period_end || null,
    });
  } catch (error) {
    console.error("Subscription fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

// Create customer portal session for managing subscription
export async function POST(request: NextRequest) {
  const { customerId } = await request.json();

  if (!customerId) {
    return NextResponse.json(
      { error: "Customer ID required" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  try {
    const stripe = getStripeServer();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3377";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/immersive`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Portal session error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
