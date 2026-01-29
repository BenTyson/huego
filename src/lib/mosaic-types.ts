// Types for The Mosaic — 4,096 color grid where users claim colors

import type { RGB, OKLCH } from "./types";

// ============================================
// Grid types
// ============================================

export interface MosaicColorEntry {
  hex3: string; // "f0a" (lowercase shorthand, no #)
  hex6: string; // "#FF00AA"
  rgb: RGB;
  oklch: OKLCH;
  gridRow: number; // 0-63
  gridCol: number; // 0-63
}

// ============================================
// Claim types
// ============================================

export interface ColorClaim {
  id: string;
  hex3: string;
  hex6: string;
  owner_display_name: string | null;
  custom_color_name: string | null;
  blurb: string | null;
  claimed_at: string | null;
  personalized_at: string | null;
  payment_status: "pending" | "completed" | "refunded";
}

export interface MosaicStats {
  totalColors: number; // always 4096
  claimedCount: number;
  reservedCount: number;
  recentClaims: ColorClaim[];
}

// ============================================
// API request/response types
// ============================================

export interface ColorsResponse {
  claims: ColorClaim[];
  stats: MosaicStats;
}

export interface ClaimRequest {
  hex3: string;
  fingerprint: string;
}

export interface ClaimResponse {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}

export interface PersonalizeRequest {
  hex3: string;
  custom_color_name: string;
  owner_display_name: string;
  blurb?: string;
  stripe_checkout_session_id: string;
}

export interface PersonalizeResponse {
  success: boolean;
  claim?: ColorClaim;
  error?: string;
}

// ============================================
// Constants
// ============================================

export const MOSAIC_GRID_SIZE = 64;
export const MOSAIC_TOTAL_COLORS = 4096;
export const MOSAIC_CELL_SIZE = 15; // px
export const MOSAIC_CLAIM_PRICE = 1000; // $10.00 in cents
export const MOSAIC_RESERVATION_MINUTES = 15;

// ============================================
// Chroma slider types
// ============================================

export const MOSAIC_CHROMA_SLICES = 16;
export const MOSAIC_SLICE_GRID_SIZE = 16; // 16×16 = 256 colors per slice

export interface ChromaSlice {
  sliceIndex: number;
  chromaMin: number;
  chromaMax: number;
  gridCols: number;
  gridRows: number;
  colors: MosaicColorEntry[];
}
