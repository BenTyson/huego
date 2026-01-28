# HueGo - Product Overview

> **Tagline**: "Ready, set, HueGo"
> **Live**: https://huego-production.up.railway.app

---

## What

Color palette generator with 6 distinct UI modes, community palette explorer, image extraction, gradient generation, professional export tools, and The Mosaic — a 4,096-color community artwork.

## Why

Competitors are functional but boring. We differentiate on:
- Mode-switching architecture (work how you prefer)
- Image color extraction (drop a photo, get a palette)
- Mesh gradients (trending design feature)
- Smart suggestions (discover new colors while editing)

## Revenue

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 3 modes (Immersive, Play, Explore), 3 harmonies, 2 exports, 5 saved palettes, 3 extractions/session, 3 publishes, AI (3/min, 10/day), unlimited browsing/liking |
| **Pro** | $5/mo or $36/yr | All 6 modes, all 6 harmonies, all exports, unlimited saves, unlimited extractions, unlimited publishes, unlimited AI, gradients, full accessibility |

---

## The 6 Modes

| Mode | URL | Purpose | Tier |
|------|-----|---------|------|
| **Immersive** | `/immersive` | Full-screen, spacebar to generate | Free |
| **Playground** | `/play` | Color Lab: adaptive swipe discovery + refinement editor | Free |
| **Explore** | `/explore` | Browse community palettes | Free |
| **Context** | `/context` | See palette on real designs | Premium |
| **Mood** | `/mood` | Grid of 64 mood cards, full ColorColumn actions | Premium |
| **Gradient** | `/gradient` | Transform palettes to gradients | Premium |

---

## Key Features

### Palette Generation
- **Variable palette size**: 2-10 colors (Coolors parity)
- 6 harmony types (random, analogous, complementary, triadic, split-complementary, monochromatic)
- OKLCH color space for perceptual uniformity
- Lock colors to preserve during regeneration
- Undo/redo with visual history browser
- **Saved colors**: Heart colors to save favorites (10 free, unlimited premium)
- **Shade popover**: View 11-shade Tailwind scale (50-950) for any color
- **Global shade control**: Shift entire palette to any shade level (50-950)
- **Drag reorder**: Drag handle to rearrange colors
- **Remove at index**: X button to remove specific colors (min 2)
- **Layout toggle**: Switch between vertical columns and horizontal strips (persisted)

### Color Lab (Playground)
- **Adaptive Discovery**: Swipe through colors — algorithm learns your taste from accepts/rejects
- **4-Direction Gestures**: Right=Add, Left=Skip, Up=Save favorites, Down=See similar
- **Two-Phase Flow**: Discovery (swipe) → Refinement (full ColorColumn editor with sliders)
- **Harmony Badges**: Each card shows relationship to your palette (Analogous, Complementary, etc.)
- **Psychology Keywords**: Color emotion tags on each card
- **Onboarding Hints**: Auto-dismissing gesture guide for new users

### The Mosaic (`/mosaic`)
- **4,096 Colors**: Every 12-bit shorthand hex (`#RGB`) in a 64×64 grid
- **Claim for $10**: Own a color forever, give it a custom name
- **Write a Blurb**: 280-character description of why you chose it
- **Visual Hierarchy**: Unclaimed at 35% opacity, claimed glow at full vibrancy
- **Reservation System**: 15-minute hold during checkout prevents double-claims
- **Living Artwork**: Grid progressively "comes alive" as community claims colors

### Color Psychology (Unique)
- Meaning and emotions for each color
- Industry recommendations
- Cultural context (Western vs Eastern)
- Saturation/lightness effect analysis

### Theming
- Dark/light mode with system preference detection
- Keyboard shortcut `T` to toggle

### Mobile Experience
- Touch targets ≥44px (Apple Human Interface Guidelines)
- Safe area handling for notch/home indicator devices
- Dynamic viewport height for mobile browser address bar
- Tap-toggle action pill (replaces hover on mobile)
- Responsive dropdowns that don't overflow small screens

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
- 9 formats: CSS, SCSS, Tailwind, JSON, Array, SVG, PNG, PDF, ASE
- PDF: Presentation-ready document with color details
- ASE: Adobe Swatch Exchange for Photoshop/Illustrator/InDesign
- Semantic naming (primary, secondary, accent, background, surface)

### Accessibility
- WCAG contrast checker (AA/AAA)
- Color blindness simulation (5 types)
- Confusable pairs detection

### Community
- **Explore**: Browse community-published palettes
- **Publish**: Share your palettes with optional name, author, tags
- **Like**: Heart palettes you love (persisted locally)
- **Search & Filter**: Find palettes by name, author, tags, sort by newest/popular/most liked
- **Use Palette**: One-click load any community palette into editor

### AI Color Assistant (New)
- **Natural Language**: Describe palettes in plain English ("warm sunset", "modern tech startup")
- **Claude-Powered**: Uses Claude claude-sonnet-4-20250514 for fast, intelligent suggestions
- **Preview & Apply**: See generated colors before applying to your palette
- **Regenerate**: Not happy? Generate new variations with one click
- **Rate Limits**: Free users get 3/min and 10/day; Premium users get 30/min unlimited

