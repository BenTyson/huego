# HueGo - Product Overview

> **Tagline**: "Ready, set, HueGo"
> **Live**: https://huego-production.up.railway.app

---

## What

Color palette generator with 5 distinct UI modes, image extraction, gradient generation, and professional export tools.

## Why

Competitors are functional but boring. We differentiate on:
- Mode-switching architecture (work how you prefer)
- Image color extraction (drop a photo, get a palette)
- Mesh gradients (trending design feature)
- Smart suggestions (discover new colors while editing)

## Revenue

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 2 modes, 3 harmonies, 2 exports, 5 saved palettes, 3 extractions/session |
| **Pro** | $5/mo or $36/yr | All 5 modes, all 6 harmonies, all exports, unlimited saves, unlimited extractions, gradients, full accessibility |

---

## The 5 Modes

| Mode | URL | Purpose | Tier |
|------|-----|---------|------|
| **Immersive** | `/immersive` | Full-screen, spacebar to generate | Free |
| **Playground** | `/play` | Swipe to discover | Free |
| **Context** | `/context` | See palette on real designs | Premium |
| **Mood** | `/mood` | Start with feelings, get colors | Premium |
| **Gradient** | `/gradient` | Transform palettes to gradients | Premium |

---

## Key Features

### Palette Generation
- 6 harmony types (random, analogous, complementary, triadic, split-complementary, monochromatic)
- OKLCH color space for perceptual uniformity
- Lock colors to preserve during regeneration
- Undo/redo with visual history browser

### Import & Extraction
- **Import**: Paste hex codes, CSS variables, Tailwind config, or JSON
- **Extract**: Drop an image, get harmonized 5-color palette (k-means clustering)

### Gradients (Premium)
- Linear, radial, conic gradient types
- Mesh gradients (multi-point blending)
- CSS export for all types

### Smart Suggestions
- Click any color to see variations
- Lighter/darker, saturated/muted, adjacent hues, complementary

### Export
- 7 formats: CSS, SCSS, Tailwind, JSON, Array, SVG, PNG
- Semantic naming (primary, secondary, accent, background, surface)

### Accessibility
- WCAG contrast checker (AA/AAA)
- Color blindness simulation (5 types)
- Confusable pairs detection

---

## Implementation Status

All sprints complete:

| Sprint | Focus | Status |
|--------|-------|--------|
| 1 | Foundation - Color engine, OKLCH, Zustand store | ✅ |
| 2 | All Modes - 4 modes with shared state | ✅ |
| 3 | Export & A11y - 7 formats, WCAG, color blindness sim | ✅ |
| 4 | Monetization - Stripe, premium gating, SEO | ✅ |
| 5 | Deployment - Railway, auto-deploy from main | ✅ |
| 6 | V1 Launch Prep - Memory leak fixes, performance, refactoring | ✅ |
| 7 | Value Enhancement - Import, extraction, gradients, suggestions, shortcuts | ✅ |

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 |
| Styling | Tailwind 4 |
| State | Zustand |
| Animation | Framer Motion |
| Hosting | Railway |
| Payments | Stripe |

No database. localStorage only.

---

## Locked Decisions

- 5-mode architecture
- Next.js + Tailwind + Zustand + Framer Motion
- No database for MVP
- $5/month or $36/year premium
- Port 3377 for dev
- OKLCH for color generation
- Railway for hosting

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Generate new palette |
| `1-5` | Copy color's hex |
| `Shift+1-5` | Toggle lock |
| `C` | Copy all hex codes |
| `R` | Shuffle colors |
| `I` | Invert palette |
| `D` | Desaturate (-20%) |
| `V` | Vibrant (+20%) |
| `H` | History browser |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |

---

## Competitors

| Competitor | Our Advantage |
|------------|---------------|
| Coolors | Multiple modes, image extraction, gradients |
| Adobe Color | Not locked to ecosystem, mesh gradients |
| Khroma | Immediate, simpler, more export options |

---

## Related Docs

- [Session Start](/docs/SESSION-START.md) - Start here for dev
- [Architecture](/docs/ARCHITECTURE.md) - Technical details
- [Changelog](/docs/CHANGELOG.md) - Version history
