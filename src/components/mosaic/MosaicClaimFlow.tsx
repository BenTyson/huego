"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getFingerprint } from "@/lib/fingerprint";
import type { ClaimResponse } from "@/lib/mosaic-types";

interface MosaicClaimFlowProps {
  hex3: string;
}

export function MosaicClaimFlow({ hex3 }: MosaicClaimFlowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fingerprint = getFingerprint();
      const response = await fetch("/api/mosaic/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hex3, fingerprint }),
      });

      const data: ClaimResponse = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to start claim");
        setIsLoading(false);
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <motion.button
        onClick={handleClaim}
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-xl bg-foreground text-background font-semibold text-sm
          hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {isLoading ? "Reserving..." : "Claim for $10"}
      </motion.button>

      {error && (
        <motion.p
          className="text-red-500 text-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      <p className="text-foreground/40 text-xs text-center">
        You&apos;ll be redirected to Stripe to complete payment
      </p>
    </div>
  );
}
