# HueGo Changelog

All notable changes to this project will be documented in this file.

---

## [0.7.0] - 2026-01-22

### Sprint 6: Value & Monetization Enhancement

Major feature release adding import, extraction, gradients, and quick actions.

#### Added

**Palette Import System** (`src/lib/import.ts`, `src/components/ImportModal.tsx`)
- Paste hex codes (comma/space/newline separated)
- Paste CSS variables (auto-detected)
- Paste Tailwind config colors
- Paste JSON color arrays/objects
- Format auto-detection with preview
- ActionBar integration via import button

**Image Color Extraction** (`src/lib/extract.ts`, `src/components/ImageDropZone.tsx`)
- Drag-and-drop or click to upload
- K-means clustering algorithm for dominant colors
- OKLCH harmonization of extracted colors
- Session-based limits (3 free, unlimited premium)
- Real-time extraction preview

**Gradient Generation Mode** (`src/lib/gradient.ts`, `src/components/modes/gradient/`)
- New `/gradient` route (premium only)
- Four gradient types: linear, radial, conic, mesh
- Angle/position controls
- Live gradient preview
- CSS export for all gradient types
- Mesh gradient generation (trending design feature)

**Smart Color Suggestions** (`src/lib/suggestions.ts`)
- Enhanced ColorEditButton with suggestion popover
- Six suggestion categories:
  - Lighter variations (10% steps)
  - Darker variations (10% steps)
  - More saturated
  - Less saturated (muted)
  - Adjacent hues
  - Complementary colors
- One-click apply from suggestions

**Quick Actions & Keyboard Shortcuts**
- `1-5`: Copy that color's hex code
- `Shift+1-5`: Toggle lock on that color
- `R`: Shuffle/reorder colors randomly
- `I`: Invert palette (swap light/dark)
- `D`: Desaturate all (-20% chroma)
- `V`: Vibrant all (+20% chroma)
- `H`: Open history browser

**History Browser** (`src/components/HistoryBrowser.tsx`)
- Visual palette thumbnails
- Click to restore any previous state
- Current palette indicator
- Timestamp display
- Keyboard shortcut `H` to open

**Server-Side Subscription Validation**
- `/api/verify-subscription` endpoint
- `/api/export` validates premium before export
- Prevents localStorage subscription spoofing
- 5-minute verification cache

#### Changed

**Pricing Update**
- Monthly: $3 → $5/month
- New annual option: $36/year ($3/month effective, "Save 40%")
- Billing period toggle in PricingModal

**Feature Gating (Balanced)**

| Feature | Free | Premium |
|---------|------|---------|
| Modes | 2 (Immersive, Playground) | All 5 |
| Harmonies | 3 (Random, Analogous, Complementary) | All 6 |
| Exports | 2 (CSS, JSON) | All 7+ |
| Saved Palettes | 5 | Unlimited |
| Image Extractions | 3/session | Unlimited |
| Gradients | - | Full access |
| Accessibility | Basic (AA, 2 blindness types) | Full (AAA, all types) |

**Mode Restrictions**
- Context mode: Premium only (lock icon shown)
- Mood mode: Premium only (lock icon shown)
- Gradient mode: Premium only (new)

**Harmony Restrictions**
- Triadic: Premium only (lock icon shown)
- Split-Complementary: Premium only (lock icon shown)
- Monochromatic: Premium only (lock icon shown)

**Accessibility Restrictions**
- AAA contrast: Premium only
- Tritanopia simulation: Premium only
- Achromatopsia simulation: Premium only

**Store Updates**
- `palette.ts`: Added batch operations (shuffle, invert, adjustChroma, adjustLightness)
- `subscription.ts`: Added verification methods, helper functions for gating

#### Technical

- 20+ files modified
- 12 new files created
- New API routes: `/api/export`, `/api/verify-subscription`
- New lib files: `import.ts`, `extract.ts`, `gradient.ts`, `suggestions.ts`
- New components: `ImportModal`, `ImageDropZone`, `GradientView`, `HistoryBrowser`
- Build passes with no lint errors

---

## [0.6.0] - 2026-01-22

### V1 Launch Prep: Codebase Audit & Optimization

#### Fixed (Critical Bugs)
- **Memory leak in ColorColumn** - Timer in `handleCopy` now properly cleaned up on unmount
- **Memory leak in ActionBar** - Toast timer now properly cleaned up on unmount and cleared on rapid calls
- **forceInGamut performance** - Replaced O(n) linear chroma reduction with O(log n) binary search algorithm

