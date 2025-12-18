// Zustand store for subscription/premium state management
// Persisted to localStorage

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Subscription, ExportFormat } from "@/lib/types";

interface SubscriptionState extends Subscription {
  // Actions
  setPremium: (isPremium: boolean) => void;
  setSubscription: (subscription: Partial<Subscription>) => void;
  clearSubscription: () => void;

  // Helpers
  canUseExportFormat: (format: ExportFormat) => boolean;
  getSavedPalettesLimit: () => number;
  isFeatureLocked: (feature: "unlimited_saves" | "advanced_exports" | "ad_free") => boolean;
}

const initialState: Subscription = {
  isPremium: false,
  status: null,
  customerId: null,
  subscriptionId: null,
  currentPeriodEnd: null,
};

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
        }));
      },

      clearSubscription: () => {
        set(initialState);
      },

      canUseExportFormat: (format: ExportFormat) => {
        const { isPremium } = get();
        const freeFormats: ExportFormat[] = ["css", "json", "array"];
        return isPremium || freeFormats.includes(format);
      },

      getSavedPalettesLimit: () => {
        const { isPremium } = get();
        return isPremium ? Infinity : 10;
      },

      isFeatureLocked: (feature) => {
        const { isPremium } = get();
        if (isPremium) return false;

        switch (feature) {
          case "unlimited_saves":
          case "advanced_exports":
          case "ad_free":
            return true;
          default:
            return true;
        }
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
      }),
    }
  )
);

// Selector hooks
export const useIsPremium = () => useSubscriptionStore((state) => state.isPremium);
export const useSubscriptionStatus = () => useSubscriptionStore((state) => state.status);
export const useCanUseExportFormat = (format: ExportFormat) =>
  useSubscriptionStore((state) => state.canUseExportFormat(format));
export const useSavedPalettesLimit = () =>
  useSubscriptionStore((state) => state.getSavedPalettesLimit());
