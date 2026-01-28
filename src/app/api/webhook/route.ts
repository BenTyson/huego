import { NextRequest, NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import Stripe from "stripe";

// Disable body parsing - we need raw body for webhook verification
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    console.error("Stripe webhook not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripeServer();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Checkout completed:", session.id);

      // Handle mosaic color claims
      if (session.metadata?.product === "mosaic-color-claim" && supabase) {
        const hex3 = session.metadata.hex3;
        if (hex3) {
          const { error: updateError } = await supabase
            .from("color_claims")
            .update({
              payment_status: "completed",
              stripe_payment_intent_id:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : session.payment_intent?.id || null,
              claimed_at: new Date().toISOString(),
              reserved_until: null, // Clear reservation expiry
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_checkout_session_id", session.id)
            .eq("hex3", hex3);

          if (updateError) {
            console.error("Error confirming mosaic claim:", updateError);
          } else {
            console.log(`Mosaic color #${hex3} claimed successfully`);
          }
        }
      }

      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("Subscription updated:", subscription.id, subscription.status);
      // Update subscription status in database
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("Subscription canceled:", subscription.id);
      // Mark subscription as canceled in database
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log("Payment failed:", invoice.id);
      // Notify user, update status
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
