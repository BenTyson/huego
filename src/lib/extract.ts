// Image color extraction using k-means clustering
// Extracts dominant colors from images and harmonizes them

import { createColor, hexToOklch, oklchToHex, rgbToHex, forceInGamut } from "./colors";
import type { Color, RGB, OKLCH } from "./types";

export interface ExtractionOptions {
  numColors?: number;
  quality?: number; // 1 = every pixel, 10 = every 10th pixel
  maxIterations?: number;
}

interface RGBPoint extends RGB {
  count: number;
}

/**
 * Extract dominant colors from an image using k-means clustering
 */
export async function extractColorsFromImage(
  imageSource: HTMLImageElement | File | string,
  options: ExtractionOptions = {}
): Promise<Color[]> {
  const { numColors = 5, quality = 5, maxIterations = 20 } = options;

  // Get image element
  const img = await loadImage(imageSource);

  // Create canvas and draw image
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // Scale down for performance
  const maxDimension = 200;
  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
  canvas.width = Math.floor(img.width * scale);
  canvas.height = Math.floor(img.height * scale);

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Get pixel data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // Sample pixels
  const samples: RGB[] = [];
  for (let i = 0; i < pixels.length; i += 4 * quality) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    // Skip near-white and near-black (often not interesting)
    const brightness = (r + g + b) / 3;
    if (brightness > 250 || brightness < 5) continue;

    samples.push({ r, g, b });
  }

  if (samples.length < numColors) {
    throw new Error("Not enough distinct colors in image");
  }

  // Run k-means clustering
  const clusters = kMeans(samples, numColors, maxIterations);

  // Convert to Color objects and sort by vibrancy
  const colors = clusters
    .map((rgb) => createColor(rgbToHex(rgb)))
    .sort((a, b) => {
      // Sort by chroma (vibrancy) descending
      return b.oklch.c - a.oklch.c;
    });

  return colors;
}

/**
 * Load image from various sources
 */
async function loadImage(
  source: HTMLImageElement | File | string
): Promise<HTMLImageElement> {
  if (source instanceof HTMLImageElement) {
    return source;
  }

  const img = new Image();
  img.crossOrigin = "anonymous";

  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));

    if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(source);
    } else {
      img.src = source;
    }
  });
}

/**
 * K-means clustering algorithm
 */
function kMeans(points: RGB[], k: number, maxIterations: number): RGB[] {
  // Initialize centroids using k-means++ algorithm
  const centroids = initializeCentroids(points, k);

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Assign points to nearest centroid
    const clusters: RGB[][] = Array(k)
      .fill(null)
      .map(() => []);

    for (const point of points) {
      let minDist = Infinity;
      let nearest = 0;

      for (let i = 0; i < centroids.length; i++) {
        const dist = colorDistance(point, centroids[i]);
        if (dist < minDist) {
          minDist = dist;
          nearest = i;
        }
      }

      clusters[nearest].push(point);
    }

    // Update centroids
    let changed = false;
    for (let i = 0; i < k; i++) {
      if (clusters[i].length === 0) continue;

      const newCentroid = {
        r: Math.round(
          clusters[i].reduce((sum, p) => sum + p.r, 0) / clusters[i].length
        ),
        g: Math.round(
          clusters[i].reduce((sum, p) => sum + p.g, 0) / clusters[i].length
        ),
        b: Math.round(
          clusters[i].reduce((sum, p) => sum + p.b, 0) / clusters[i].length
        ),
      };

      if (
        newCentroid.r !== centroids[i].r ||
        newCentroid.g !== centroids[i].g ||
        newCentroid.b !== centroids[i].b
      ) {
        centroids[i] = newCentroid;
        changed = true;
      }
    }

    // Converged
    if (!changed) break;
  }

  return centroids;
}

/**
 * Initialize centroids using k-means++ algorithm
 */
function initializeCentroids(points: RGB[], k: number): RGB[] {
  const centroids: RGB[] = [];

  // Choose first centroid randomly
  centroids.push(points[Math.floor(Math.random() * points.length)]);

  // Choose remaining centroids with probability proportional to distance
  for (let i = 1; i < k; i++) {
    const distances = points.map((point) => {
      let minDist = Infinity;
      for (const centroid of centroids) {
        const dist = colorDistance(point, centroid);
        minDist = Math.min(minDist, dist);
      }
      return minDist * minDist; // Square for probability
    });

    const total = distances.reduce((sum, d) => sum + d, 0);
    let random = Math.random() * total;

    for (let j = 0; j < points.length; j++) {
      random -= distances[j];
      if (random <= 0) {
        centroids.push(points[j]);
        break;
      }
    }
  }

  return centroids;
}

/**
 * Calculate color distance in RGB space
 */
function colorDistance(c1: RGB, c2: RGB): number {
  // Using weighted Euclidean distance (human perception)
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;

  // Weights based on human perception
  return Math.sqrt(2 * dr * dr + 4 * dg * dg + 3 * db * db);
}

/**
 * Harmonize extracted colors for better palette cohesion
 * Adjusts lightness distribution while preserving hues
 */
export function harmonizeExtractedColors(colors: Color[]): Color[] {
  if (colors.length === 0) return [];

  // Convert to OKLCH for perceptual adjustments
  const oklchColors = colors.map((c) => ({ ...c.oklch }));

  // Target lightness distribution for a usable palette
  const targetLightness = [0.45, 0.55, 0.65, 0.92, 0.88]; // Primary, Secondary, Accent, Background, Surface

  // Adjust each color's lightness toward target while keeping relative order
  const harmonized = oklchColors.map((oklch, i) => {
    const targetL = targetLightness[i % targetLightness.length];

    // Blend toward target (70% original, 30% target)
    const newL = oklch.l * 0.7 + targetL * 0.3;

    // Ensure background/surface colors are light
    let adjustedL = newL;
    if (i >= 3) {
      adjustedL = Math.max(0.85, newL);
    }

    return forceInGamut({
      l: adjustedL,
      c: oklch.c,
      h: oklch.h,
    });
  });

  // Convert back to Color objects
  return harmonized.map((oklch) => createColor(oklchToHex(oklch)));
}

/**
 * Storage key for extraction count
 */
const EXTRACTION_COUNT_KEY = "huego-extraction-count";
const EXTRACTION_SESSION_KEY = "huego-extraction-session";

/**
 * Get current session extraction count
 */
export function getExtractionCount(): number {
  if (typeof window === "undefined") return 0;

  const sessionId = sessionStorage.getItem(EXTRACTION_SESSION_KEY);
  const currentSession = Date.now().toString();

  // Reset count for new session
  if (!sessionId) {
    sessionStorage.setItem(EXTRACTION_SESSION_KEY, currentSession);
    localStorage.setItem(EXTRACTION_COUNT_KEY, "0");
    return 0;
  }

  return parseInt(localStorage.getItem(EXTRACTION_COUNT_KEY) || "0", 10);
}

/**
 * Increment extraction count
 */
export function incrementExtractionCount(): number {
  if (typeof window === "undefined") return 0;

  const count = getExtractionCount() + 1;
  localStorage.setItem(EXTRACTION_COUNT_KEY, count.toString());
  return count;
}

/**
 * Check if user can extract (free: 3 per session, premium: unlimited)
 */
export function canExtract(isPremium: boolean): boolean {
  if (isPremium) return true;
  return getExtractionCount() < 3;
}

/**
 * Get remaining free extractions
 */
export function getRemainingExtractions(isPremium: boolean): number {
  if (isPremium) return Infinity;
  return Math.max(0, 3 - getExtractionCount());
}
