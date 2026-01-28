// Zustand store for The Mosaic — color claims state management

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ColorClaim, MosaicStats, ColorsResponse } from "@/lib/mosaic-types";

interface MosaicState {
  // Claims data
  claims: ColorClaim[];
  claimMap: Map<string, ColorClaim>;
  stats: MosaicStats | null;
  isLoading: boolean;
  error: string | null;

  // UI state
  selectedHex3: string | null;
  hoveredHex3: string | null;

  // Actions
  fetchClaims: () => Promise<void>;
  setSelectedHex3: (hex3: string | null) => void;
  setHoveredHex3: (hex3: string | null) => void;
  getClaim: (hex3: string) => ColorClaim | undefined;
  handleRealtimeClaim: (claim: ColorClaim) => void;
}

export const useMosaicStore = create<MosaicState>()(
  persist(
    (set, get) => ({
      // Initial state
      claims: [],
      claimMap: new Map(),
      stats: null,
      isLoading: false,
      error: null,
      selectedHex3: null,
      hoveredHex3: null,

      fetchClaims: async () => {
        if (get().isLoading) return;
        set({ isLoading: true, error: null });

        try {
          const response = await fetch("/api/mosaic/colors");
          if (!response.ok) throw new Error("Failed to fetch claims");

          const data: ColorsResponse = await response.json();
          const claimMap = new Map<string, ColorClaim>();
          for (const claim of data.claims) {
            claimMap.set(claim.hex3, claim);
          }

          set({
            claims: data.claims,
            claimMap,
            stats: data.stats,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch claims",
            isLoading: false,
          });
        }
      },

      setSelectedHex3: (hex3) => set({ selectedHex3: hex3 }),
      setHoveredHex3: (hex3) => set({ hoveredHex3: hex3 }),

      getClaim: (hex3) => get().claimMap.get(hex3),

      handleRealtimeClaim: (claim) => {
        set((state) => {
          const newClaims = [...state.claims.filter((c) => c.hex3 !== claim.hex3), claim];
          const newMap = new Map(state.claimMap);
          newMap.set(claim.hex3, claim);
          const claimedCount = newClaims.filter((c) => c.payment_status === "completed").length;
          const reservedCount = newClaims.filter((c) => c.payment_status === "pending").length;

          return {
            claims: newClaims,
            claimMap: newMap,
            stats: state.stats
              ? {
                  ...state.stats,
                  claimedCount,
                  reservedCount,
                  recentClaims: [claim, ...state.stats.recentClaims.slice(0, 4)],
                }
              : null,
          };
        });
      },
    }),
    {
      name: "huego-mosaic",
      partialize: (state) => ({
        // Only persist UI preferences, not fetched data
        selectedHex3: state.selectedHex3,
      }),
    }
  )
);

// Selector hooks
export const useMosaicClaims = () => useMosaicStore((state) => state.claims);
export const useMosaicClaimMap = () => useMosaicStore((state) => state.claimMap);
export const useMosaicStats = () => useMosaicStore((state) => state.stats);
export const useMosaicLoading = () => useMosaicStore((state) => state.isLoading);
export const useMosaicError = () => useMosaicStore((state) => state.error);
export const useSelectedHex3 = () => useMosaicStore((state) => state.selectedHex3);
export const useHoveredHex3 = () => useMosaicStore((state) => state.hoveredHex3);
