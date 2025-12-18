# HueGo Changelog

All notable changes to this project will be documented in this file.

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
- Export modal shows lock icon on premium formats
- Save button opens pricing modal when limit reached

**Pricing UI** (`src/components/PricingModal.tsx`)
- Feature comparison table (free vs premium)
- One-click upgrade button
- Stripe checkout integration
- Manage subscription link for premium users

**ModeToggle Upgrade Button**
- "Pro" button for free users (gradient, clickable)
- "Pro" badge for premium users (shows subscription management)

#### Changed
- ActionBar integrates with subscription store for save limits
- ExportModal gates premium formats with lock icons
- Immersive page includes banner ad for free users

#### Environment Variables (see `.env.example`)
```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_ADSENSE_CLIENT_ID
NEXT_PUBLIC_ADSENSE_SLOT_BANNER_TOP
NEXT_PUBLIC_ADSENSE_SLOT_BANNER_BOTTOM
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PREMIUM_PRICE_ID
```

**Manual Color Picker**
- Click-to-edit color support in Immersive, Context, and Mood modes
- Pencil icon appears on hover
- Native color picker opens without closing on interaction
- Real-time palette updates while selecting

#### Changed
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
- 7 export formats:
  - CSS Variables (`:root` custom properties)
  - SCSS Variables (with semantic aliases + map)
  - Tailwind Config (extend theme colors)
  - JSON (structured data with all color info)
  - JavaScript Array (simple hex array)
  - SVG Image (vector palette with labels)
  - PNG Image (canvas-based, 1200x300)
- Copy to clipboard support
- Direct file download
- Semantic color naming (primary, secondary, accent, background, surface)

**Export Modal** (`src/components/ExportModal.tsx`)
- Format selector sidebar
- Live code preview
- Palette strip visualization
- Copy Code / Download buttons
- Responsive layout (mobile-friendly)

**Accessibility Panel** (`src/components/AccessibilityPanel.tsx`)
- Two-tab interface: WCAG Contrast / Color Blindness
- WCAG Contrast tab:
  - Individual color contrast (vs white & black)
  - Color pair contrast matrix
  - AAA/AA/AA-Large/Fail indicators with color coding
  - WCAG 2.1 guidelines legend
- Color Blindness tab:
  - 5 simulation types (Normal, Protanopia, Deuteranopia, Tritanopia, Achromatopsia)
  - Side-by-side original vs simulated view
  - Confusable pairs warning (similarity threshold 85%)
  - Success message when all colors distinguishable
  - Prevalence statistics for each type

**Accessibility Utilities** (`src/lib/accessibility.ts`)
- `checkContrast()` - WCAG contrast ratio calculation
- `getPaletteContrasts()` - All pair combinations sorted by ratio
- `checkColorAccessibility()` - Test color against white/black
- `simulateColorBlindness()` - Matrix-based color transformation
- `simulatePaletteColorBlindness()` - Apply simulation to entire palette
- `findConfusablePairs()` - Identify potentially confusable colors
- Scientific color blindness transformation matrices

#### Changed
- ActionBar now includes Export and Accessibility buttons
- Icon set expanded (accessibility icon added)

#### Technical
- Created `src/lib/export.ts` (395 lines)
- Created `src/lib/accessibility.ts` (285 lines)
- Created `src/components/ExportModal.tsx` (249 lines)
- Created `src/components/AccessibilityPanel.tsx` (389 lines)
- Build verified passing with all new components

---

## [0.2.0] - 2025-12-14

### Sprint 2: All Modes Complete

#### Added

**Context Mode** (`/context`)
- Split view layout with palette sidebar
- Three preview types with switcher:
  - Website preview (hero, nav, feature cards)
  - Mobile App preview (iOS-style finance UI)
  - Dashboard preview (charts, stats, sidebar)
- Auto color role mapping (Primary, Secondary, Accent, Background, Surface)
- Real-time preview updates

**Mood Mode** (`/mood`)
- 12 mood profiles:
  - Row 1: Calm, Bold, Playful, Professional
  - Row 2: Warm, Cool, Retro, Futuristic
  - Row 3: Natural, Urban, Luxurious, Minimal
- Three refinement sliders:
  - Temperature (cooler ↔ warmer)
  - Vibrancy (subtle ↔ vibrant)
  - Brightness (dark ↔ light)
- "Generate New Variation" button
- Mood-to-color mapping system (`src/lib/mood.ts`)

**Playground Mode** (`/play`)
- Tinder-style swipe interface
- Card stack with depth effect
- Swipe right to add, left to skip
- Building palette visualization (5 slots)
- Click to remove colors
- "Start Over" reset button
- Completion celebration

#### Changed
- Mode toggle now shows all 4 modes with animated indicator
- Keyboard shortcuts disabled in Mood/Playground (use UI instead)

#### Technical
- Created `src/lib/mood.ts` for mood profile definitions
- Created `src/components/modes/context/` directory:
  - `ContextView.tsx`
  - `WebsitePreview.tsx`
  - `MobileAppPreview.tsx`
  - `DashboardPreview.tsx`
- Created `src/components/modes/mood/MoodView.tsx`
- Created `src/components/modes/playground/PlaygroundView.tsx`
- Added custom slider thumb styles in `globals.css`

---

## [0.1.0] - 2025-12-14

### Sprint 1: Foundation + Immersive Mode

#### Added

**Project Setup**
- Next.js 16 with App Router
- Tailwind CSS 4
- Zustand for state management
- Framer Motion for animations
- TypeScript configuration

**Color Engine** (`src/lib/colors.ts`)
- HEX ↔ RGB conversion
- RGB ↔ HSL conversion
- RGB ↔ OKLCH conversion (perceptually uniform)
- Contrast ratio calculation
- Automatic contrast color detection
- Gamut clamping for OKLCH

**Palette Generation** (`src/lib/generate.ts`)
- 6 harmony types:
  - Random (with aesthetic constraints)
  - Analogous (adjacent hues)
  - Complementary (opposite hues)
  - Triadic (evenly spaced)
  - Split-complementary
  - Monochromatic (single hue)
- Lock support (preserve specific colors)
- Automatic lightness sorting

**State Management** (`src/store/palette.ts`)
- Global palette state with Zustand
- localStorage persistence
- Undo/redo history (50 states)
- Saved palettes (10 max free tier)
- Mode and harmony type tracking

**Immersive Mode** (`/immersive`)
- Full-screen 5-column layout
- Click to lock/unlock colors
- Hover to reveal hex code
- Click hex to copy
- Smooth color transitions
- Mobile responsive (stacked layout)
- Spacebar hint for new users

**Shared Components**
- `ModeToggle` - Mode switcher with animated indicator
- `ActionBar` - Bottom bar with:
  - Harmony type selector
  - Undo/redo buttons
  - Save button
  - Share button

**Keyboard Shortcuts** (`src/hooks/useKeyboard.ts`)
- `Space` - Generate new palette
- `1-5` - Toggle lock on color
- `C` - Copy all hex codes
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` - Redo

**URL Sharing** (`src/lib/share.ts`)
- Palette encoding (hex codes joined by `-`)
- Share page (`/p/[id]`)
- "Use This Palette" / "Start Fresh" options

**Metadata**
- SEO-optimized meta tags
- Open Graph tags
- Twitter cards

#### Technical Details
- TypeScript strict mode
- Path aliases configured (`@/`)
- Dark theme by default
- No-select utility class
- Color transition utility class
- Hide scrollbar utility class

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
| Production live | ✅ | 2025-12-18 |

---

## Contributors

- Development: AI-assisted (Claude)
- Product/Design: Ben Tyson
