"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getMosaicColor } from "@/lib/mosaic-grid";
import type { PersonalizeResponse } from "@/lib/mosaic-types";

export function MosaicSuccessView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hex3 = searchParams.get("hex3");
  const sessionId = searchParams.get("session_id");

  const [colorName, setColorName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [blurb, setBlurb] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const entry = hex3 ? getMosaicColor(hex3) : null;

  // Pre-fill display name from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("huego-author-name");
    if (saved) setDisplayName(saved);
  }, []);

  if (!hex3 || !sessionId || !entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-foreground/60">
          <p>Invalid success link.</p>
          <button
            onClick={() => router.push("/mosaic")}
            className="mt-4 text-sm underline hover:text-foreground"
          >
            Back to The Mosaic
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colorName.trim() || !displayName.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/mosaic/personalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hex3,
          custom_color_name: colorName.trim(),
          owner_display_name: displayName.trim(),
          blurb: blurb.trim() || undefined,
          stripe_checkout_session_id: sessionId,
        }),
      });

      const data: PersonalizeResponse = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to save");
        setIsSubmitting(false);
        return;
      }

      // Save display name for future use
      localStorage.setItem("huego-author-name", displayName.trim());
      setIsDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isDone) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div
            className="w-24 h-24 rounded-2xl mx-auto mb-6 shadow-lg"
            style={{ backgroundColor: entry.hex6 }}
          />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {colorName} is yours!
          </h1>
          <p className="text-foreground/60 mb-6">
            Your color now glows in The Mosaic for everyone to see.
          </p>
          <button
            onClick={() => router.push("/mosaic")}
            className="px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            View The Mosaic
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Color swatch */}
        <div
          className="w-full h-32 rounded-t-2xl"
          style={{ backgroundColor: entry.hex6 }}
        />

        {/* Form */}
        <div className="bg-command-bg border border-command-border border-t-0 rounded-b-2xl p-6">
          <h1 className="text-xl font-bold text-foreground mb-1">
            Make it yours
          </h1>
          <p className="text-foreground/60 text-sm mb-6">
            You claimed {entry.hex6} — now give it a name.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-foreground/50 uppercase tracking-wider mb-1">
                Color Name *
              </label>
              <input
                type="text"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="e.g. Midnight Orchid"
                maxLength={50}
                required
                className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground text-sm
                  placeholder:text-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground/50 uppercase tracking-wider mb-1">
                Your Name *
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Jane D."
                maxLength={50}
                required
                className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground text-sm
                  placeholder:text-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground/50 uppercase tracking-wider mb-1">
                Blurb{" "}
                <span className="normal-case text-foreground/30">
                  (optional, 280 chars)
                </span>
              </label>
              <textarea
                value={blurb}
                onChange={(e) => setBlurb(e.target.value)}
                placeholder="Why did you choose this color?"
                maxLength={280}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground text-sm
                  placeholder:text-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors resize-none"
              />
              <div className="text-right text-xs text-foreground/30 mt-0.5">
                {blurb.length}/280
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !colorName.trim() || !displayName.trim()}
              className="w-full py-3 rounded-xl bg-foreground text-background font-semibold text-sm
                hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isSubmitting ? "Saving..." : "Save & Light It Up"}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}
