// Adaptive color generation engine for Color Lab (Playground)
// Learns from accepted/rejected colors and biases future candidates

import type { Color, OKLCH } from "./types";
import { oklchToHex, createColor, forceInGamut, clampOklch } from "./colors";
import { randomInRange, randomHue, normalizeHue } from "./random";
import { getColorPsychology } from "./color-psychology";

// ============================================
// Types
// ============================================

export interface AdaptiveEngineStats {
  reviewed: number;
  accepted: number;
  rejected: number;
}

export interface AdaptiveColorEngine {
  generateCandidate: () => Color;
  generateNearNeighbor: (base: Color) => Color;
  recordAccept: (color: Color) => void;
  recordReject: (color: Color) => void;
  reset: () => void;
  getStats: () => AdaptiveEngineStats;
}

// ============================================
// Harmony classification
// ============================================

export type HarmonyLabel = "Analogous" | "Complementary" | "Contrasting" | "Neutral";

/**
 * Classify the harmony relationship between a candidate color and the palette's hue centroid.
 * Uses hue distance: <30° = Analogous, 150-210° = Complementary, 90-150° or 210-270° = Contrasting, else Neutral.
 */
export function classifyHarmony(candidateHue: number, paletteColors: Color[]): HarmonyLabel {
  if (paletteColors.length === 0) return "Neutral";

  const centroid = circularMean(paletteColors.map((c) => c.oklch.h));
  const dist = hueDistance(candidateHue, centroid);

  if (dist < 30) return "Analogous";
  if (dist >= 150 && dist <= 210) return "Complementary";
  if ((dist >= 90 && dist < 150) || (dist > 210 && dist <= 270)) return "Contrasting";
  return "Neutral";
}

/**
 * Get a psychology keyword for a color's hue.
 * Returns the first emotion from color psychology data.
 */
export function getPsychologyKeyword(hue: number): string {
  const psychology = getColorPsychology(hue);
  return psychology.emotions[0] || "Unique";
}

// ============================================
// Math helpers
// ============================================

/** Circular mean of angles in degrees */
function circularMean(angles: number[]): number {
  if (angles.length === 0) return 0;
  let sinSum = 0;
  let cosSum = 0;
  for (const a of angles) {
    const rad = (a * Math.PI) / 180;
    sinSum += Math.sin(rad);
    cosSum += Math.cos(rad);
  }
  let mean = (Math.atan2(sinSum / angles.length, cosSum / angles.length) * 180) / Math.PI;
  if (mean < 0) mean += 360;
  return mean;
}

/** Minimum angular distance between two hues (0-180) */
function hueDistance(h1: number, h2: number): number {
  const d = Math.abs(normalizeHue(h1) - normalizeHue(h2));
  return d > 180 ? 360 - d : d;
}

/** Check if a hue falls within any rejected zone */
function isInRejectedZone(hue: number, zones: [number, number][]): boolean {
  const h = normalizeHue(hue);
  for (const [center, radius] of zones) {
    if (hueDistance(h, center) < radius) return true;
  }
  return false;
}

// ============================================
// Engine factory
// ============================================

const WILDCARD_CHANCE = 0.3;
const NEAR_NEIGHBOR_HUE_SPREAD = 15;
const NEAR_NEIGHBOR_LIGHTNESS_SPREAD = 0.08;
const NEAR_NEIGHBOR_CHROMA_SPREAD = 0.03;
const REJECTION_ZONE_RADIUS = 20; // degrees around rejected hue centers to avoid

