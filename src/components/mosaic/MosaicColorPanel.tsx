"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMosaicStore } from "@/store/mosaic";
import { getMosaicColor } from "@/lib/mosaic-grid";
import { MosaicClaimFlow } from "./MosaicClaimFlow";

export function MosaicColorPanel() {
  const selectedHex3 = useMosaicStore((s) => s.selectedHex3);
  const setSelectedHex3 = useMosaicStore((s) => s.setSelectedHex3);
  const getClaim = useMosaicStore((s) => s.getClaim);

  const entry = selectedHex3 ? getMosaicColor(selectedHex3) : null;
  const claim = selectedHex3 ? getClaim(selectedHex3) : undefined;
  const isClaimed = claim?.payment_status === "completed";

  return (
    <AnimatePresence>
      {selectedHex3 && entry && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedHex3(null)}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-command-bg border-l border-command-border z-50 flex flex-col overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedHex3(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-foreground/20 transition-colors z-10"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Color swatch */}
            <div
              className="w-full h-48 flex-shrink-0"
              style={{ backgroundColor: entry.hex6 }}
            />

            {/* Content */}
            <div className="p-6 flex-1">
              {/* Color info */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {isClaimed && claim?.custom_color_name
                    ? claim.custom_color_name
                    : entry.hex6}
                </h2>
                <div className="flex gap-3 text-sm text-foreground/60">
                  <span>{entry.hex6}</span>
                  <span>#{ selectedHex3.toUpperCase()}</span>
                  <span>
                    rgb({entry.rgb.r}, {entry.rgb.g}, {entry.rgb.b})
                  </span>
                </div>
              </div>

              {/* Claim status */}
              {isClaimed ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-foreground/70">Claimed</span>
                  </div>

                  {claim?.owner_display_name && (
                    <div>
                      <span className="text-xs text-foreground/50 uppercase tracking-wider">
                        Owner
                      </span>
                      <p className="text-foreground mt-0.5">
                        {claim.owner_display_name}
                      </p>
                    </div>
                  )}

                  {claim?.blurb && (
                    <div>
                      <span className="text-xs text-foreground/50 uppercase tracking-wider">
                        About this color
                      </span>
                      <p className="text-foreground/80 mt-0.5 text-sm leading-relaxed">
                        {claim.blurb}
                      </p>
                    </div>
                  )}

                  {claim?.claimed_at && (
                    <div>
                      <span className="text-xs text-foreground/50 uppercase tracking-wider">
                        Claimed on
                      </span>
                      <p className="text-foreground/60 mt-0.5 text-sm">
                        {new Date(claim.claimed_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-foreground/30" />
                    <span className="text-foreground/70">Unclaimed</span>
                  </div>

                  <p className="text-foreground/60 text-sm">
                    This color is waiting for someone to claim it. Give it a
                    name, write a blurb, and make it yours forever.
                  </p>

                  <MosaicClaimFlow hex3={selectedHex3} />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
