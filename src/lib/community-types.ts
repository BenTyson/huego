// Community feature types for published palettes and explorer

import type { Color } from "./types";

export interface PublishedPalette {
  id: string;
  colors: Color[];
  hex_codes: string[];
  color_count: number;
  title: string | null;
  harmony_type: string | null;
  mood_tags: string[] | null;
  author_fingerprint: string;
  author_display_name: string | null;
  like_count: number;
  view_count: number;
  created_at: string;
  share_code: string;
  is_public: boolean;
}

export interface PublishPaletteRequest {
  colors: Color[];
  title?: string;
  harmony_type?: string;
  mood_tags?: string[];
  author_display_name?: string;
}

export interface PublishPaletteResponse {
  success: boolean;
  palette?: PublishedPalette;
  error?: string;
  share_code?: string;
}

export interface PaletteListResponse {
  palettes: PublishedPalette[];
  hasMore: boolean;
  cursor: string | null;
  total?: number;
}

export interface LikeResponse {
  success: boolean;
  liked: boolean;
  like_count: number;
  error?: string;
}

export type SortOption = "newest" | "popular" | "most_liked";

export interface ExploreFilters {
  sort: SortOption;
  search: string;
  tags: string[];
  colorCount?: number;
}

// Predefined mood tags for filtering and publishing
export const MOOD_TAGS = [
  "vibrant",
  "calm",
  "professional",
  "playful",
  "elegant",
  "bold",
  "soft",
  "natural",
  "modern",
  "retro",
  "warm",
  "cool",
  "minimalist",
  "dramatic",
] as const;

export type MoodTag = (typeof MOOD_TAGS)[number];
