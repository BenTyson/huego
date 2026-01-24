// Zustand store for subscription/premium state management
// Persisted to localStorage with server-side verification

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Subscription, ExportFormat } from "@/lib/types";
import {
  FREE_MAX_PALETTE_SIZE,
  PREMIUM_MAX_PALETTE_SIZE,
  MIN_PALETTE_SIZE,
  FREE_SAVED_PALETTES_LIMIT as FREE_SAVED_LIMIT,
  isExportFormatFree,
  isModeFree,
  isHarmonyFree,
} from "@/lib/feature-limits";

interface SubscriptionState extends Subscription {
  // Verification state
  lastVerified: number | null;
  isVerifying: boolean;

  // Actions
  setPremium: (isPremium: boolean) => void;
  setSubscription: (subscription: Partial<Subscription>) => void;
  clearSubscription: () => void;
  verifySubscription: () => Promise<boolean>;

  // Helpers
  canUseExportFormat: (format: ExportFormat) => boolean;
  getSavedPalettesLimit: () => number;
  getMaxPaletteSize: () => number;
  canUsePaletteSize: (size: number) => boolean;
  canUseMode: (mode: string) => boolean;
  canUseHarmony: (harmony: string) => boolean;
  canUseAccessibilityFeature: (feature: string) => boolean;
}

const initialState: Subscription & { lastVerified: number | null; isVerifying: boolean } = {
  isPremium: false,
  status: null,
  customerId: null,
  subscriptionId: null,
  currentPeriodEnd: null,
  lastVerified: null,
  isVerifying: false,
};

// Free tier limits - using centralized feature-limits
// Note: FREE_EXPORT_FORMATS, FREE_MODES, FREE_HARMONIES are imported from feature-limits
const FREE_ACCESSIBILITY_FEATURES = ["contrast-aa", "protanopia", "deuteranopia"];

// Verification cache duration (5 minutes)
const VERIFICATION_CACHE_MS = 5 * 60 * 1000;

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPremium: (isPremium: boolean) => {
        set({ isPremium });
      },

      setSubscription: (subscription: Partial<Subscription>) => {
        set((state) => ({
          ...state,
          ...subscription,
          isPremium: subscription.status === "active" || subscription.status === "trialing",
          lastVerified: Date.now(),
        }));
      },

      clearSubscription: () => {
        set(initialState);
      },

      /**
       * Verify subscription with server
       * Returns true if premium, false otherwise
       */
      verifySubscription: async () => {
        const state = get();

        // If no subscription data, not premium
        if (!state.subscriptionId || !state.customerId) {
          set({ isPremium: false });
          return false;
        }

        // Check if we have a recent verification
        if (
          state.lastVerified &&
          Date.now() - state.lastVerified < VERIFICATION_CACHE_MS
        ) {
          return state.isPremium;
        }

        // Verify with server
        set({ isVerifying: true });

        try {
          const response = await fetch("/api/verify-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subscriptionId: state.subscriptionId,
              customerId: state.customerId,
            }),
          });

          const data = await response.json();

          set({
            isPremium: data.isPremium,
            status: data.status || state.status,
            currentPeriodEnd: data.currentPeriodEnd || state.currentPeriodEnd,
            lastVerified: Date.now(),
            isVerifying: false,
          });

          return data.isPremium;
        } catch (error) {
          console.error("Subscription verification failed:", error);
          set({ isVerifying: false });
          // On error, use cached state but don't update lastVerified
          return state.isPremium;
        }
      },

      canUseExportFormat: (format: ExportFormat) => {
        const { isPremium } = get();
        return isPremium || isExportFormatFree(format);
      },

      getSavedPalettesLimit: () => {
        const { isPremium } = get();
        return isPremium ? Infinity : FREE_SAVED_LIMIT;
      },

      getMaxPaletteSize: () => {
        const { isPremium } = get();
        return isPremium ? PREMIUM_MAX_PALETTE_SIZE : FREE_MAX_PALETTE_SIZE;
      },

      canUsePaletteSize: (size: number) => {
        const { isPremium } = get();
        if (size < MIN_PALETTE_SIZE) return false;
        const maxSize = isPremium ? PREMIUM_MAX_PALETTE_SIZE : FREE_MAX_PALETTE_SIZE;
        return size <= maxSize;
      },

      canUseMode: (mode: string) => {
        const { isPremium } = get();
        return isPremium || isModeFree(mode as import("@/lib/types").Mode);
      },

      canUseHarmony: (harmony: string) => {
        const { isPremium } = get();
        return isPremium || isHarmonyFree(harmony as import("@/lib/types").HarmonyType);
      },

      canUseAccessibilityFeature: (feature: string) => {
        const { isPremium } = get();
        return isPremium || FREE_ACCESSIBILITY_FEATURES.includes(feature);
      },
    }),
    {
      name: "huego-subscription",
      partialize: (state) => ({
        isPremium: state.isPremium,
        status: state.status,
        customerId: state.customerId,
        subscriptionId: state.subscriptionId,
        currentPeriodEnd: state.currentPeriodEnd,
        lastVerified: state.lastVerified,
      }),
    }
  )
);

// Selector hooks
export const useIsPremium = () => useSubscriptionStore((state) => state.isPremium);
export const useSubscriptionStatus = () => useSubscriptionStore((state) => state.status);
export const useIsVerifying = () => useSubscriptionStore((state) => state.isVerifying);
export const useCanUseExportFormat = (format: ExportFormat) =>
  useSubscriptionStore((state) => state.canUseExportFormat(format));
export const useSavedPalettesLimit = () =>
  useSubscriptionStore((state) => state.getSavedPalettesLimit());
export const useMaxPaletteSize = () =>
  useSubscriptionStore((state) => state.getMaxPaletteSize());
export const useCanUsePaletteSize = (size: number) =>
  useSubscriptionStore((state) => state.canUsePaletteSize(size));
export const useCanUseMode = (mode: string) =>
  useSubscriptionStore((state) => state.canUseMode(mode));
export const useCanUseHarmony = (harmony: string) =>
  useSubscriptionStore((state) => state.canUseHarmony(harmony));
export const useCanUseAccessibilityFeature = (feature: string) =>
  useSubscriptionStore((state) => state.canUseAccessibilityFeature(feature));
