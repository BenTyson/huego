// Zustand store for community features (explorer, likes, published palettes)
// Persisted liked palettes to localStorage

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  PublishedPalette,
  ExploreFilters,
  PaletteListResponse,
  LikeResponse,
} from "@/lib/community-types";
import { getFingerprint } from "@/lib/fingerprint";

interface CommunityState {
  // Explorer state
  palettes: PublishedPalette[];
  isLoading: boolean;
  hasMore: boolean;
  cursor: string | null;
  error: string | null;

  // Filters
  filters: ExploreFilters;

  // User's liked palettes (persisted)
  likedPaletteIds: string[];

  // Publish count tracking (persisted)
  publishCount: number;

  // Actions
  fetchPalettes: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  toggleLike: (paletteId: string) => Promise<void>;
  setFilters: (filters: Partial<ExploreFilters>) => void;
  resetFilters: () => void;
  incrementPublishCount: () => void;
  isLiked: (paletteId: string) => boolean;
}

const defaultFilters: ExploreFilters = {
  sort: "newest",
  search: "",
  tags: [],
};

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      // Initial state
      palettes: [],
      isLoading: false,
      hasMore: true,
      cursor: null,
      error: null,
      filters: defaultFilters,
      likedPaletteIds: [],
      publishCount: 0,

      // Fetch palettes from API
      fetchPalettes: async (reset = false) => {
        const { filters, cursor, isLoading } = get();

        if (isLoading && !reset) return;

        set({ isLoading: true, error: null });

        if (reset) {
          set({ palettes: [], cursor: null, hasMore: true });
        }

        try {
          const params = new URLSearchParams();
          params.set("sort", filters.sort);
          if (filters.search) params.set("search", filters.search);
          if (filters.tags.length > 0) params.set("tags", filters.tags.join(","));
          if (filters.colorCount) params.set("colorCount", String(filters.colorCount));
          if (!reset && cursor) params.set("cursor", cursor);

          const response = await fetch(`/api/community/palettes?${params}`);

          if (!response.ok) {
            throw new Error("Failed to fetch palettes");
          }

          const data: PaletteListResponse = await response.json();

          set((state) => ({
            palettes: reset ? data.palettes : [...state.palettes, ...data.palettes],
            hasMore: data.hasMore,
            cursor: data.cursor,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch palettes",
            isLoading: false,
          });
        }
      },

      // Load more palettes (pagination)
      loadMore: async () => {
        const { hasMore, isLoading } = get();
        if (!hasMore || isLoading) return;
        await get().fetchPalettes(false);
      },

      // Toggle like on a palette (optimistic update)
      toggleLike: async (paletteId: string) => {
        const { likedPaletteIds, palettes } = get();
        const isCurrentlyLiked = likedPaletteIds.includes(paletteId);
        const fingerprint = getFingerprint();

        // Optimistic update
        if (isCurrentlyLiked) {
          set({
            likedPaletteIds: likedPaletteIds.filter((id) => id !== paletteId),
            palettes: palettes.map((p) =>
              p.id === paletteId ? { ...p, like_count: Math.max(0, p.like_count - 1) } : p
            ),
          });
        } else {
          set({
            likedPaletteIds: [...likedPaletteIds, paletteId],
            palettes: palettes.map((p) =>
              p.id === paletteId ? { ...p, like_count: p.like_count + 1 } : p
            ),
          });
        }

        // Sync with server
        try {
          const response = await fetch(`/api/community/palettes/${paletteId}/like`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fingerprint }),
          });

          if (!response.ok) {
            throw new Error("Failed to toggle like");
          }

          const data: LikeResponse = await response.json();

          // Update with server's authoritative count
          set((state) => ({
            palettes: state.palettes.map((p) =>
              p.id === paletteId ? { ...p, like_count: data.like_count } : p
            ),
            likedPaletteIds: data.liked
              ? [...new Set([...state.likedPaletteIds, paletteId])]
              : state.likedPaletteIds.filter((id) => id !== paletteId),
          }));
        } catch {
          // Revert optimistic update on error
          set({
            likedPaletteIds: isCurrentlyLiked
              ? [...likedPaletteIds, paletteId]
              : likedPaletteIds.filter((id) => id !== paletteId),
            palettes: palettes.map((p) =>
              p.id === paletteId
                ? { ...p, like_count: isCurrentlyLiked ? p.like_count + 1 : Math.max(0, p.like_count - 1) }
                : p
            ),
          });
        }
      },

      // Update filters and refetch
      setFilters: (newFilters: Partial<ExploreFilters>) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
        // Trigger refetch with new filters
        get().fetchPalettes(true);
      },

      // Reset filters to defaults
      resetFilters: () => {
        set({ filters: defaultFilters });
        get().fetchPalettes(true);
      },

      // Increment publish count
      incrementPublishCount: () => {
        set((state) => ({ publishCount: state.publishCount + 1 }));
      },

      // Check if palette is liked
      isLiked: (paletteId: string) => {
        return get().likedPaletteIds.includes(paletteId);
      },
    }),
    {
      name: "huego-community",
      partialize: (state) => ({
        // Only persist user preferences, not fetched data
        likedPaletteIds: state.likedPaletteIds,
        publishCount: state.publishCount,
      }),
    }
  )
);

// Selector hooks for optimized re-renders
export const usePalettes = () => useCommunityStore((state) => state.palettes);
export const useIsLoading = () => useCommunityStore((state) => state.isLoading);
export const useHasMore = () => useCommunityStore((state) => state.hasMore);
export const useFilters = () => useCommunityStore((state) => state.filters);
export const useLikedPaletteIds = () => useCommunityStore((state) => state.likedPaletteIds);
export const usePublishCount = () => useCommunityStore((state) => state.publishCount);
export const useExploreError = () => useCommunityStore((state) => state.error);