#### Removed (Dead Code)
- Duplicate `ExportFormat` type from `export.ts` (kept in `types.ts`, added re-export)
- Unused `_hueInRange()` function from `mood.ts`
- Unused `adjustLightness()`, `adjustChroma()`, `adjustHue()` from `generate.ts`
- Unused `UserPreferences` interface and `COLOR_ROLES` constant from `types.ts`
- Unused `isFeatureLocked()` method from `subscription.ts`

#### Optimized (Performance)
- **Zustand selectors** - All mode views now use individual selectors (`useColors()`, `useLocked()`, etc.) for optimized re-renders
- **useMemo for text colors** - Added memoization in `ColorColumn.tsx`
- **Lazy loading modals** - `ExportModal`, `AccessibilityPanel`, `PricingModal` now use `dynamic()` imports
- **Code splitting** - All mode view components use `dynamic()` imports in page files

#### Added (New Components)
- `src/components/ui/ColorEditButton.tsx` - Reusable color edit control
- `src/components/ui/HydrationLoader.tsx` - SSR hydration loading state
- `src/components/layout/ModePageLayout.tsx` - Common mode page wrapper
- `getTextColorsForBackground()` utility in `colors.ts`

#### Refactored (Structural Improvements)
- **ActionBar split** into sub-components:
  - `ActionBar/index.tsx` - Main layout
  - `ActionBar/HarmonySelector.tsx` - Harmony type dropdown
  - `ActionBar/UndoRedoButtons.tsx` - Undo/redo controls
  - `ActionBar/SaveButton.tsx` - Save palette button
  - `ActionBar/UtilityButtons.tsx` - Export, accessibility, share buttons
  - `ActionBar/Toast.tsx` - Toast notification
- **ContextView sub-components**:
  - `PaletteSidebar.tsx` - Palette list with edit controls
  - `PreviewTypeSelector.tsx` - Preview type tabs
- **MoodView sub-components**:
  - `MoodSelectionPanel.tsx` - Mood grid selection
  - `RefinementSliders.tsx` - Temperature/vibrancy/brightness sliders
- **Mode pages simplified** - Now use `ModePageLayout` wrapper (~35 lines → ~17 lines each)

#### Technical
- 16 files modified
- 14 new files created
- Build passes with no new lint errors

---

## [0.5.0] - 2025-12-18

### Sprint 5: Deployment

