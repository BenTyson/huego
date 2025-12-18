# HueGo - Session Start Guide for AI Agents

> **STOP! Read this entire document before doing anything.**
>
> Last Updated: 2025-12-15
> Current Phase: Sprint 5 (Launch & Growth)
> Dev Server: `npm run dev -- -p 3377`

---

## Quick Status

| Item | Status |
|------|--------|
| **Sprint 1** (Foundation + Immersive) | ✅ Complete |
| **Sprint 2** (All 4 Modes) | ✅ Complete |
| **Sprint 3** (Polish & Export) | ✅ Complete |
| **Sprint 4** (Monetization) | ✅ Complete |

**What Works Right Now:**
- All 4 modes functional (Immersive, Context, Mood, Playground)
- Palette generation with 6 harmony types
- URL sharing (`/p/HEX1-HEX2-HEX3-HEX4-HEX5`)
- localStorage persistence
- Keyboard shortcuts
- Mode switching with shared state
- Export modal (7 formats: CSS, SCSS, Tailwind, JSON, Array, SVG, PNG)
- WCAG contrast checker (AAA/AA/AA-Large/Fail indicators)
- Color blindness simulation (5 types with confusable pair detection)
- **SEO optimized** (sitemap, robots.txt, JSON-LD structured data)
- **Google AdSense integration** (banner ads for free users)
- **Stripe checkout** ($3/month premium subscription)
- **Premium features gating** (unlimited saves, all exports, ad-free)
- **Pricing modal & upgrade flow**

**What Needs Building (Sprint 5):**
- Add env vars for AdSense and Stripe (see `.env.example`)
- Deploy to Vercel
- Submit to Google Search Console
- Create AdSense ad units
- Create Stripe product/price
- Marketing & launch

---

## Project Overview

**HueGo** is a color palette generator with 4 distinct UI modes:

1. **Immersive** (`/immersive`) - Full-screen palette, spacebar to generate
2. **Context** (`/context`) - See palette on real designs (Website, Mobile, Dashboard)
3. **Mood** (`/mood`) - Select feelings → get matching colors
4. **Playground** (`/play`) - Tinder-style swipe to build palette

**Differentiator**: Mode-switching architecture. No competitor has this.

**Revenue Model**: Ads (free tier) + Premium subscription ($3/mo)

---

## Tech Stack (LOCKED - DO NOT CHANGE)

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.x (App Router) |
| Styling | Tailwind CSS | 4.x |
| State | Zustand | 5.x |
| Animation | Framer Motion | 11.x |
| Language | TypeScript | 5.x |

**No database** - localStorage only for MVP.

---

## File Structure

```
huego/
├── docs/
│   ├── SESSION-START.md    ← YOU ARE HERE
│   ├── HUEGO.md            # Full project vision
│   ├── ARCHITECTURE.md     # Technical deep-dive
│   └── CHANGELOG.md        # Development history
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Redirects to /immersive
│   │   ├── immersive/      # Immersive mode
│   │   ├── context/        # Context mode
│   │   ├── mood/           # Mood mode
│   │   ├── play/           # Playground mode
│   │   └── p/[id]/         # Shared palette view
│   ├── components/
│   │   ├── ModeToggle.tsx  # Mode switcher (header)
│   │   ├── ActionBar.tsx   # Bottom action bar
│   │   └── modes/
│   │       ├── immersive/  # ColorColumn, ImmersiveView
│   │       ├── context/    # WebsitePreview, MobilePreview, DashboardPreview
│   │       ├── mood/       # MoodView (grid + sliders)
│   │       └── playground/ # PlaygroundView (swipe cards)
│   ├── lib/
│   │   ├── types.ts        # TypeScript interfaces
│   │   ├── colors.ts       # Color conversion (hex↔rgb↔hsl↔oklch)
│   │   ├── generate.ts     # Palette generation algorithms
│   │   ├── mood.ts         # Mood → color mapping
│   │   ├── share.ts        # URL encoding/decoding
│   │   ├── export.ts       # Export utilities (7 formats)
│   │   └── accessibility.ts # WCAG + color blindness
│   ├── store/
│   │   └── palette.ts      # Zustand store
│   └── hooks/
│       └── useKeyboard.ts  # Keyboard shortcuts
├── public/
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## Critical Code Locations

### Color Engine
- **`src/lib/colors.ts`** - All color conversions (hex, RGB, HSL, OKLCH)
- **`src/lib/generate.ts`** - Palette generation (6 harmony types)
- Uses **OKLCH** color space for perceptually uniform generation

### State Management
- **`src/store/palette.ts`** - Zustand store with localStorage persistence
- State includes: colors, locked[], mode, harmonyType, history, savedPalettes

### Key Components
- **`src/components/ModeToggle.tsx`** - Mode switcher with animated indicator
- **`src/components/ActionBar.tsx`** - Bottom bar (harmony, undo/redo, save, export, accessibility, share)
- **`src/components/ExportModal.tsx`** - Export formats modal
- **`src/components/AccessibilityPanel.tsx`** - WCAG + color blindness panel
- **`src/components/modes/immersive/ImmersiveView.tsx`** - Main immersive UI
- **`src/components/modes/context/ContextView.tsx`** - Context mode with previews
- **`src/components/modes/mood/MoodView.tsx`** - Mood selection grid
- **`src/components/modes/playground/PlaygroundView.tsx`** - Swipe cards

---

## Data Models

```typescript
// Core color type (src/lib/types.ts)
interface Color {
  hex: string;           // "#FF5733"
  rgb: RGB;              // { r: 255, g: 87, b: 51 }
  hsl: HSL;              // { h: 11, s: 100, l: 60 }
  oklch: OKLCH;          // { l: 0.65, c: 0.2, h: 30 }
  name: string;          // "Vivid Orange"
  contrastColor: "white" | "black";
}