---

## Implementation Status

All sprints complete. Now implementing competitive roadmap.

| Sprint | Focus | Status |
|--------|-------|--------|
| 1 | Foundation - Color engine, OKLCH, Zustand store | ✅ |
| 2 | All Modes - 4 modes with shared state | ✅ |
| 3 | Export & A11y - 9 formats, WCAG, color blindness sim | ✅ |
| 4 | Monetization - Stripe, premium gating, SEO | ✅ |
| 5 | Deployment - Railway, auto-deploy from main | ✅ |
| 6 | V1 Launch Prep - Memory leak fixes, performance, refactoring | ✅ |
| 7 | Value Enhancement - Import, extraction, gradients, suggestions, shortcuts | ✅ |

### Competitive Roadmap (vs Coolors.co)

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | Variable palette size, dark mode, color psychology | ✅ |
| 2 | Community explorer (Supabase + palette browsing) | ✅ |
| 3 | AI color assistant (Claude API) | ✅ |
| 6 | Named colors database (1,552 colors) | ✅ |
| 7 | Context mode enhancement (shade scales, previews) | ✅ |
| 8 | Enhanced Tailwind export (v3/v4, color spaces) | ✅ |
| 9 | Coolors-style actions (remove, shades, drag, save) | ✅ |
| 10 | Mobile UI/UX (touch targets, safe areas, tap-toggle) | ✅ |
| 11 | Expanded mood presets (64 moods, 7 categories) | ✅ |
| 12 | Mood mode redesign (grid cards, expand to edit) | ✅ |
| 13 | Mood mode consolidation + global shade control | ✅ |
| 14 | Palette layout toggle + UI polish | ✅ |
| 15 | Playground redesign — Color Lab (adaptive discovery) | ✅ |
| 16 | The Mosaic — community color ownership | ✅ |
| 4 | Platform integrations (Figma, Chrome, VS Code) | Pending |
| 5 | SVG recolor, expanded templates | Pending |

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 |
| Styling | Tailwind 4 |
| State | Zustand |
| Animation | Framer Motion |
| Database | Supabase |
| Hosting | Railway |
| Payments | Stripe |

localStorage for user preferences, Supabase for community palettes.

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
| `1-9, 0` | Copy color's hex (0=10th) |
| `Shift+1-9, 0` | Toggle lock |
| `C` | Copy all hex codes |
| `R` | Shuffle colors |
| `I` | Invert palette |
| `D` | Desaturate (-20%) |
| `V` | Vibrant (+20%) |
| `H` | History browser |
| `T` | Toggle theme |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| **Color Lab (Playground)** | |
| `Arrow Right` / `Space` | Add color to palette |
| `Arrow Left` | Skip color |
| `Arrow Up` | Save to favorites |
| `Arrow Down` | See similar color |
| `Backspace` | Remove last from palette |

---

## Competitors

| Competitor | Our Advantage |
|------------|---------------|
| Coolors | Mood-based generation, mesh gradients, color psychology, accessibility simulation |
| Adobe Color | Not locked to ecosystem, mesh gradients, better UX |
| Khroma | Immediate, simpler, more export options |

### Gap Analysis (vs Coolors)

| Feature | Coolors | HueGo | Status |
|---------|---------|-------|--------|
| Variable palette (2-10) | Yes | Yes | ✅ Parity |
| Dark mode | Yes | Yes | ✅ Parity |
| Color info/psychology | Basic | Rich | ✅ Advantage |
| Mood-based generation | No | 64 moods, grid cards, expand-to-edit | ✅ Advantage |
| Mesh gradients | No | Yes | ✅ Advantage |
| Accessibility sim | Basic | 5 types | ✅ Advantage |
| Community palettes | 10M+ | Yes (growing) | ✅ Parity |
| AI assistant | Yes | Yes | ✅ Parity |
| Remove color (X) | Yes | Yes | ✅ Parity |
| View shades | Yes | Yes | ✅ Parity |
| Save/favorite color | Yes | Yes | ✅ Parity |
| Drag to reorder | Yes | Yes | ✅ Parity |
| Copy button | Yes | Yes | ✅ Parity |
| Mobile touch targets | Basic | 44px+ HIG | ✅ Advantage |
| Safe area support | Partial | Full | ✅ Advantage |
| Layout toggle (columns/strips) | No | Yes | ✅ Advantage |
| Adaptive color discovery | No | Yes (learns from swipes) | ✅ Advantage |
| 4-direction swipe gestures | No | Yes (add/skip/save/similar) | ✅ Advantage |
| Community color ownership | No | Yes (The Mosaic, $10/color) | ✅ Advantage |
| Figma plugin | Yes | Pending | Phase 4 |

---

## Related Docs

- [Session Start](/docs/SESSION-START.md) - Start here for dev
- [Architecture](/docs/ARCHITECTURE.md) - Technical details
- [Changelog](/docs/CHANGELOG.md) - Version history
