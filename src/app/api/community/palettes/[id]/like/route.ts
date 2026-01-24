import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { LikeResponse } from "@/lib/community-types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json(
      { error: "Community features not configured" },
      { status: 503 }
    );
  }

  try {
    const { id: paletteId } = await params;
    const body = await request.json();
    const { fingerprint } = body;

    if (!fingerprint) {
      return NextResponse.json(
        { error: "Fingerprint required" },
        { status: 400 }
      );
    }

    if (!paletteId) {
      return NextResponse.json(
        { error: "Palette ID required" },
        { status: 400 }
      );
    }

    // Check if palette exists
    const { data: palette, error: paletteError } = await supabase
      .from("published_palettes")
      .select("id, like_count")
      .eq("id", paletteId)
      .single();

    if (paletteError || !palette) {
      return NextResponse.json(
        { error: "Palette not found" },
        { status: 404 }
      );
    }

    // Check if already liked
    const { data: existingLike } = await supabase
      .from("palette_likes")
      .select("id")
      .eq("palette_id", paletteId)
      .eq("fingerprint", fingerprint)
      .single();

    let liked: boolean;
    let newLikeCount: number;

    if (existingLike) {
      // Unlike - remove the like
      const { error: deleteError } = await supabase
        .from("palette_likes")
        .delete()
        .eq("palette_id", paletteId)
        .eq("fingerprint", fingerprint);

      if (deleteError) {
        console.error("Delete like error:", deleteError);
        return NextResponse.json(
          { error: "Failed to unlike" },
          { status: 500 }
        );
      }

      liked = false;
      // The trigger will update like_count, but we need to return the updated value
      newLikeCount = Math.max(0, palette.like_count - 1);
    } else {
      // Like - add new like
      const { error: insertError } = await supabase
        .from("palette_likes")
        .insert({
          palette_id: paletteId,
          fingerprint,
        });

      if (insertError) {
        console.error("Insert like error:", insertError);
        return NextResponse.json(
          { error: "Failed to like" },
          { status: 500 }
        );
      }

      liked = true;
      newLikeCount = palette.like_count + 1;
    }

    // Fetch the updated like count from the database (trigger should have updated it)
    const { data: updatedPalette } = await supabase
      .from("published_palettes")
      .select("like_count")
      .eq("id", paletteId)
      .single();

    const response: LikeResponse = {
      success: true,
      liked,
      like_count: updatedPalette?.like_count ?? newLikeCount,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Like toggle error:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
