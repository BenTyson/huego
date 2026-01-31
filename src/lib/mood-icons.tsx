// Mood icons for HueGo
// All icons: 20x20 viewBox, stroke-based, currentColor

import React from "react";

export const moodIcons: Record<string, React.ReactNode> = {
  // ============================================
  // EMOTIONS & FEELINGS
  // ============================================
  calm: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M9 9h.01M15 9h.01" />
    </svg>
  ),
  bold: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  playful: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <circle cx="9" cy="9" r="1" fill="currentColor" />
      <circle cx="15" cy="9" r="1" fill="currentColor" />
    </svg>
  ),
  energetic: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  serene: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 12h18" />
      <path d="M3 8c3-3 6-3 9 0s6 3 9 0" />
      <path d="M3 16c3-3 6-3 9 0s6 3 9 0" />
    </svg>
  ),
  mysterious: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  romantic: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  melancholy: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22c-4.97 0-9-2.582-9-6v-.088C5.517 12.397 8.517 10 12 10s6.483 2.397 9 5.912V16c0 3.418-4.03 6-9 6z" />
      <path d="M12 2v8" />
      <path d="M8 4l4 4 4-4" />
    </svg>
  ),
  joyful: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 3 4 3 4-3 4-3" />
      <path d="M9 9h.01M15 9h.01" />
      <path d="M7 9c.5-1 1.5-2 2-2M17 9c-.5-1-1.5-2-2-2" />
    </svg>
  ),
  hopeful: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M12 12v10" />
    </svg>
  ),
  nostalgic: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="6" y="6" width="12" height="12" rx="1" />
      <path d="M3 21l6-6M15 9l6-6" />
    </svg>
  ),
  defiant: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 20l8-16 8 16" />
      <path d="M12 4v4" />
      <path d="M9 6l3-4 3 4" />
      <path d="M7 16h10" />
    </svg>
  ),
  dreamy: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 8h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      <circle cx="8" cy="11" r="1" fill="currentColor" />
      <circle cx="13" cy="14" r="0.5" fill="currentColor" />
    </svg>
  ),

  // ============================================
  // SEASONS & TIME
  // ============================================
  spring: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22V10" />
      <path d="M12 10c-2-4 2-8 0-8s-2 4 0 8" />
      <path d="M12 10c2-4-2-8 0-8s2 4 0 8" />
      <path d="M8 18c0-2.2 1.8-4 4-4s4 1.8 4 4" />
    </svg>
  ),
  summer: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  autumn: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 19c-4.4 0-8-3.6-8-8 0-3.3 2-6.2 5-7.4.6 3.4 3 6.4 6 7.4-1 3.5-4.5 6-8 6" />
      <path d="M13 5c4.4 0 8 3.6 8 8 0 3.3-2 6.2-5 7.4" />
      <path d="M12 22v-6" />
    </svg>
  ),
  winter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v20M2 12h20" />
      <path d="M20 16l-4-4 4-4M4 8l4 4-4 4M8 4l4 4 4-4M16 20l-4-4-4 4" />
    </svg>
  ),
  sunrise: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 18a5 5 0 1 0-10 0" />
      <path d="M12 2v4M4.22 10.22l1.42 1.42M1 18h2M21 18h2M18.36 11.64l1.42-1.42" />
      <path d="M12 9l-3 3h6l-3-3z" />
    </svg>
  ),
  sunset: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 18a5 5 0 1 0-10 0" />
      <path d="M12 9v4M4.22 10.22l1.42 1.42M1 18h2M21 18h2M18.36 11.64l1.42-1.42" />
      <path d="M12 2l3 3h-6l3-3z" />
    </svg>
  ),
  "golden-hour": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="4" />
      <path d="M3 12h2M19 12h2" />
      <path d="M12 3v2M12 19v2" />
      <path d="M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M5.64 18.36l1.41-1.41M16.95 7.05l1.41-1.41" />
    </svg>
  ),
  midnight: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      <circle cx="8" cy="11" r="1" fill="currentColor" />
      <circle cx="14" cy="8" r="0.5" fill="currentColor" />
      <circle cx="16" cy="14" r="0.5" fill="currentColor" />
    </svg>
  ),
  twilight: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 18a5 5 0 1 0-10 0" />
      <path d="M12 2v4" />
      <path d="M20 10l-2 2" />
      <path d="M4 10l2 2" />
      <path d="M1 18h22" />
    </svg>
  ),
  overcast: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  ),
  monsoon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 8h-1.26A8 8 0 1 0 9 18h9a5 5 0 0 0 0-10z" />
      <path d="M8 20v2M12 19v3M16 20v2" />
    </svg>
  ),
  solstice: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="6" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      <path d="M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" />
    </svg>
  ),

  // ============================================
  // NATURE & ELEMENTS
  // ============================================
  natural: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22V8" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
      <path d="M12 8a4 4 0 0 0-4-4 4 4 0 0 0 4 4z" />
      <path d="M12 8a4 4 0 0 1 4-4 4 4 0 0 1-4 4z" />
    </svg>
  ),
  ocean: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  ),
  forest: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l-6 9h4l-4 6h12l-4-6h4l-6-9z" />
      <path d="M12 18v4" />
    </svg>
  ),
  desert: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="5" r="3" />
      <path d="M2 22c2-8 8-10 12-10s10 2 8 10" />
      <path d="M8 22v-5M12 22v-8M16 22v-4" />
    </svg>
  ),
  tropical: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22v-8" />
      <path d="M12 14c-4 0-8-3-8-7 3 0 5.5 1 8 4 2.5-3 5-4 8-4 0 4-4 7-8 7z" />
      <path d="M12 7c0-3 2-5 4-5-1 2-1 4 0 6" />
      <path d="M12 7c0-3-2-5-4-5 1 2 1 4 0 6" />
    </svg>
  ),
  arctic: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 18l3-3 4 4 5-5 4 4 4-4" />
      <path d="M12 2v6M9 5l3 3 3-3" />
      <circle cx="6" cy="10" r="1" fill="currentColor" />
      <circle cx="18" cy="8" r="1" fill="currentColor" />
    </svg>
  ),
  mountain: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 3l4 8 4-8" />
      <path d="M2 21l7-10 4 5 4-5 5 10H2z" />
    </svg>
  ),
  meadow: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 22h20" />
      <path d="M6 22v-6c0-1.1.9-2 2-2s2 .9 2 2v6" />
      <path d="M14 22v-8c0-1.1.9-2 2-2s2 .9 2 2v8" />
      <circle cx="7" cy="10" r="2" />
      <circle cx="17" cy="8" r="2" />
    </svg>
  ),
  volcanic: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 22l4-12h8l4 12H4z" />
      <path d="M9 10l3-6 3 6" />
      <path d="M12 4v-2" />
      <path d="M10 3l2-1 2 1" />
    </svg>
  ),
  coastal: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 22c2-4 5-6 10-6s8 2 10 6" />
      <path d="M3 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2c1.3 0 1.9-.5 2.5-1" />
      <circle cx="17" cy="6" r="3" />
    </svg>
  ),
  "coral-reef": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22v-6" />
      <path d="M8 22v-4" />
      <path d="M16 22v-4" />
      <path d="M12 16c-3 0-5-3-5-6s2-6 5-6 5 3 5 6-2 6-5 6z" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
      <circle cx="14" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
  aurora: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 20c3-6 6-8 9-16" />
      <path d="M8 20c2-5 4-8 7-14" />
      <path d="M14 20c1-4 3-7 5-12" />
      <path d="M19 20c.5-3 1.5-5 3-8" />
    </svg>
  ),

  // ============================================
  // AESTHETICS & ERAS
  // ============================================
  retro: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  ),
  futuristic: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  minimal: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  "art-deco": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l8 4v12l-8 4-8-4V6l8-4z" />
      <path d="M12 6l4 2v6l-4 2-4-2V8l4-2z" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  cyberpunk: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  cottagecore: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18" />
      <path d="M5 21V7l7-5 7 5v14" />
      <path d="M9 21v-6h6v6" />
      <path d="M10 10h4" />
    </svg>
  ),
  y2k: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2c3 3 5 6 5 10s-2 7-5 10" />
      <path d="M12 2c-3 3-5 6-5 10s2 7 5 10" />
      <path d="M2 12h20" />
    </svg>
  ),
  scandinavian: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M12 3v18" />
      <path d="M3 12h18" />
    </svg>
  ),
  "mid-century": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <path d="M2 12v0c0 5.5 4.5 10 10 10s10-4.5 10-10v0" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  bohemian: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  ),
  industrial: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 20h20" />
      <path d="M4 20V8l4 4V8l4 4v8" />
      <path d="M16 20V4h4v16" />
      <circle cx="18" cy="8" r="1" fill="currentColor" />
    </svg>
  ),
  vaporwave: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 16l4-4 4 4 4-4 4 4 4-4" />
      <path d="M2 20l4-4 4 4 4-4 4 4 4-4" />
      <circle cx="12" cy="6" r="4" />
    </svg>
  ),
  brutalist: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" />
      <path d="M2 10h20" />
      <path d="M8 4v16" />
      <path d="M16 4v16" />
    </svg>
  ),
  "art-nouveau": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2c-4 4-4 8 0 12s4 8 0 12" />
      <path d="M12 2c4 4 4 8 0 12s-4 8 0 12" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  "dark-academia": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z" />
      <path d="M8 7h8M8 11h6" />
    </svg>
  ),

  // ============================================
  // INDUSTRY & BRAND
  // ============================================
  professional: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="12.01" />
    </svg>
  ),
  healthcare: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2h8v6h6v8h-6v6H8v-6H2v-8h6V2z" />
    </svg>
  ),
  "tech-startup": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M6 8l4 4-4 4" />
      <path d="M12 16h6" />
    </svg>
  ),
  fashion: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2l-4 6h6l-2 14h12l-2-14h6L18 2" />
      <path d="M12 2a3 3 0 0 0-3 3h6a3 3 0 0 0-3-3z" />
    </svg>
  ),
  "food-beverage": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <path d="M6 1v3M10 1v3M14 1v3" />
    </svg>
  ),
  finance: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  "creative-agency": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="13.5" cy="6.5" r="2.5" />
      <circle cx="19" cy="17" r="2" />
      <circle cx="5" cy="17" r="3" />
      <path d="M13.5 9v3l5.5 3M13.5 12l-5.5 3" />
    </svg>
  ),
  wellness: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
  education: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 10l-10-5-10 5 10 5 10-5z" />
      <path d="M6 12v5c0 2 2.7 3 6 3s6-1 6-3v-5" />
      <path d="M22 10v6" />
    </svg>
  ),
  "luxury-brand": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
    </svg>
  ),
  gaming: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 11h4M8 9v4" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      <circle cx="18" cy="12" r="1" fill="currentColor" />
      <path d="M2 14.5A4.5 4.5 0 0 0 6.5 19h11a4.5 4.5 0 0 0 0-9h-11A4.5 4.5 0 0 0 2 14.5z" />
    </svg>
  ),
  architecture: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 22h20" />
      <path d="M6 22V6l6-4 6 4v16" />
      <path d="M10 22v-4h4v4" />
      <path d="M10 10h4M10 14h4" />
    </svg>
  ),

  // ============================================
  // CULTURAL & REGIONAL
  // ============================================
  japanese: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M12 12v10" />
      <path d="M8 15c0 2 1.8 3.5 4 3.5s4-1.5 4-3.5" />
      <path d="M9 5c.5-1 1.5-2 3-2s2.5 1 3 2" />
    </svg>
  ),
  mediterranean: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 22h16" />
      <path d="M4 22V10l4-4h8l4 4v12" />
      <path d="M4 10h16" />
      <path d="M9 22v-6h6v6" />
      <path d="M12 6v4" />
    </svg>
  ),
  nordic: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 15l9-12 9 12" />
      <path d="M7.5 15l4.5-6 4.5 6" />
      <path d="M3 15h18" />
      <path d="M5 22h14" />
      <path d="M8 15v7M16 15v7" />
    </svg>
  ),
  moroccan: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l3 6-3 4-3-4 3-6z" />
      <path d="M12 12l3 6-3 4-3-4 3-6z" />
      <path d="M6 8l3 4-3 4-3-4 3-4z" />
      <path d="M18 8l3 4-3 4-3-4 3-4z" />
    </svg>
  ),
  parisian: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 22h18" />
      <path d="M6 22V6l6-4 6 4v16" />
      <path d="M6 10h12" />
      <path d="M6 14h12" />
      <path d="M10 22v-4h4v4" />
      <circle cx="12" cy="6" r="1" fill="currentColor" />
    </svg>
  ),
  "tropical-paradise": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22V12" />
      <path d="M12 12c-6 0-9-4-8-8 2 0 5 0 8 4 3-4 6-4 8-4 1 4-2 8-8 8z" />
      <path d="M5 22h14" />
      <path d="M7 22l2-4M17 22l-2-4" />
    </svg>
  ),
  southwestern: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22V2" />
      <path d="M12 6h6v4h-6" />
      <path d="M12 14h-6v4h6" />
      <circle cx="18" cy="4" r="2" />
    </svg>
  ),
  "coastal-new-england": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 22h18" />
      <path d="M5 22V12h6v10" />
      <path d="M5 12l3-4 3 4" />
      <path d="M13 22V8h6v14" />
      <path d="M13 8l3-4 3 4" />
      <path d="M7 16h2M16 12h2" />
    </svg>
  ),
  brazilian: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2c-3 3-3 6 0 10s3 7 0 10" />
      <path d="M12 2c3 3 3 6 0 10s-3 7 0 10" />
      <path d="M5 8h14M5 16h14" />
    </svg>
  ),
  indian: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  ),
  korean: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 8c2 2 4 6 4 8" />
      <path d="M16 8c-2 2-4 6-4 8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  african: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l-8 8v12h16V10l-8-8z" />
      <path d="M4 10h16" />
      <path d="M4 16h16" />
      <path d="M12 10v12" />
    </svg>
  ),

  // ============================================
  // ABSTRACT & CONCEPTUAL
  // ============================================
  urban: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
    </svg>
  ),
  luxurious: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
    </svg>
  ),
  warm: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  cool: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v20M17 7l-5 5-5-5M7 17l5-5 5 5" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  ethereal: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 4v-2M12 22v-2M4 12H2M22 12h-2" />
    </svg>
  ),
  chaotic: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12l4-4 3 6 4-8 3 6 4-4" />
      <path d="M3 18l5-3 3 4 4-6 3 4 3-3" />
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="5" r="1.5" />
    </svg>
  ),
  monochrome: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 3l18 18" />
      <path d="M3 12h18" />
    </svg>
  ),
  vintage: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="13" r="8" />
      <circle cx="12" cy="13" r="3" />
      <path d="M5 3h14" />
      <path d="M12 5V3" />
    </svg>
  ),
};

