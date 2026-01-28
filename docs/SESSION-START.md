# HueGo - Session Start Guide

> **Read this before doing anything.**
> Last Updated: 2026-01-28
> Production: https://huego-production.up.railway.app
> Dev: `npm run dev` (port 3377)

---

## Status

**Phase: Building - Competitive Roadmap**

Phase 16 complete. The Mosaic — Community Color Ownership.

**Current state:**
- 6 modes (Immersive, Playground, Context, Mood, Gradient, Explore)
- **The Mosaic** — 4,096 claimable colors at `/mosaic`
- Variable palette size (2-10 colors)
- Dark/light theme support
- Color psychology info panel
- Import/extraction/gradients/suggestions all working
- Server-side subscription validation active
- Supabase community database active
- AI-powered palette generation via Claude API
- Mobile-optimized with touch targets and safe areas
- **64 mood presets across 7 categories** with grid UI
- **Global shade control** in main CommandBar
- **Palette layout toggle** (columns vs horizontal strips)
- **Color Lab** — adaptive discovery with 4-direction swipe + two-phase flow
- Stripe in test mode

**Phase 16 Complete (The Mosaic):**
- 64×64 grid of all 4,096 12-bit hex colors (`#RGB`)
- Claim any color for $10 via Stripe Checkout
- Give it a custom name and write a 280-char blurb
- Unclaimed colors at 35% opacity, claimed glow at full vibrancy
- Reservation system prevents double-claims (15-min hold)
- Post-checkout personalization form at `/mosaic/success`
- Navigation link added to header

**Recent Phases:**
- Phase 15: Playground Redesign — Color Lab
- Phase 14: Palette Layout Toggle + UI Polish
- Phase 13: Mood Mode Consolidation + Global Shade Control
- Phase 12: Mood Mode Redesign (grid of palette cards)
- Phase 11: Expanded Mood Presets (64 moods, 7 categories)

**Next (The Mosaic Future Phases):**
- Phase 2: Permalinks + social sharing (`/mosaic/[hex]`, OG images)
- Phase 3: Realtime + polish (live updates, search, mobile)
- Phase 4: Profiles + name integration
- Phase 5: Advanced (pay-what-you-want, leaderboard, refunds)

---

## Stack (Locked)

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 |
| Animation | Framer Motion |
| Hosting | Railway |
| Payments | Stripe |
| Database | Supabase (community features) |

localStorage for user state, Supabase for community palettes.

---

## Key Files

```
src/
├── app/
│   ├── immersive/        # Main mode (free)
│   ├── context/          # Preview mode (premium)
│   ├── mood/             # Mood-based (premium)
│   ├── play/             # Swipe mode (free)
│   ├── gradient/         # Gradient mode (premium)
│   ├── explore/          # Community explorer (free)
│   ├── mosaic/           # The Mosaic — color claiming
│   │   ├── page.tsx      # Main 64×64 grid
│   │   └── success/      # Post-checkout personalization
│   ├── p/[id]/           # Shared palettes
│   ├── api/
│   │   ├── ai/           # AI routes
│   │   │   └── generate/ # POST Claude palette generation
│   │   ├── checkout/     # Stripe checkout
│   │   ├── community/    # Community API routes
│   │   │   ├── palettes/ # GET list, POST publish
│   │   │   │   └── [id]/like/  # POST toggle like
│   │   │   └── publish/  # POST publish palette
│   │   ├── mosaic/       # Mosaic API routes
│   │   │   ├── colors/   # GET all claims + stats
│   │   │   ├── claim/    # POST create reservation + Stripe checkout
│   │   │   └── personalize/  # POST set name + blurb after payment
│   │   ├── export/       # Server-validated export
│   │   ├── verify-subscription/  # Subscription validation
│   │   ├── webhook/      # Stripe webhooks (incl. mosaic claims)
│   │   └── subscription/
│   └── checkout/         # Success/cancel pages
├── components/
│   ├── ActionBar/        # Bottom action bar
│   │   ├── index.tsx
│   │   ├── HarmonySelector.tsx
│   │   ├── PaletteSizeSelector.tsx  # +/- color controls
│   │   ├── UndoRedoButtons.tsx
│   │   ├── SaveButton.tsx
│   │   ├── UtilityButtons.tsx  # Includes Publish button
│   │   └── Toast.tsx
│   ├── layout/
│   │   └── ModePageLayout.tsx
│   ├── ui/
│   │   ├── ColorEditButton.tsx  # With suggestions popover
│   │   ├── HydrationLoader.tsx
│   │   └── LayoutToggle.tsx     # Column/strip layout toggle
│   ├── modes/
│   │   ├── immersive/    # ImmersiveView, ColorColumn
│   │   ├── context/
│   │   ├── mood/         # MoodView, MoodHeader, MoodGrid, MoodCard, MoodEditor
│   │   ├── playground/   # PlaygroundView, DiscoveryPhase, RefinementPhase, SwipeCard, PaletteStrip
│   │   ├── gradient/     # GradientView.tsx
│   │   └── explore/      # ExploreView, FilterBar, Grid, Card
│   ├── mosaic/           # The Mosaic components
│   │   ├── MosaicView.tsx        # Main view orchestrator
│   │   ├── MosaicGrid.tsx        # 64×64 CSS grid with event delegation
│   │   ├── MosaicCell.tsx        # Single memo'd color cell
│   │   ├── MosaicColorPanel.tsx  # Slide-over detail panel
│   │   ├── MosaicClaimFlow.tsx   # Claim button → Stripe redirect
│   │   ├── MosaicStatsBar.tsx    # Progress bar + recent claims
│   │   └── MosaicSuccessView.tsx # Post-checkout personalization
│   ├── ModeToggle.tsx
│   ├── ThemeToggle.tsx   # Dark/light mode toggle
│   ├── ColorInfoPanel.tsx # Color psychology slide-out
│   ├── ExportModal.tsx
│   ├── AccessibilityPanel.tsx
│   ├── PricingModal.tsx
│   ├── ImportModal.tsx   # Palette import
│   ├── ImageDropZone.tsx # Image extraction
│   ├── HistoryBrowser.tsx
│   ├── PublishModal.tsx  # Publish to community
│   └── AIAssistantModal.tsx # AI palette generation
├── lib/
│   ├── colors.ts         # Color conversions
│   ├── adaptive-color.ts # Adaptive engine for Color Lab
│   ├── color-psychology.ts # Color meanings & culture
│   ├── generate.ts       # Palette algorithms
│   ├── export.ts         # Export formats (9 total)
│   ├── mood.ts           # 64 mood profiles, 7 categories
│   ├── mood-icons.tsx    # 64 mood icons + color previews
│   ├── mosaic-grid.ts    # 4,096 color grid generation + OKLCH sorting
│   ├── mosaic-types.ts   # Mosaic interfaces and constants
│   ├── import.ts         # Import parsing
│   ├── extract.ts        # Image extraction (k-means)
│   ├── gradient.ts       # Gradient generation
│   ├── suggestions.ts    # Color suggestions
│   ├── accessibility.ts
│   ├── stripe.ts
│   ├── stripe-client.ts
│   ├── share.ts
│   ├── supabase.ts       # Supabase client
│   ├── fingerprint.ts    # Anonymous user ID
│   ├── community-types.ts # Community interfaces
│   └── types.ts          # Core types + tier constants
├── store/
│   ├── palette.ts        # Main state + paletteSize
│   ├── subscription.ts   # Premium state + verification
│   ├── theme.ts          # Dark/light theme state
│   ├── community.ts      # Explorer state, likes, filters
│   ├── mosaic.ts         # Mosaic claims, stats, UI state
│   └── ui.ts             # UI state (hideCommandCenter, paletteLayout)
└── hooks/
    ├── useKeyboard.ts    # All keyboard shortcuts
    └── useMoodPaletteCache.ts  # Mood palette pre-generation
```

