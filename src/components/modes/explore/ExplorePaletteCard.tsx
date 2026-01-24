"use client";

import { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCommunityStore } from "@/store/community";
import { usePaletteStore } from "@/store/palette";
import type { PublishedPalette } from "@/lib/community-types";
import type { Color } from "@/lib/types";

interface ExplorePaletteCardProps {
  palette: PublishedPalette;
  index: number;
}

export const ExplorePaletteCard = memo(function ExplorePaletteCard({ palette, index }: ExplorePaletteCardProps) {
  const router = useRouter();
  const { toggleLike, isLiked } = useCommunityStore();
  const { setColors } = usePaletteStore();
  const [isHovered, setIsHovered] = useState(false);

  const liked = isLiked(palette.id);

  const handleLike = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleLike(palette.id);
    },
    [palette.id, toggleLike]
  );

  const handleUsePalette = useCallback(() => {
    // Load colors into palette store and navigate to immersive
    const colors = palette.colors as Color[];
    setColors(colors);
    router.push("/immersive");
  }, [palette.colors, setColors, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleUsePalette}
    >
      {/* Color Strip */}
      <div className="h-24 sm:h-28 rounded-xl overflow-hidden flex shadow-lg">
        {palette.colors.map((color, i) => (
          <div
            key={i}
            className="flex-1 transition-all duration-200"
            style={{
              backgroundColor: (color as Color).hex,
              transform: isHovered ? "scaleY(1.05)" : "scaleY(1)",
            }}
          />
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-3 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {palette.title ? (
            <h3 className="text-white font-medium text-sm truncate">{palette.title}</h3>
          ) : (
            <h3 className="text-white/60 text-sm">Untitled</h3>
          )}
          <div className="flex items-center gap-2 mt-1 text-xs text-white/40">
            {palette.author_display_name && (
              <>
                <span className="truncate max-w-[100px]">{palette.author_display_name}</span>
                <span>·</span>
              </>
            )}
            <span>{formatDate(palette.created_at)}</span>
            <span>·</span>
            <span>{palette.color_count} colors</span>
          </div>
        </div>

        {/* Like Button */}
        <motion.button
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
            liked
              ? "bg-red-500/20 text-red-400"
              : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
          }`}
          onClick={handleLike}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          <span>{palette.like_count}</span>
        </motion.button>
      </div>

      {/* Hover Overlay */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="text-center">
          {/* Hex codes */}
          <div className="flex flex-wrap justify-center gap-1 mb-3 max-w-[200px]">
            {palette.colors.slice(0, 5).map((color, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded bg-black/40 text-white/90 text-xs font-mono"
              >
                {(color as Color).hex}
              </span>
            ))}
            {palette.colors.length > 5 && (
              <span className="px-2 py-0.5 rounded bg-black/40 text-white/60 text-xs">
                +{palette.colors.length - 5}
              </span>
            )}
          </div>
          <motion.button
            className="px-4 py-2 rounded-full bg-white text-zinc-900 text-sm font-medium pointer-events-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Use Palette
          </motion.button>
        </div>
      </motion.div>

      {/* Tags */}
      {palette.mood_tags && palette.mood_tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {palette.mood_tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-white/10 text-white/50 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
});
