import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { ColorsResponse, ColorClaim, MosaicStats } from "@/lib/mosaic-types";
import { MOSAIC_TOTAL_COLORS } from "@/lib/mosaic-types";

export async function GET() {
  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    // Clean up expired reservations first
    await supabase.rpc("cleanup_expired_reservations");

    // Fetch all completed and pending claims
    const { data: claims, error } = await supabase
      .from("color_claims")
      .select(
        "id, hex3, hex6, owner_display_name, custom_color_name, blurb, claimed_at, personalized_at, payment_status"
      )
      .in("payment_status", ["completed", "pending"])
      .order("claimed_at", { ascending: false });

    if (error) {
      console.error("Error fetching claims:", error);
      return NextResponse.json(
        { error: "Failed to fetch claims" },
        { status: 500 }
      );
    }

    const claimsList: ColorClaim[] = claims || [];
    const claimedCount = claimsList.filter(
      (c) => c.payment_status === "completed"
    ).length;
    const reservedCount = claimsList.filter(
      (c) => c.payment_status === "pending"
    ).length;

    const stats: MosaicStats = {
      totalColors: MOSAIC_TOTAL_COLORS,
      claimedCount,
      reservedCount,
      recentClaims: claimsList
        .filter((c) => c.payment_status === "completed")
        .slice(0, 5),
    };

    const response: ColorsResponse = {
      claims: claimsList,
      stats,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error in mosaic colors API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
