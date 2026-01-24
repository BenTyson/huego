import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { PublishedPalette, PaletteListResponse, SortOption } from "@/lib/community-types";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json(
      { error: "Community features not configured" },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const sort = (searchParams.get("sort") as SortOption) || "newest";
    const search = searchParams.get("search") || "";
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    const colorCount = searchParams.get("colorCount");
    const cursor = searchParams.get("cursor");

    // Build query
    let query = supabase
      .from("published_palettes")
      .select("*")
      .eq("is_public", true);

    // Apply search filter (title or author name)
    if (search) {
      query = query.or(`title.ilike.%${search}%,author_display_name.ilike.%${search}%`);
    }

    // Apply tag filter
    if (tags.length > 0) {
      query = query.overlaps("mood_tags", tags);
    }

    // Apply color count filter
    if (colorCount) {
      query = query.eq("color_count", parseInt(colorCount, 10));
    }

    // Apply sorting
    switch (sort) {
      case "popular":
        query = query.order("view_count", { ascending: false });
        break;
      case "most_liked":
        query = query.order("like_count", { ascending: false });
        break;
      case "newest":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    // Apply cursor-based pagination
    if (cursor) {
      const cursorDate = new Date(cursor).toISOString();
      if (sort === "newest") {
        query = query.lt("created_at", cursorDate);
      }
    }

    // Limit results
    query = query.limit(PAGE_SIZE + 1); // Fetch one extra to check if there's more

    const { data, error } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch palettes" },
        { status: 500 }
      );
    }

    const palettes = data as PublishedPalette[];
    const hasMore = palettes.length > PAGE_SIZE;
    const returnedPalettes = hasMore ? palettes.slice(0, PAGE_SIZE) : palettes;

    // Get cursor for next page
    const nextCursor = hasMore && returnedPalettes.length > 0
      ? returnedPalettes[returnedPalettes.length - 1].created_at
      : null;

    const response: PaletteListResponse = {
      palettes: returnedPalettes,
      hasMore,
      cursor: nextCursor,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Palettes fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch palettes" },
      { status: 500 }
    );
  }
}
