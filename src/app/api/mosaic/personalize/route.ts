import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { PersonalizeRequest, PersonalizeResponse } from "@/lib/mosaic-types";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json(
      { success: false, error: "Database not configured" } satisfies PersonalizeResponse,
      { status: 503 }
    );
  }

  try {
    const body: PersonalizeRequest = await request.json();
    const { hex3, custom_color_name, owner_display_name, blurb, stripe_checkout_session_id } = body;

    if (!hex3 || !custom_color_name || !owner_display_name || !stripe_checkout_session_id) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" } satisfies PersonalizeResponse,
        { status: 400 }
      );
    }

    const normalizedHex3 = hex3.toLowerCase();

    // Validate blurb length
    if (blurb && blurb.length > 280) {
      return NextResponse.json(
        { success: false, error: "Blurb must be 280 characters or less" } satisfies PersonalizeResponse,
        { status: 400 }
      );
    }

    // Find the claim by hex3 and checkout session
    const { data: claim, error: fetchError } = await supabase
      .from("color_claims")
      .select("id, payment_status")
      .eq("hex3", normalizedHex3)
      .eq("stripe_checkout_session_id", stripe_checkout_session_id)
      .single();

    if (fetchError || !claim) {
      return NextResponse.json(
        { success: false, error: "Claim not found" } satisfies PersonalizeResponse,
        { status: 404 }
      );
    }

    if (claim.payment_status !== "completed") {
      return NextResponse.json(
        { success: false, error: "Payment not yet confirmed" } satisfies PersonalizeResponse,
        { status: 402 }
      );
    }

    // Update with personalization
    const { data: updated, error: updateError } = await supabase
      .from("color_claims")
      .update({
        custom_color_name,
        owner_display_name,
        blurb: blurb || null,
        personalized_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", claim.id)
      .select(
        "id, hex3, hex6, owner_display_name, custom_color_name, blurb, claimed_at, personalized_at, payment_status"
      )
      .single();

    if (updateError || !updated) {
      console.error("Error updating personalization:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to save personalization" } satisfies PersonalizeResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      claim: updated,
    } satisfies PersonalizeResponse);
  } catch (error) {
    console.error("Error in mosaic personalize API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" } satisfies PersonalizeResponse,
      { status: 500 }
    );
  }
}