export function createAdaptiveEngine(): AdaptiveColorEngine {
  let accepted: OKLCH[] = [];
  let rejected: OKLCH[] = [];
  let reviewed = 0;

  // Computed preferences (recomputed on accept/reject)
  let hueCenter = 0;
  let hueSpread = 180; // start wide
  let lightnessRange: [number, number] = [0.35, 0.75];
  let chromaRange: [number, number] = [0.08, 0.2];
  let rejectedHueZones: [number, number][] = []; // [center, radius]

  function recomputePreferences() {
    if (accepted.length < 2) {
      hueSpread = 180;
      lightnessRange = [0.35, 0.75];
      chromaRange = [0.08, 0.2];
      return;
    }

    // Hue center via circular mean
    hueCenter = circularMean(accepted.map((c) => c.h));

    // Hue spread: average distance from center, with minimum
    const distances = accepted.map((c) => hueDistance(c.h, hueCenter));
    const avgDist = distances.reduce((a, b) => a + b, 0) / distances.length;
    hueSpread = Math.max(30, Math.min(120, avgDist * 1.5));

    // Lightness range from accepted colors
    const lightnesses = accepted.map((c) => c.l);
    const minL = Math.min(...lightnesses);
    const maxL = Math.max(...lightnesses);
    const lPadding = 0.08;
    lightnessRange = [
      Math.max(0.15, minL - lPadding),
      Math.min(0.9, maxL + lPadding),
    ];

    // Chroma range from accepted colors
    const chromas = accepted.map((c) => c.c);
    const minC = Math.min(...chromas);
    const maxC = Math.max(...chromas);
    const cPadding = 0.02;
    chromaRange = [
      Math.max(0.02, minC - cPadding),
      Math.min(0.3, maxC + cPadding),
    ];

    // Rejected hue zones: cluster rejected hues
    recomputeRejectedZones();
  }

  function recomputeRejectedZones() {
    if (rejected.length === 0) {
      rejectedHueZones = [];
      return;
    }

    // Simple approach: each rejected color creates a small avoidance zone
    // Only create zones for hues that have been rejected 2+ times nearby
    const hueMap = new Map<number, number>(); // quantized hue -> count
    for (const c of rejected) {
      const bucket = Math.round(c.h / 10) * 10; // 10-degree buckets
      hueMap.set(bucket, (hueMap.get(bucket) || 0) + 1);
    }

    rejectedHueZones = [];
    for (const [bucket, count] of hueMap) {
      if (count >= 2) {
        rejectedHueZones.push([bucket, REJECTION_ZONE_RADIUS]);
      }
    }
  }

  function generateRandomCandidate(): OKLCH {
    return clampOklch({
      l: randomInRange(0.35, 0.75),
      c: randomInRange(0.08, 0.2),
      h: randomHue(),
    });
  }

  function generateBiasedCandidate(): OKLCH {
    // 30% chance of wildcard (fully random)
    if (Math.random() < WILDCARD_CHANCE) {
      return generateRandomCandidate();
    }

    // Generate hue biased toward center with some spread
    let hue: number;
    let attempts = 0;
    do {
      hue = normalizeHue(hueCenter + randomInRange(-hueSpread, hueSpread));
      attempts++;
    } while (isInRejectedZone(hue, rejectedHueZones) && attempts < 10);

    return clampOklch({
      l: randomInRange(lightnessRange[0], lightnessRange[1]),
      c: randomInRange(chromaRange[0], chromaRange[1]),
      h: hue,
    });
  }

  return {
    generateCandidate(): Color {
      const oklch =
        accepted.length < 2
          ? generateRandomCandidate()
          : generateBiasedCandidate();

      const gamutSafe = forceInGamut(oklch);
      return createColor(oklchToHex(gamutSafe));
    },

    generateNearNeighbor(base: Color): Color {
      const { l, c, h } = base.oklch;
      const oklch = forceInGamut(
        clampOklch({
          l: l + randomInRange(-NEAR_NEIGHBOR_LIGHTNESS_SPREAD, NEAR_NEIGHBOR_LIGHTNESS_SPREAD),
          c: c + randomInRange(-NEAR_NEIGHBOR_CHROMA_SPREAD, NEAR_NEIGHBOR_CHROMA_SPREAD),
          h: normalizeHue(h + randomInRange(-NEAR_NEIGHBOR_HUE_SPREAD, NEAR_NEIGHBOR_HUE_SPREAD)),
        })
      );
      return createColor(oklchToHex(oklch));
    },

    recordAccept(color: Color) {
      accepted.push(color.oklch);
      reviewed++;
      recomputePreferences();
    },

    recordReject(color: Color) {
      rejected.push(color.oklch);
      reviewed++;
      recomputeRejectedZones();
    },

    reset() {
      accepted = [];
      rejected = [];
      reviewed = 0;
      hueCenter = 0;
      hueSpread = 180;
      lightnessRange = [0.35, 0.75];
      chromaRange = [0.08, 0.2];
      rejectedHueZones = [];
    },

    getStats(): AdaptiveEngineStats {
      return {
        reviewed,
        accepted: accepted.length,
        rejected: rejected.length,
      };
    },
  };
}
