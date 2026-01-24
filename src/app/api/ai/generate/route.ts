import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

// Rate limits by tier
const RATE_LIMITS = {
  free: { perMinute: 3, perDay: 10 },
  premium: { perMinute: 30, perDay: Infinity },
};

// In-memory rate limit stores
const minuteStore = new Map<string, { count: number; resetTime: number }>();
const dailyStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(
  fingerprint: string,
  isPremium: boolean
): { allowed: boolean; remaining: number; error?: string } {
  const now = Date.now();
  const limits = isPremium ? RATE_LIMITS.premium : RATE_LIMITS.free;

  // Check minute limit
  const minuteEntry = minuteStore.get(fingerprint);
  if (!minuteEntry || now > minuteEntry.resetTime) {
    minuteStore.set(fingerprint, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
  } else if (minuteEntry.count >= limits.perMinute) {
    const waitSeconds = Math.ceil((minuteEntry.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      error: `Rate limit exceeded. Try again in ${waitSeconds} seconds.`,
    };
  } else {
    minuteEntry.count += 1;
  }

  // Check daily limit (only for free users)
  if (!isPremium) {
    const dailyEntry = dailyStore.get(fingerprint);
    if (!dailyEntry || now > dailyEntry.resetTime) {
      dailyStore.set(fingerprint, { count: 1, resetTime: now + DAILY_WINDOW_MS });
    } else if (dailyEntry.count >= limits.perDay) {
      return {
        allowed: false,
        remaining: 0,
        error: "Daily limit reached. Upgrade to Pro for unlimited AI generation.",
      };
    } else {
      dailyEntry.count += 1;
    }
  }

  const minuteRemaining = limits.perMinute - (minuteStore.get(fingerprint)?.count || 0);
  return { allowed: true, remaining: Math.max(0, minuteRemaining) };
}

// System prompt for Claude
const SYSTEM_PROMPT = `You are a professional color palette designer. Generate color palettes based on user descriptions.

RULES:
1. Return EXACTLY the number of colors requested (default: 5)
2. Return as JSON array: [{"hex": "#RRGGBB", "name": "Color Name"}, ...]
3. Hex codes must be valid 6-digit uppercase format
4. Color names should be descriptive and evocative (e.g., "Sunset Orange", "Deep Ocean", "Misty Lavender")
5. Consider color harmony, contrast, and visual balance
6. Think about the mood and feeling the user wants to evoke
7. Respond ONLY with valid JSON, no additional text, no markdown code blocks`;

// Hex validation regex
const hexRegex = /^#[A-Fa-f0-9]{6}$/;

interface ColorResponse {
  hex: string;
  name: string;
}

export async function POST(request: NextRequest) {
  // Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI features not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { prompt, colorCount = 5, fingerprint, isPremium = false } = body;

    // Validate required fields
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: "Prompt must be 500 characters or less" },
        { status: 400 }
      );
    }

    if (!fingerprint) {
      return NextResponse.json(
        { error: "Fingerprint required for rate limiting" },
        { status: 400 }
      );
    }

    if (colorCount < 2 || colorCount > 10) {
      return NextResponse.json(
        { error: "Color count must be between 2 and 10" },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimit = checkRateLimit(fingerprint, isPremium);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.error },
        { status: 429 }
      );
    }

    // Create Anthropic client
    const anthropic = new Anthropic({
      apiKey,
    });

    // Call Claude API
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate a ${colorCount}-color palette for: ${prompt}`,
        },
      ],
    });

    // Extract text response
    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from AI");
    }

    // Parse JSON response
    let colors: ColorResponse[];
    try {
      // Handle potential markdown code blocks
      let jsonText = textContent.text.trim();
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
      }
      colors = JSON.parse(jsonText);
    } catch {
      console.error("Failed to parse AI response:", textContent.text);
      throw new Error("Invalid response format from AI");
    }

    // Validate response structure
    if (!Array.isArray(colors)) {
      throw new Error("AI response is not an array");
    }

    // Validate and normalize each color
    const validatedColors = colors.map((color, index) => {
      if (!color.hex || !color.name) {
        throw new Error(`Color at index ${index} missing hex or name`);
      }

      // Normalize hex to uppercase with #
      let hex = color.hex.trim();
      if (!hex.startsWith("#")) {
        hex = "#" + hex;
      }
      hex = hex.toUpperCase();

      if (!hexRegex.test(hex)) {
        throw new Error(`Invalid hex code: ${color.hex}`);
      }

      return {
        hex,
        name: color.name.trim(),
      };
    });

    return NextResponse.json(
      {
        success: true,
        colors: validatedColors,
        remaining: rateLimit.remaining,
      },
      {
        headers: {
          "X-Rate-Limit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error("AI generate error:", error);

    // Handle Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: "AI service is busy. Please try again shortly." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: "AI service error. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate palette" },
      { status: 500 }
    );
  }
}
