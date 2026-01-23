# HueGo - Session Start Guide

> **Read this before doing anything.**
> Last Updated: 2026-01-23
> Production: https://huego-production.up.railway.app
> Dev: `npm run dev` (port 3377)

---

## Status

**Phase: Building - Competitive Roadmap**

Phase 1 complete. Implementing features to close gaps with Coolors.co.

**Current state:**
- 5 modes (Immersive, Playground, Context, Mood, Gradient)
- Variable palette size (2-10 colors)
- Dark/light theme support
- Color psychology info panel
- Import/extraction/gradients/suggestions all working
- Server-side subscription validation active
- Stripe in test mode

**Phase 1 Complete:**
- Variable palette size (2-10 colors, free: 2-7)
- Dark mode with system preference detection
- Color psychology panel with cultural context

**Next (Phase 2 - Community):**
- Supabase database setup
- Palette Explorer page
- Publish palette flow

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

No database. localStorage only.

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
│   ├── p/[id]/           # Shared palettes
│   ├── api/
│   │   ├── checkout/     # Stripe checkout
│   │   ├── export/       # Server-validated export
│   │   ├── verify-subscription/  # Subscription validation
│   │   ├── webhook/      # Stripe webhooks
│   │   └── subscription/
│   └── checkout/         # Success/cancel pages
├── components/
│   ├── ActionBar/        # Bottom action bar
│   │   ├── index.tsx
│   │   ├── HarmonySelector.tsx
│   │   ├── PaletteSizeSelector.tsx  # +/- color controls
│   │   ├── UndoRedoButtons.tsx
│   │   ├── SaveButton.tsx
│   │   ├── UtilityButtons.tsx
│   │   └── Toast.tsx
│   ├── layout/
│   │   └── ModePageLayout.tsx
│   ├── ui/
│   │   ├── ColorEditButton.tsx  # With suggestions popover
│   │   └── HydrationLoader.tsx
│   ├── modes/
│   │   ├── immersive/    # ImmersiveView, ColorColumn
│   │   ├── context/
│   │   ├── mood/
│   │   ├── playground/
│   │   └── gradient/     # GradientView.tsx
│   ├── ModeToggle.tsx
│   ├── ThemeToggle.tsx   # Dark/light mode toggle
│   ├── ColorInfoPanel.tsx # Color psychology slide-out
│   ├── ExportModal.tsx
│   ├── AccessibilityPanel.tsx
│   ├── PricingModal.tsx
│   ├── ImportModal.tsx   # Palette import
│   ├── ImageDropZone.tsx # Image extraction
│   └── HistoryBrowser.tsx
├── lib/
│   ├── colors.ts         # Color conversions
│   ├── color-psychology.ts # Color meanings & culture
│   ├── generate.ts       # Palette algorithms
│   ├── export.ts         # Export formats (9 total)
│   ├── mood.ts           # Mood profiles
│   ├── import.ts         # Import parsing
│   ├── extract.ts        # Image extraction (k-means)
│   ├── gradient.ts       # Gradient generation
│   ├── suggestions.ts    # Color suggestions
│   ├── accessibility.ts
│   ├── stripe.ts
│   ├── stripe-client.ts
│   ├── share.ts
│   └── types.ts          # Core types + tier constants
├── store/
│   ├── palette.ts        # Main state + paletteSize
│   ├── subscription.ts   # Premium state + verification
│   └── theme.ts          # Dark/light theme state
└── hooks/
    └── useKeyboard.ts    # All keyboard shortcuts
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

type Mode = "immersive" | "context" | "mood" | "playground" | "gradient";

type ExportFormat = "css" | "scss" | "tailwind" | "json" | "array" | "svg" | "png" | "pdf" | "ase";

type GradientType = "linear" | "radial" | "conic" | "mesh";

type ThemeMode = "light" | "dark" | "system";

// Tier constants (from types.ts)
FREE_MODES: ["immersive", "playground"]
PREMIUM_MODES: ["context", "mood", "gradient"]
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
| Modes | 2 | 5 |
| Harmonies | 3 | 6 |
| Exports | 2 | 9 |
| Saved Palettes | 5 | Unlimited |
| Image Extractions | 3/session | Unlimited |
| Gradients | - | Full |
| Accessibility | Basic | Full |

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

---

## Do Not

1. Add database/auth - localStorage is sufficient
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
