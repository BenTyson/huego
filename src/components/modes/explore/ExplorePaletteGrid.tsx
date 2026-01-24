"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useCommunityStore, usePalettes, useIsLoading, useHasMore, useExploreError } from "@/store/community";
import { ExplorePaletteCard } from "./ExplorePaletteCard";

export function ExplorePaletteGrid() {
  const palettes = usePalettes();
  const isLoading = useIsLoading();
  const hasMore = useHasMore();
  const error = useExploreError();
  const { loadMore } = useCommunityStore();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  const handleRetry = useCallback(() => {
    useCommunityStore.getState().fetchPalettes(true);
  }, []);

  // Error state
  if (error && palettes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-white/40 text-lg mb-4">Failed to load palettes</div>
        <motion.button
          className="px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          onClick={handleRetry}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  // Empty state
  if (!isLoading && palettes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 mb-6 rounded-full bg-white/5 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white/30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        <div className="text-white/60 text-lg mb-2">No palettes found</div>
        <div className="text-white/40 text-sm">Try adjusting your filters or be the first to publish!</div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-24">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {palettes.map((palette, index) => (
          <ExplorePaletteCard key={palette.id} palette={palette} index={index} />
        ))}
      </div>

      {/* Loading indicator / Load more trigger */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isLoading && (
          <motion.div
            className="flex items-center gap-3 text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span>Loading palettes...</span>
          </motion.div>
        )}
        {!isLoading && hasMore && (
          <motion.button
            className="px-6 py-2 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors text-sm"
            onClick={() => loadMore()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Load More
          </motion.button>
        )}
        {!hasMore && palettes.length > 0 && (
          <div className="text-white/30 text-sm">You&apos;ve seen all palettes</div>
        )}
      </div>
    </div>
  );
}
