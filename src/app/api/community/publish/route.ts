import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { PublishPaletteRequest, PublishPaletteResponse } from "@/lib/community-types";
// Note: FREE_PUBLISH_LIMIT enforcement happens client-side and via publish count tracking

// Rate limit: 10 publishes per hour per fingerprint
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 10;

// In-memory rate limit store (resets on server restart - fine for MVP)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(fingerprint: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(fingerprint);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(fingerprint, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

function generateShareCode(colors: { hex: string }[]): string {
  return colors.map((c) => c.hex.replace("#", "")).join("-");
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json(
      { error: "Community features not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { colors, title, harmony_type, mood_tags, author_display_name } = body as PublishPaletteRequest;
    const fingerprint = body.fingerprint as string;

    // Validate required fields
    if (!colors || !Array.isArray(colors) || colors.length < 2 || colors.length > 10) {
      return NextResponse.json(
        { error: "Invalid colors: must be array of 2-10 colors" },
        { status: 400 }
      );
    }

    if (!fingerprint) {
      return NextResponse.json(
        { error: "Fingerprint required" },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimit = checkRateLimit(fingerprint);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later.", remaining: 0 },
        { status: 429 }
      );
    }

    // Check user's total publish count (for free user limit)
    const { count: existingCount, error: countError } = await supabase
      .from("published_palettes")
      .select("*", { count: "exact", head: true })
      .eq("author_fingerprint", fingerprint);

    if (countError) {
      console.error("Count error:", countError);
    }

    // Note: Premium check would happen client-side or with additional auth
    // For now, we just track the count and let client enforce limits
    const totalPublished = existingCount || 0;

    // Generate share code from hex codes
    const shareCode = generateShareCode(colors);

    // Check if this exact palette already exists
    const { data: existing } = await supabase
      .from("published_palettes")
      .select("id, share_code")
      .eq("share_code", shareCode)
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        share_code: existing.share_code,
        message: "Palette already published",
        palette: existing,
      });
    }

    // Prepare hex codes array
    const hexCodes = colors.map((c) => c.hex);

    // Insert new palette
    const { data: newPalette, error: insertError } = await supabase
      .from("published_palettes")
      .insert({
        colors,
        hex_codes: hexCodes,
        color_count: colors.length,
        title: title || null,
        harmony_type: harmony_type || null,
        mood_tags: mood_tags || null,
        author_fingerprint: fingerprint,
        author_display_name: author_display_name || null,
        share_code: shareCode,
        is_public: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to publish palette" },
        { status: 500 }
      );
    }

    const response: PublishPaletteResponse = {
      success: true,
      palette: newPalette,
      share_code: newPalette.share_code,
    };

    return NextResponse.json(response, {
      headers: {
        "X-Publish-Count": String(totalPublished + 1),
        "X-Rate-Limit-Remaining": String(rateLimit.remaining),
      },
    });
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json(
      { error: "Failed to publish palette" },
      { status: 500 }
    );
  }
}