---

## Environment Variables

Production vars are set in Railway. For local dev, create `.env.local`:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3377
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_...

# Supabase (required for community features)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Anthropic (required for AI assistant)
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Commands

```bash
npm run dev      # Start dev server (port 3377)
npm run build    # Production build
npm run lint     # ESLint check

# Railway CLI
railway login
railway link --project HueGo
railway up --service huego              # Deploy
railway variables --service huego       # View vars
railway logs --service huego            # View logs
```

---

## Data Models

```typescript
interface Color {
  hex: string;
  rgb: RGB;
  hsl: HSL;
  oklch: OKLCH;
  name: string;
  contrastColor: "white" | "black";
}

type HarmonyType = "random" | "analogous" | "complementary"
  | "triadic" | "split-complementary" | "monochromatic";

type Mode = "immersive" | "context" | "mood" | "playground" | "gradient" | "explore";

type ExportFormat = "css" | "scss" | "tailwind" | "json" | "array" | "svg" | "png" | "pdf" | "ase";

type GradientType = "linear" | "radial" | "conic" | "mesh";

type ThemeMode = "light" | "dark" | "system";

// Tier constants (from types.ts)
FREE_MODES: ["immersive", "playground", "explore"]
PREMIUM_MODES: ["context", "mood", "gradient"]
FREE_PUBLISH_LIMIT: 3
FREE_HARMONIES: ["random", "analogous", "complementary"]
PREMIUM_HARMONIES: ["triadic", "split-complementary", "monochromatic"]
FREE_EXPORT_FORMATS: ["css", "json"]
FREE_SAVED_PALETTES_LIMIT: 5

// Palette size constants
MIN_PALETTE_SIZE: 2
MAX_PALETTE_SIZE: 10
DEFAULT_PALETTE_SIZE: 5
FREE_MAX_PALETTE_SIZE: 7
PREMIUM_MAX_PALETTE_SIZE: 10
```

---

## Feature Gating

| Feature | Free | Premium |
|---------|------|---------|
| Palette Size | 2-7 colors | 2-10 colors |
| Modes | 3 (Immersive, Play, Explore) | 6 (all) |
| Harmonies | 3 | 6 |
| Exports | 2 | 9 |
| Saved Palettes | 5 | Unlimited |
| Image Extractions | 3/session | Unlimited |
| Gradients | - | Full |
| Accessibility | Basic | Full |
| Publish to Community | 3 total | Unlimited |
| Browse Community | Unlimited | Unlimited |
| Like Palettes | Unlimited | Unlimited |
| AI Generation | 3/min, 10/day | 30/min, Unlimited |

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
| `T` | Toggle dark/light theme |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| **Color Lab (Playground)** | |
| `Arrow Right` / `Space` | Add color to palette |
| `Arrow Left` | Skip color |
| `Arrow Up` | Save to favorites |
| `Arrow Down` | See similar color |
| `Backspace` | Remove last from palette |

---

## Do Not

1. Add user auth - anonymous fingerprinting is sufficient for community
2. Change the stack - it works
3. Over-engineer - keep it simple
4. Skip mobile testing
5. Change locked decisions
6. Fake premium via localStorage - server validates

---

## Deployment

Push to `main` triggers Railway auto-deploy.

```bash
git add -A && git commit -m "message" && git push origin main
```

---

## Related Docs

- [Product Overview](/docs/HUEGO.md) - Vision and features
- [Architecture](/docs/ARCHITECTURE.md) - Technical deep-dive
- [Changelog](/docs/CHANGELOG.md) - Version history
