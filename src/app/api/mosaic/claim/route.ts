import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getStripeServer } from "@/lib/stripe";
import { getMosaicColor } from "@/lib/mosaic-grid";
import type { ClaimRequest, ClaimResponse } from "@/lib/mosaic-types";
import { MOSAIC_CLAIM_PRICE, MOSAIC_RESERVATION_MINUTES } from "@/lib/mosaic-types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3377";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json(
      { success: false, error: "Database not configured" } satisfies ClaimResponse,
      { status: 503 }
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { success: false, error: "Payments not configured" } satisfies ClaimResponse,
      { status: 503 }
    );
  }

  try {
    const body: ClaimRequest = await request.json();
    const { hex3, fingerprint } = body;

    if (!hex3 || !fingerprint) {
      return NextResponse.json(
        { success: false, error: "Missing hex3 or fingerprint" } satisfies ClaimResponse,
        { status: 400 }
      );
    }

    const normalizedHex3 = hex3.toLowerCase();

    // Verify it's a valid mosaic color
    const colorEntry = getMosaicColor(normalizedHex3);
    if (!colorEntry) {
      return NextResponse.json(
        { success: false, error: "Invalid color" } satisfies ClaimResponse,
        { status: 400 }
      );
    }

    // Clean up expired reservations first
    await supabase.rpc("cleanup_expired_reservations");

    // Check if color is already claimed or reserved
    const { data: existing } = await supabase
      .from("color_claims")
      .select("id, payment_status")
      .eq("hex3", normalizedHex3)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: "This color is already claimed or reserved" } satisfies ClaimResponse,
        { status: 409 }
      );
    }

    // Create Stripe checkout session
    const stripe = getStripeServer();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `The Mosaic — Color #${normalizedHex3.toUpperCase()}`,
              description: `Claim color ${colorEntry.hex6} in The Mosaic`,
            },
            unit_amount: MOSAIC_CLAIM_PRICE,
          },
          quantity: 1,
        },
      ],
      metadata: {
        product: "mosaic-color-claim",
        hex3: normalizedHex3,
        hex6: colorEntry.hex6,
        fingerprint,
      },
      success_url: `${siteUrl}/mosaic/success?session_id={CHECKOUT_SESSION_ID}&hex3=${normalizedHex3}`,
      cancel_url: `${siteUrl}/mosaic?cancelled=${normalizedHex3}`,
    });

    // Insert reservation row
    const now = new Date();
    const reservedUntil = new Date(
      now.getTime() + MOSAIC_RESERVATION_MINUTES * 60 * 1000
    );

    const { error: insertError } = await supabase
      .from("color_claims")
      .insert({
        hex3: normalizedHex3,
        hex6: colorEntry.hex6,
        owner_fingerprint: fingerprint,
        stripe_checkout_session_id: checkoutSession.id,
        amount_paid: MOSAIC_CLAIM_PRICE,
        payment_status: "pending",
        reserved_at: now.toISOString(),
        reserved_until: reservedUntil.toISOString(),
      });

    if (insertError) {
      // UNIQUE constraint violation means someone beat us
      if (insertError.code === "23505") {
        return NextResponse.json(
          { success: false, error: "This color was just claimed by someone else" } satisfies ClaimResponse,
          { status: 409 }
        );
      }
      console.error("Error inserting reservation:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to reserve color" } satisfies ClaimResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.url ?? undefined,
    } satisfies ClaimResponse);
  } catch (error) {
    console.error("Error in mosaic claim API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" } satisfies ClaimResponse,
      { status: 500 }
    );
  }
}
