"use client";

import { motion } from "framer-motion";
import { useMosaicStats, useMosaicLoading } from "@/store/mosaic";
import { MOSAIC_TOTAL_COLORS } from "@/lib/mosaic-types";

export function MosaicStatsBar() {
  const stats = useMosaicStats();
  const isLoading = useMosaicLoading();

  const claimedCount = stats?.claimedCount ?? 0;
  const percent = ((claimedCount / MOSAIC_TOTAL_COLORS) * 100).toFixed(1);

  return (
    <motion.div
      className="w-full max-w-xl mb-4 px-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05 }}
    >
      <div className="flex items-center justify-between text-xs text-foreground/50 mb-1.5">
        <span>
          {isLoading
            ? "Loading..."
            : `${claimedCount.toLocaleString()} of ${MOSAIC_TOTAL_COLORS.toLocaleString()} claimed`}
        </span>
        <span>{percent}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-foreground/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Recent claims */}
      {stats && stats.recentClaims.length > 0 && (
        <div className="flex items-center gap-2 mt-2 text-xs text-foreground/40">
          <span>Recent:</span>
          <div className="flex gap-1">
            {stats.recentClaims.slice(0, 5).map((claim) => (
              <div
                key={claim.hex3}
                className="w-4 h-4 rounded-sm border border-foreground/10"
                style={{ backgroundColor: claim.hex6 }}
                title={
                  claim.custom_color_name || `#${claim.hex3.toUpperCase()}`
                }
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