// Palette store state
interface PaletteState {
  colors: Color[];       // Current 5 colors
  locked: boolean[];     // Lock status per color
  mode: Mode;            // Current mode
  harmonyType: HarmonyType;
  history: Palette[];    // For undo
  savedPalettes: Palette[];
}

// Harmony types available
type HarmonyType =
  | "random"
  | "analogous"
  | "complementary"
  | "triadic"
  | "split-complementary"
  | "monochromatic";

// Mood profiles (src/lib/mood.ts)
// 12 moods: calm, bold, playful, professional, warm, cool,
//           retro, futuristic, natural, urban, luxurious, minimal
```

---

## Keyboard Shortcuts

| Key | Action | Where |
|-----|--------|-------|
| `Space` | Generate new palette | Immersive mode |
| `1-5` | Toggle lock on color | All modes |
| `C` | Copy all hex codes | All modes |
| `Cmd/Ctrl + Z` | Undo | All modes |
| `Cmd/Ctrl + Shift + Z` | Redo | All modes |

---

## Running the Project

```bash
# Start dev server (ALWAYS use port 3377)
npm run dev -- -p 3377

# Build for production
npm run build

# Type check
npx tsc --noEmit
```

---

## Decisions Already Made (DO NOT CHANGE)

1. **4-mode architecture** - Immersive, Context, Mood, Playground
2. **Tech stack** - Next.js, Tailwind, Zustand, Framer Motion
3. **No database** - localStorage only for MVP
4. **5-color palettes** - Standard size
5. **OKLCH generation** - For perceptual uniformity
6. **Premium pricing** - $3/month
7. **Context previews** - Website, Mobile App, Dashboard
8. **Port 3377** - Dev server port

---

## What NOT To Do

1. **Don't add accounts/auth** - Not needed for MVP
2. **Don't add a database** - localStorage is sufficient
3. **Don't change the stack** - It's working well
4. **Don't over-engineer** - Simple solutions preferred
5. **Don't skip mobile testing** - Many users will be mobile
6. **Don't add sound design** - Skipped for MVP
7. **Don't debate decisions** - Execute the plan

---

## Current Sprint: Sprint 5 (Launch & Growth)

### TODO
- [ ] Add environment variables (see `.env.example`)
- [ ] Deploy to Vercel
- [ ] Create Stripe product and price in dashboard
- [ ] Create AdSense ad units in dashboard
- [ ] Submit to Google Search Console
- [ ] Marketing and launch

### Definition of Done
- Production deployment live
- Payments processing
- Ads displaying

---

## Completed: Sprint 4 (Monetization)

- [x] SEO optimization (sitemap, robots.txt, JSON-LD)
- [x] Google AdSense integration with env var placeholders
- [x] Stripe checkout flow
- [x] Premium subscription store
- [x] Feature gating (saves, exports, ads)
- [x] Pricing modal and upgrade flow

---

## Completed: Sprint 3 (Export & Accessibility)

- [x] Export modal with 7 formats (CSS, SCSS, Tailwind, JSON, Array, SVG, PNG)
- [x] WCAG contrast checker (AAA/AA/AA-Large/Fail)
- [x] Color blindness simulation (5 types)
- [x] Confusable color pair detection

---

## Testing Checklist

Before marking work complete:
- [ ] `npm run build` passes
- [ ] All 4 modes work
- [ ] Mode switching preserves palette
- [ ] Keyboard shortcuts work
- [ ] URL sharing works (`/p/...`)
- [ ] localStorage persists across refresh
- [ ] Mobile responsive
- [ ] Export modal opens and formats work
- [ ] Accessibility panel shows contrast and simulations

---

## Contact & Resources

- **Project Plan**: `/docs/HUEGO.md`
- **Architecture**: `/docs/ARCHITECTURE.md`
- **Changelog**: `/docs/CHANGELOG.md`

---

## Session Handoff Protocol

At the end of your session:

1. Update `/docs/CHANGELOG.md` with what you built
2. Update this file's "Quick Status" section
3. Note any blockers or decisions needed
4. Run `npm run build` to verify no errors
5. Commit changes if requested

**Remember**: The goal is passive income. Ship fast, iterate later.