#### Added
- Railway deployment (https://huego-production.up.railway.app)
- Stripe product "HueGo Pro" with live webhook
- On-brand checkout success page with animated palette

#### Changed
- Hosting from Vercel to Railway
- package.json start script uses Railway PORT env var
- Docs streamlined for AI agent efficiency

#### Environment Variables (Production)
```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PREMIUM_PRICE_ID
```

---

## [0.4.0] - 2025-12-16

### Sprint 4: Monetization

#### Added

**SEO Optimization**
- Enhanced metadata with keywords, Open Graph, and Twitter cards
- Sitemap generation (`/sitemap.xml`)
- Robots.txt generation (`/robots.txt`)
- JSON-LD structured data (WebApplication schema)
- Environment variable for site URL

**Subscription System** (`src/store/subscription.ts`)
- Zustand store for premium state management
- Subscription status tracking (active, canceled, past_due, trialing)
- Feature gating helpers (canUseExportFormat, getSavedPalettesLimit)
- localStorage persistence

**Google AdSense Integration** (`src/components/ads/`)
- `AdSenseScript` - Loads AdSense script (lazy)
- `AdUnit` - Generic ad unit component
- `BannerAd` - Banner ad wrapper for top/bottom placement
- Development placeholder when no client ID configured
- Auto-hidden for premium users

**Stripe Checkout** (`src/app/api/`)
- `/api/checkout` - Creates Stripe Checkout sessions
- `/api/webhook` - Handles Stripe webhooks
- `/api/subscription` - Gets subscription status, creates portal sessions
- Client-side redirect to Stripe hosted checkout
- Success/cancel pages with subscription verification

**Premium Features Gating**
- Free tier: 10 saved palettes, basic exports (CSS, JSON, Array)
- Premium tier: Unlimited saves, all exports (+ SCSS, Tailwind, SVG, PNG), ad-free

**Pricing UI** (`src/components/PricingModal.tsx`)
- Feature comparison table (free vs premium)
- One-click upgrade button
- Stripe checkout integration
- Manage subscription link for premium users

**Manual Color Picker**
- Click-to-edit color support in Immersive, Context, and Mood modes
- Pencil icon appears on hover
- Native color picker opens without closing on interaction
- Real-time palette updates while selecting

#### Changed
- ActionBar integrates with subscription store for save limits
- ExportModal gates premium formats with lock icons
- Background/Surface colors now generate as light neutrals (not saturated)
- Context mode preview selector moved to top-right for cleaner navigation
- React keys updated to prevent component remounting during color edits

#### Technical
- Installed `stripe` and `@stripe/stripe-js` packages
- Created lazy Stripe initialization to avoid build errors
- Used Suspense boundary for checkout success page
- All API routes handle missing env vars gracefully

---

## [0.3.0] - 2025-12-15

### Sprint 3: Export & Accessibility

#### Added

**Export System** (`src/lib/export.ts`)
- 7 export formats: CSS, SCSS, Tailwind, JSON, Array, SVG, PNG
- Copy to clipboard support
- Direct file download
- Semantic color naming (primary, secondary, accent, background, surface)

**Export Modal** (`src/components/ExportModal.tsx`)
- Format selector sidebar
- Live code preview
- Palette strip visualization
- Copy Code / Download buttons

**Accessibility Panel** (`src/components/AccessibilityPanel.tsx`)
- WCAG Contrast tab with AAA/AA/AA-Large/Fail indicators
- Color Blindness tab with 5 simulation types
- Confusable pairs warning

**Accessibility Utilities** (`src/lib/accessibility.ts`)
- Contrast ratio calculation
- Color blindness simulation (matrix-based)
- Confusable pairs detection

---

## [0.2.0] - 2025-12-14

### Sprint 2: All Modes Complete

#### Added

**Context Mode** (`/context`)
- Split view with palette sidebar
- Three preview types: Website, Mobile App, Dashboard
- Auto color role mapping

**Mood Mode** (`/mood`)
- 12 mood profiles
- Temperature/Vibrancy/Brightness sliders
- Mood-to-color mapping system

**Playground Mode** (`/play`)
- Tinder-style swipe interface
- Card stack with depth effect
- Building palette visualization

---

## [0.1.0] - 2025-12-14

### Sprint 1: Foundation + Immersive Mode

#### Added

**Project Setup**
- Next.js 16 with App Router
- Tailwind CSS 4, Zustand, Framer Motion

**Color Engine** (`src/lib/colors.ts`)
- HEX ↔ RGB ↔ HSL ↔ OKLCH conversions
- Contrast ratio calculation
- Gamut clamping

**Palette Generation** (`src/lib/generate.ts`)
- 6 harmony types
- Lock support
- Automatic lightness sorting

**State Management** (`src/store/palette.ts`)
- Global palette state with Zustand
- localStorage persistence
- Undo/redo history (50 states)

**Immersive Mode** (`/immersive`)
- Full-screen 5-column layout
- Click to lock/unlock, hover for hex, click to copy

**Keyboard Shortcuts** (`src/hooks/useKeyboard.ts`)
- Space, 1-5, C, Ctrl+Z, Ctrl+Shift+Z

**URL Sharing** (`src/lib/share.ts`)
- Palette encoding, share page (`/p/[id]`)

---

## Project Milestones

| Milestone | Status | Date |
|-----------|--------|------|
| Project initialized | ✅ | 2025-12-14 |
| Sprint 1 complete | ✅ | 2025-12-14 |
| Sprint 2 complete | ✅ | 2025-12-14 |
| Sprint 3 complete | ✅ | 2025-12-15 |
| Sprint 4 complete | ✅ | 2025-12-16 |
| Sprint 5 complete | ✅ | 2025-12-18 |
| V1 Launch Prep complete | ✅ | 2026-01-22 |
| Sprint 6 complete | ✅ | 2026-01-22 |

---

## Related Docs

- [Product Overview](/docs/HUEGO.md)
- [Technical Architecture](/docs/ARCHITECTURE.md)
- [Session Start Guide](/docs/SESSION-START.md)

---

## Contributors

- Development: AI-assisted (Claude)
- Product/Design: Ben Tyson