// Mood color previews (representative colors for each mood)
export const moodColors: Record<string, string[]> = {
  // Emotions
  calm: ["#A8D5E5", "#B8E0D2", "#D6EAF8"],
  bold: ["#E74C3C", "#F39C12", "#9B59B6"],
  playful: ["#FF6B9D", "#FFD93D", "#6BCB77"],
  energetic: ["#FF5733", "#FFC300", "#FF8D1A"],
  serene: ["#B8D4E3", "#C5DDE8", "#D9E8EF"],
  mysterious: ["#4A3660", "#6B4D82", "#8E6BA8"],
  romantic: ["#E8909C", "#F2B5BC", "#FADCE1"],
  melancholy: ["#5D7B93", "#7A95AB", "#98B0C2"],
  joyful: ["#FFE066", "#FFD633", "#FFCC00"],
  hopeful: ["#7DCEA0", "#A9DFBF", "#D4EFDF"],
  nostalgic: ["#C4A882", "#D4BFA0", "#E8D8C0"],
  defiant: ["#8B1A2B", "#A62D3E", "#C94055"],
  dreamy: ["#D4B8E8", "#E0C8F0", "#ECD8F8"],

  // Seasons
  spring: ["#98D8AA", "#B5E5C4", "#D2F0DC"],
  summer: ["#FFB347", "#FFCC66", "#FFE5A0"],
  autumn: ["#D2691E", "#CD853F", "#DEB887"],
  winter: ["#B0C4DE", "#C6D9EC", "#E0EBF5"],
  sunrise: ["#FFAA5C", "#FFD4A8", "#FFF0DB"],
  sunset: ["#E25822", "#F08C4A", "#FDB777"],
  "golden-hour": ["#DAA520", "#E6BE4C", "#F2D87A"],
  midnight: ["#1A1A40", "#2D2D5A", "#404075"],
  twilight: ["#614385", "#7B5B9A", "#9673AF"],
  overcast: ["#A0A0A0", "#B8B8B8", "#D0D0D0"],
  monsoon: ["#4A7A8C", "#5E8E9E", "#7AABB8"],
  solstice: ["#E8C060", "#F0D080", "#F8E0A0"],

  // Nature
  natural: ["#6B8E23", "#8FBC8F", "#9ACD32"],
  ocean: ["#1E90FF", "#4169E1", "#6495ED"],
  forest: ["#228B22", "#2E8B57", "#3CB371"],
  desert: ["#D2B48C", "#DEB887", "#F5DEB3"],
  tropical: ["#00CED1", "#20B2AA", "#48D1CC"],
  arctic: ["#E0FFFF", "#F0FFFF", "#F5FFFA"],
  mountain: ["#708090", "#778899", "#B0C4DE"],
  meadow: ["#7CFC00", "#90EE90", "#98FB98"],
  volcanic: ["#8B0000", "#B22222", "#CD5C5C"],
  coastal: ["#5F9EA0", "#7FB3B3", "#AFEEEE"],
  "coral-reef": ["#FF7F50", "#40E0D0", "#FF6B81"],
  aurora: ["#2ECC71", "#8E44AD", "#3498DB"],

  // Aesthetics
  retro: ["#D4A574", "#C19A6B", "#E6BE8A"],
  futuristic: ["#8E44AD", "#3498DB", "#1ABC9C"],
  minimal: ["#F8F9FA", "#E9ECEF", "#DEE2E6"],
  "art-deco": ["#D4AF37", "#1A3A3A", "#B8860B"],
  cyberpunk: ["#FF00FF", "#00FFFF", "#FF1493"],
  cottagecore: ["#D4C4A8", "#E8DCC8", "#F5EDE0"],
  y2k: ["#FF69B4", "#00CED1", "#FFD700"],
  scandinavian: ["#F5F5F5", "#E8E8E8", "#DCDCDC"],
  "mid-century": ["#D2691E", "#008080", "#DAA520"],
  bohemian: ["#8B4513", "#CD853F", "#D2691E"],
  industrial: ["#4A4A4A", "#696969", "#808080"],
  vaporwave: ["#FF71CE", "#01CDFE", "#B967FF"],
  brutalist: ["#808080", "#999999", "#B3B3B3"],
  "art-nouveau": ["#8B9E6B", "#B8C99A", "#D4DEAD"],
  "dark-academia": ["#3D2B1F", "#5C4033", "#7B5B4A"],

  // Industry
  professional: ["#2C3E50", "#5D6D7E", "#85929E"],
  healthcare: ["#48C9B0", "#76D7C4", "#A3E4D7"],
  "tech-startup": ["#3498DB", "#5DADE2", "#85C1E9"],
  fashion: ["#E91E63", "#F48FB1", "#F8BBD9"],
  "food-beverage": ["#E67E22", "#F39C12", "#F5B041"],
  finance: ["#1A237E", "#303F9F", "#5C6BC0"],
  "creative-agency": ["#9C27B0", "#E91E63", "#FF9800"],
  wellness: ["#4CAF50", "#81C784", "#A5D6A7"],
  education: ["#2196F3", "#64B5F6", "#90CAF9"],
  "luxury-brand": ["#FFD700", "#4A0080", "#D4AF37"],
  gaming: ["#9B59B6", "#E91E63", "#00BCD4"],
  architecture: ["#5C7A8A", "#7A9AAA", "#A0BCC8"],

  // Cultural
  japanese: ["#FFB7C5", "#F8E8E8", "#E8D4D4"],
  mediterranean: ["#E07020", "#4682B4", "#F4A460"],
  nordic: ["#87CEEB", "#B0C4DE", "#E0E8F0"],
  moroccan: ["#C04000", "#008080", "#FFD700"],
  parisian: ["#F5E6E8", "#D4B5B5", "#C19A9A"],
  "tropical-paradise": ["#00FA9A", "#FFD700", "#FF6347"],
  southwestern: ["#CD853F", "#40E0D0", "#8B4513"],
  "coastal-new-england": ["#000080", "#FFFFFF", "#DC143C"],
  brazilian: ["#00A859", "#FFDF00", "#FF6F00"],
  indian: ["#FF6F00", "#E91E63", "#FFD700"],
  korean: ["#F8BBD0", "#E1BEE7", "#B3E5FC"],
  african: ["#B8860B", "#CD853F", "#8B4513"],

  // Abstract
  urban: ["#34495E", "#7F8C8D", "#BDC3C7"],
  luxurious: ["#6C3483", "#8E44AD", "#BB8FCE"],
  warm: ["#E67E22", "#D35400", "#F5B041"],
  cool: ["#3498DB", "#5DADE2", "#85C1E9"],
  ethereal: ["#D8BFD8", "#E6D0F0", "#F0E4F8"],
  chaotic: ["#FF4500", "#00CED1", "#FFD700"],
  monochrome: ["#404040", "#808080", "#C0C0C0"],
  vintage: ["#BFA882", "#C4A070", "#D4B896"],
};
