# HueGo - Technical Architecture

> Detailed technical documentation for developers and AI agents.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Next.js App Router                            │
├─────────────────────────────────────────────────────────────────────┤
│  /immersive  /context  /mood  /play  /gradient  /p/[id]             │
│       │          │       │      │        │          │                │
│       └──────────┴───────┴──────┴────────┴──────────┘                │
│                              │                                       │
│                    ┌─────────▼─────────┐                            │
│                    │   Zustand Stores  │                            │
│                    │  palette.ts       │                            │
│                    │  subscription.ts  │                            │
│                    └─────────┬─────────┘                            │
│                              │                                       │
│      ┌───────────────────────┼───────────────────────┐              │
│      │           │           │           │           │               │
│  ┌───▼───┐  ┌────▼────┐  ┌───▼───┐  ┌────▼────┐  ┌───▼───┐         │
│  │colors │  │generate │  │ mood  │  │ import  │  │extract│         │
│  └───────┘  └─────────┘  └───────┘  └─────────┘  └───────┘         │
│      │           │           │           │           │               │
│  ┌───▼───┐  ┌────▼────┐  ┌───▼───┐  ┌────▼────┐  ┌───▼───┐         │
│  │gradient│  │suggest │  │export │  │access.  │  │share  │         │
│  └───────┘  └─────────┘  └───────┘  └─────────┘  └───────┘         │
│                              │                                       │
│                    ┌─────────▼─────────┐                            │
│                    │   localStorage    │                            │
│                    │   (persistence)   │                            │
│                    └───────────────────┘                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Color Engine (`src/lib/colors.ts`)

### Color Spaces

| Space | Format | Use Case |
|-------|--------|----------|
| **HEX** | `#FF5733` | Display, export, sharing |
| **RGB** | `{ r: 255, g: 87, b: 51 }` | Web standard, CSS |
| **HSL** | `{ h: 11, s: 100, l: 60 }` | Human-readable adjustments |
| **OKLCH** | `{ l: 0.65, c: 0.2, h: 30 }` | Generation (perceptual uniformity) |

### Why OKLCH?

Traditional HSL/HSV color spaces have a problem: colors with the same "lightness" value can appear very different to humans. OKLCH solves this:

- **L** (Lightness): 0-1, perceptually uniform
- **C** (Chroma): 0-0.4, saturation amount
- **H** (Hue): 0-360, color angle

### Key Functions

```typescript
// Color space conversions
hexToRgb(hex: string): RGB
rgbToHex(rgb: RGB): string
rgbToHsl(rgb: RGB): HSL
hslToRgb(hsl: HSL): RGB
rgbToOklch(rgb: RGB): OKLCH
oklchToRgb(oklch: OKLCH): RGB
hexToOklch(hex: string): OKLCH
oklchToHex(oklch: OKLCH): string

// Utilities
getContrastColor(rgb: RGB): "white" | "black"
getContrastRatio(rgb1: RGB, rgb2: RGB): number
getLuminance(rgb: RGB): number
createColor(hex: string): Color

// Gamut handling (O(log n) binary search)
isInGamut(oklch: OKLCH): boolean
forceInGamut(oklch: OKLCH): OKLCH

// Text color utility
getTextColorsForBackground(contrastColor): { textColor, textColorMuted }
```

---

## Palette Generation (`src/lib/generate.ts`)

### Harmony Types

| Type | Algorithm | Best For |
|------|-----------|----------|
| **Random** | Constrained random with spread | General use |
| **Analogous** | Adjacent hues (±30°) | Harmonious, calm |
| **Complementary** | Opposite hues (180°) | High contrast |
| **Triadic** | Three evenly spaced (120°) | Vibrant, balanced |
| **Split-Complementary** | Base + two adjacent to complement | Dynamic, less harsh |
| **Monochromatic** | Single hue, varied L/C | Sophisticated, unified |

### Generation Flow

```typescript
generatePalette(
  harmonyType: HarmonyType,
  locked: (Color | null)[],
  size: number = 5
): Color[]
```

1. Determine base hue (from locked color or random)
2. Apply harmony algorithm to calculate target hues
3. Generate OKLCH values within aesthetic constraints
4. Force all colors into sRGB gamut
5. Sort by lightness for visual balance
6. Convert to full Color objects

---

## Import System (`src/lib/import.ts`)

### Supported Formats

| Format | Detection | Example |
|--------|-----------|---------|
| **Hex codes** | `#` prefix or 6-char hex | `#FF5733, #C70039` |
| **CSS variables** | `--` prefix | `--primary: #FF5733;` |
| **Tailwind** | `colors:` key | `colors: { primary: '#FF5733' }` |
| **JSON** | Array or object structure | `["#FF5733", "#C70039"]` |

### Key Functions

```typescript
interface ImportResult {
  success: boolean;
  colors: Color[];
  format: ImportFormat | null;
  error?: string;
}

importPalette(input: string): ImportResult
detectFormat(input: string): ImportFormat | null
parseHexList(input: string): Color[]
parseCssVariables(input: string): Color[]
parseTailwindConfig(input: string): Color[]
parseJson(input: string): Color[]
```

---

## Image Extraction (`src/lib/extract.ts`)

### Algorithm: K-Means Clustering

1. Load image onto canvas
2. Sample pixels (every Nth pixel for performance)
3. Run k-means with k=5 (palette size)
4. Return dominant colors as OKLCH
5. Harmonize for visual balance

### Key Functions

```typescript
interface ExtractOptions {
  count?: number;        // Default 5
  quality?: number;      // Sample rate
  harmonize?: boolean;   // Apply OKLCH harmonization
}

extractColorsFromImage(
  imageSource: string | File,
  options?: ExtractOptions
): Promise<Color[]>

harmonizeExtractedColors(colors: Color[]): Color[]

// Session-based limits
getExtractionCount(): number
incrementExtractionCount(): void
canExtract(isPremium: boolean): boolean  // 3 free, unlimited premium
```

---

## Gradient Generation (`src/lib/gradient.ts`)

### Gradient Types

| Type | Description | CSS Output |
|------|-------------|------------|
| **Linear** | Straight line gradient | `linear-gradient(45deg, ...)` |
| **Radial** | Circular gradient | `radial-gradient(circle at center, ...)` |
| **Conic** | Sweep gradient | `conic-gradient(from 0deg at center, ...)` |
| **Mesh** | Multi-point blend | Multiple overlaid radial gradients |

### Key Functions

```typescript
interface GradientConfig {
  type: GradientType;
  colors: Color[];
  angle?: number;         // Linear: 0-360
  position?: { x: number; y: number };  // Radial/conic center
  meshPoints?: MeshPoint[];  // Mesh gradient points
}

gradientToCSS(config: GradientConfig): string
exportGradientAsCSS(config: GradientConfig, name?: string): string

// Mesh gradient helpers
generateMeshPoints(colors: Color[]): MeshPoint[]
meshToCSS(points: MeshPoint[]): string
```

---

## Color Psychology (`src/lib/color-psychology.ts`)

### Overview

Comprehensive color psychology data for understanding color meanings, emotions, and cultural context.

### Key Types

```typescript
interface ColorPsychology {
  hueRange: [number, number];  // Hue range in degrees
  name: string;
  meaning: string;
  emotions: string[];
  useCases: string[];
  industries: string[];
  cultures: {
    western: string;
    eastern: string;
    general: string;
  };
  positiveTraits: string[];
  negativeTraits: string[];
}

interface ColorAnalysis {
  baseColor: ColorPsychology | null;
  neutral: NeutralInfo | null;
  saturation: SaturationEffect;
  lightness: LightnessEffect;
  isNeutral: boolean;
  summary: string;
}
```

### Key Functions

```typescript
getColorPsychology(hue: number): ColorPsychology
getSaturationEffect(saturation: number): SaturationEffect
getLightnessEffect(lightness: number): LightnessEffect
isNeutralColor(saturation: number): boolean
getNeutralInfo(lightness: number): NeutralInfo
analyzeColor(hue: number, saturation: number, lightness: number): ColorAnalysis
```

### Color Families

| Hue Range | Name | Primary Meaning |
|-----------|------|-----------------|
| 0-15 | Red | Energy, passion, urgency |
| 15-45 | Orange | Creativity, enthusiasm |
| 45-70 | Yellow | Happiness, optimism |
| 70-150 | Green | Nature, growth, health |
| 150-200 | Cyan/Teal | Communication, clarity |
| 200-260 | Blue | Trust, stability, calm |
| 260-290 | Purple | Luxury, creativity, wisdom |
| 290-330 | Magenta/Pink | Femininity, romance |
| 330-360 | Rose | Love, warmth, elegance |

### Related Files

- Component: `src/components/ColorInfoPanel.tsx`
- Integration: `src/components/modes/immersive/ColorColumn.tsx`

---

## Theme System (`src/store/theme.ts`)

### Overview

Dark/light theme management with system preference detection.

### Key Types

```typescript
type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}
```

### Key Functions

```typescript
getSystemPreference(): ResolvedTheme
resolveTheme(mode: ThemeMode): ResolvedTheme
applyTheme(theme: ResolvedTheme): void
```

### CSS Variables

Theme applies class `light` or `dark` to `<html>` element. CSS variables defined in `globals.css`:

| Variable | Dark | Light |
|----------|------|-------|
| `--background` | #0a0a0a | #ffffff |
| `--foreground` | #fafafa | #09090b |
| `--glass` | rgba(0,0,0,0.3) | rgba(255,255,255,0.8) |
| `--glass-border` | rgba(255,255,255,0.1) | rgba(0,0,0,0.1) |
| `--command-bg` | rgba(24,24,27,0.95) | rgba(255,255,255,0.95) |
| `--command-border` | rgba(63,63,70,0.5) | rgba(228,228,231,0.8) |
| `--command-hover` | rgba(255,255,255,0.05) | rgba(0,0,0,0.03) |
| `--primary-cta` | #ffffff | #18181b |
| `--primary-cta-text` | #09090b | #fafafa |

### Related Files

- Component: `src/components/ThemeToggle.tsx`
- CSS: `src/app/globals.css`
- Integration: `src/components/ModeToggle.tsx`

---

## Color Suggestions (`src/lib/suggestions.ts`)

### Suggestion Categories

| Category | Algorithm | Count |
|----------|-----------|-------|
| **Lighter** | +10%, +20%, +30% lightness | 3 |
| **Darker** | -10%, -20%, -30% lightness | 3 |
| **Saturated** | +15%, +30% chroma | 2 |
| **Muted** | -15%, -30% chroma | 2 |
| **Adjacent** | ±30°, ±60° hue | 4 |
| **Complement** | 180° hue shift | 1 |

### Key Functions

```typescript
interface SuggestionGroup {
  label: string;
  colors: Color[];
}

generateSuggestions(color: Color): SuggestionGroup[]
generateLighterVariations(color: Color): Color[]
generateDarkerVariations(color: Color): Color[]
generateSaturatedVariations(color: Color): Color[]
generateMutedVariations(color: Color): Color[]
generateAdjacentHues(color: Color): Color[]
generateComplement(color: Color): Color
```

---

## State Management (`src/store/palette.ts`)

### Store Structure

```typescript
interface PaletteState {
  // Current state
  colors: Color[];
  locked: boolean[];
  mode: Mode;
  harmonyType: HarmonyType;
  paletteSize: number;  // 2-10, dynamic

  // History (for undo/redo)
  history: Palette[];
  historyIndex: number;

  // Saved palettes
  savedPalettes: Palette[];

  // Saved colors (favorites)
  savedColors: Color[];

  // Actions
  generate: () => void;
  toggleLock: (index: number) => void;
  setColor: (index: number, color: Color) => void;
  setColors: (colors: Color[]) => void;
  setMode: (mode: Mode) => void;
  setHarmonyType: (type: HarmonyType) => void;
  setPaletteSize: (size: number) => void;
  addColor: () => void;
  removeColor: () => void;
  removeColorAt: (index: number) => void;  // Remove specific color
  undo: () => void;
  redo: () => void;
  savePalette: () => Palette | null;
  deleteSavedPalette: (id: string) => void;
  loadPalette: (palette: Palette) => void;
  reorderColors: (from: number, to: number) => void;
  reset: () => void;

  // Saved colors (favorites)
  toggleSaveColor: (color: Color, isPremium?: boolean) => boolean;
  isSavedColor: (hex: string) => boolean;
  deleteSavedColor: (hex: string) => void;

  // Shade base (original colors before shade shifting)
  shadeBaseColors: Color[] | null;

  // Batch operations
  shuffle: () => void;
  invert: () => void;
  adjustChroma: (delta: number) => void;
  adjustLightness: (delta: number) => void;
  shiftToShade: (shade: ShadeLevel) => void;
  clearShadeBase: () => void;
}
```

### Selector Hooks

```typescript
// Individual selectors for optimized re-renders
useColors(): Color[]
useLocked(): boolean[]
useMode(): Mode
useHarmonyType(): HarmonyType
usePaletteSize(): number
useSavedPalettes(): Palette[]
useSavedColors(): Color[]
useHistory(): Palette[]
useHistoryIndex(): number
useCanUndo(): boolean
useCanRedo(): boolean
```

---

## The Mosaic (`src/lib/mosaic-grid.ts`, `src/store/mosaic.ts`)

### Overview

A 64×64 grid of 4,096 colors (all 12-bit shorthand hex values `#RGB`). Users pay $10 to claim a color, name it, and write a blurb. Creates a living community artwork at `/mosaic`.

### Grid Algorithm

```typescript
// All 4,096 colors generated from 16³ combinations
for (r = 0; r < 16; r++)
  for (g = 0; g < 16; g++)
    for (b = 0; b < 16; b++)
      // Expand nibble: 0xF → 0xFF (multiply by 17)
      colors.push({ hex3: rgb hex, hex6: expanded })

// Unified hue-based layout (no achromatic/chromatic split):
// 1. Sort all 4,096 colors by OKLCH hue
// 2. Divide into 64 columns of 64 colors each
// 3. Each column sorted by: lightness + chroma * 0.25 (bright top, dark bottom)
//
// Note: Still has visible chroma noise. See CHANGELOG 0.23.1 "Lessons Learned"
// for failed approaches and potential solutions (Hilbert curve, SOM).
```

### Key Functions

```typescript
getMosaicGrid(): MosaicColorEntry[]      // Cached 4,096 entries
getMosaicLookup(): Map<string, Entry>    // hex3 → entry map
getMosaicColor(hex3: string): Entry      // Single color lookup
```

### Mosaic Store

```typescript
interface MosaicState {
  claims: ColorClaim[];
  claimMap: Map<string, ColorClaim>;  // O(1) lookup
  stats: MosaicStats | null;
  selectedHex3: string | null;
  hoveredHex3: string | null;

  fetchClaims: () => Promise<void>;
  getClaim: (hex3: string) => ColorClaim | undefined;
  handleRealtimeClaim: (claim: ColorClaim) => void;
}
```

### Claim Flow

1. User clicks unclaimed color → panel opens
2. Click "Claim for $10" → POST `/api/mosaic/claim`
3. API creates reservation row (15-min expiry) + Stripe Checkout session
4. User completes Stripe payment
5. Webhook receives `checkout.session.completed` with metadata
6. Reservation updated to `payment_status='completed'`
7. User redirected to `/mosaic/success` for personalization
8. POST `/api/mosaic/personalize` saves custom name + blurb

### Database Schema

```sql
CREATE TABLE color_claims (
  hex3 TEXT NOT NULL UNIQUE,  -- "f0a" (prevents double-claims)
  payment_status TEXT CHECK (IN ('pending', 'completed', 'refunded')),
  reserved_until TIMESTAMPTZ,  -- 15-min reservation expiry
  custom_color_name TEXT,
  blurb TEXT CHECK (char_length(blurb) <= 280),
  stripe_checkout_session_id TEXT,
  ...
);
```

### Related Files

- Grid algorithm: `src/lib/mosaic-grid.ts`
- Types: `src/lib/mosaic-types.ts`
- Store: `src/store/mosaic.ts`
- API: `src/app/api/mosaic/`
- Components: `src/components/mosaic/`
- Pages: `src/app/mosaic/`

---

## Subscription Store (`src/store/subscription.ts`)

### Server-Side Validation

The subscription store includes server-side verification to prevent localStorage spoofing:

```typescript
interface SubscriptionState {
  isPremium: boolean;
  status: SubscriptionStatus;
  customerId: string | null;
  subscriptionId: string | null;
  currentPeriodEnd: number | null;
  lastVerified: number | null;
  isVerifying: boolean;

  // Actions
  verifySubscription: () => Promise<boolean>;

  // Helpers
  canUseExportFormat: (format: ExportFormat) => boolean;
  canUseMode: (mode: string) => boolean;
  canUseHarmony: (harmony: string) => boolean;
  canUseAccessibilityFeature: (feature: string) => boolean;
  getSavedPalettesLimit: () => number;
}
```

### Verification Flow

1. Client calls `verifySubscription()`
2. POST to `/api/verify-subscription` with subscription ID
3. Server validates with Stripe API
4. Response cached for 5 minutes
5. Premium features gated based on verified status

---

## Component Architecture

### Mode Pages

All modes use `ModePageLayout` wrapper:

```tsx
// src/app/[mode]/page.tsx
"use client";

import dynamic from "next/dynamic";
import { ModePageLayout } from "@/components/layout/ModePageLayout";

const ModeView = dynamic(
  () => import("@/components/modes/[mode]").then((mod) => mod.ModeView),
  { ssr: false }
);

export default function ModePage() {
  return (
    <ModePageLayout enableGenerate={true}>
      <ModeView />
    </ModePageLayout>
  );
}
```

### Component Hierarchy

```
ModePageLayout
├── HydrationLoader (loading state)
├── NavigationBar (top navigation)
│   ├── ModeSelector (dropdown with mode cards)
│   ├── Logo (HueGo link)
│   ├── ExploreLink (separate explore navigation)
│   ├── Help Button (? shortcut hint)
│   └── ThemeToggle
├── [ModeView] (dynamic)
│   ├── ImmersiveView → ColorColumn[]
│   ├── ContextView → PaletteSidebar, PreviewTypeSelector, [Preview]
│   ├── MoodView → MoodSelectionPanel, RefinementSliders
│   ├── PlaygroundView (state machine: discovery | refinement)
│   │   ├── DiscoveryPhase → SwipeCard, PaletteStrip
│   │   └── RefinementPhase → ColorColumn[], RefinementSliders
│   └── GradientView → GradientPreview, GradientControls
├── CommandCenter (bottom action bar)
│   ├── CommandBar
│   │   ├── GenerateButton (primary CTA)
│   │   ├── PaletteControls (size +/-, harmony dropdown)
│   │   ├── More Button (opens CommandPanel)
│   │   └── Share Button
│   └── CommandPanel (slide-up grouped actions)
│       ├── CommandGroup "Edit" → Undo, Redo, History, Shuffle, Invert
│       ├── CommandGroup "Tools" → AI, Accessibility, Extract, Import
│       └── CommandGroup "Output" → Export, Publish, Save
└── [Modals] (lazy loaded)
    ├── ExportModal
    ├── AccessibilityPanel
    ├── ImportModal
    ├── ImageDropZone
    ├── HistoryBrowser
    ├── PublishModal
    ├── AIAssistantModal
    └── KeyboardShortcuts
```

### Shared UI Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `ColorEditButton` | Color picker with suggestions | `src/components/ui/` |
| `HydrationLoader` | SSR hydration loading state | `src/components/ui/` |
| `ModePageLayout` | Common mode wrapper | `src/components/layout/` |
| `ShadePopover` | 11-shade scale popover (50-950) | `src/components/ui/` |

---

## Keyboard Shortcuts (`src/hooks/useKeyboard.ts`)

### Implementation

```typescript
interface KeyboardOptions {
  enableGenerate?: boolean;
  enableUndo?: boolean;
  enableLock?: boolean;
  enableCopy?: boolean;
  enableBatchOps?: boolean;
  onCopyAll?: () => void;
  onCopyColor?: (hex: string) => void;
  onShowHistory?: () => void;
  onShowToast?: (message: string) => void;
}

useKeyboard(options: KeyboardOptions): {
  copyAllColors: () => Promise<void>;
  copySingleColor: (index: number) => Promise<void>;
}
```

### Shortcut Map

| Key | Action | Condition |
|-----|--------|-----------|
| `Space` | Generate palette | `enableGenerate` |
| `1-9, 0` | Copy color hex (0=10th) | `enableCopy` |
| `Shift+1-9, 0` | Toggle lock | `enableLock` |
| `C` | Copy all | `enableCopy` |
| `R` | Shuffle | `enableBatchOps` |
| `I` | Invert | `enableBatchOps` |
| `D` | Desaturate | `enableBatchOps` |
| `V` | Vibrant | `enableBatchOps` |
| `H` | History | `enableBatchOps` |
| `T` | Toggle theme | `enableBatchOps` |
| `?` | Show shortcuts overlay | Always |
| `Esc` | Close panel/modal | When open |
| `Ctrl+Z` | Undo | `enableUndo` |
| `Ctrl+Y` | Redo | `enableUndo` |

---

## API Routes

### `/api/verify-subscription`

```typescript
POST /api/verify-subscription
Body: { subscriptionId: string, customerId: string }
Response: { valid: boolean, isPremium: boolean, status: string }
```

### `/api/export`

```typescript
POST /api/export
Body: { format: ExportFormat, subscriptionId?: string, customerId?: string }
Response: { allowed: boolean, error?: string }
```

### `/api/checkout`

```typescript
POST /api/checkout
Body: { priceId: string }
Response: { url: string } // Stripe checkout URL
```

---

## Export System (`src/lib/export.ts`)

### Export Formats

| Format | Type | Copyable | Premium |
|--------|------|----------|---------|
| **CSS** | Text | Yes | No |
| **SCSS** | Text | Yes | Yes |
| **Tailwind** | Text | Yes | Yes |
| **JSON** | Text | Yes | No |
| **Array** | Text | Yes | Yes |
| **SVG** | Text | Yes | Yes |
| **PNG** | Binary | No | Yes |
| **PDF** | Binary | No | Yes |
| **ASE** | Binary | No | Yes |

### Key Functions

```typescript
// Text exports
exportCSS(colors: Color[], prefix?: string): string
exportSCSS(colors: Color[], prefix?: string): string
exportTailwind(colors: Color[]): string
exportJSON(colors: Color[], pretty?: boolean): string
exportArray(colors: Color[]): string
exportSVG(colors: Color[], width?: number, height?: number): string

// Binary exports
exportPNG(colors: Color[], width?: number, height?: number): Promise<Blob | null>
exportPDF(colors: Color[]): Promise<Blob>
exportASE(colors: Color[]): Blob

// Main export function
exportPalette(format: ExportFormat, colors: Color[], action: "copy" | "download"): Promise<boolean>
```

### PDF Export

Uses `jspdf` for client-side generation:
- Landscape A4 layout
- Color swatches with hex/name labels
- Details table with HEX, RGB, HSL, contrast info
- HueGo branding footer

### ASE Export (Adobe Swatch Exchange)

Binary format structure:
```
Header: "ASEF" (4 bytes)
Version: 1.0 (4 bytes)
Block count: N (4 bytes)
Per color:
  - Block type: 0x0001 (color entry)
  - Block length
  - Name (UTF-16BE with null terminator)
  - Color model: "RGB "
  - RGB values (3 floats, 0-1 range)
  - Color type: 0 (global)
```

---

## Performance Optimizations

1. **Zustand selectors** - Individual hooks prevent unnecessary re-renders
2. **Binary search gamut clamping** - O(log n) instead of O(n)
3. **Lazy loading modals** - `dynamic()` with `{ ssr: false }`
4. **Code splitting** - Mode views loaded dynamically
5. **useMemo for text colors** - Calculations memoized
6. **Timer cleanup** - All `setTimeout` properly cleaned up
7. **Client-side only** - Modes use mounted check via ModePageLayout
8. **Minimal localStorage** - History not persisted

---

## Security

- **Server-side subscription validation** - Prevents localStorage spoofing
- **Anonymous fingerprinting** - No user accounts required
- **URL params validated** - Before use in share URLs
- **Stripe webhook signature verification** - Prevents fake events
- **Rate limiting** - 10 publishes/hour per fingerprint

---

## Community System (`src/lib/supabase.ts`, `src/store/community.ts`)

### Overview

Community features for browsing, publishing, and liking palettes without user accounts.

### Database Schema

```sql
-- Main palettes table
published_palettes (
  id UUID PRIMARY KEY,
  colors JSONB NOT NULL,           -- Full Color[] array
  hex_codes TEXT[] NOT NULL,       -- For search/indexing
  color_count SMALLINT,            -- 2-10
  title TEXT,                      -- Optional name
  harmony_type TEXT,               -- Algorithm used
  mood_tags TEXT[],                -- User-selected tags
  author_fingerprint TEXT,         -- Anonymous ID
  author_display_name TEXT,        -- Optional name
  like_count INTEGER DEFAULT 0,    -- Denormalized count
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ,
  share_code TEXT UNIQUE,          -- Hex-based URL slug
  is_public BOOLEAN DEFAULT TRUE
)

-- Likes table (triggers update like_count)
palette_likes (
  id UUID PRIMARY KEY,
  palette_id UUID REFERENCES published_palettes,
  fingerprint TEXT,
  created_at TIMESTAMPTZ,
  UNIQUE(palette_id, fingerprint)
)
```

### Key Types

```typescript
interface PublishedPalette {
  id: string;
  colors: Color[];
  hex_codes: string[];
  color_count: number;
  title: string | null;
  harmony_type: string | null;
  mood_tags: string[] | null;
  author_fingerprint: string;
  author_display_name: string | null;
  like_count: number;
  view_count: number;
  created_at: string;
  share_code: string;
  is_public: boolean;
}

interface ExploreFilters {
  sort: "newest" | "popular" | "most_liked";
  search: string;
  tags: string[];
  colorCount?: number;
}
```

### Store Structure

```typescript
interface CommunityState {
  palettes: PublishedPalette[];
  isLoading: boolean;
  hasMore: boolean;
  cursor: string | null;
  filters: ExploreFilters;
  likedPaletteIds: string[];  // Persisted
  publishCount: number;        // Persisted

  fetchPalettes: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  toggleLike: (paletteId: string) => Promise<void>;
  setFilters: (filters: Partial<ExploreFilters>) => void;
  isLiked: (paletteId: string) => boolean;
}
```

### API Routes

```typescript
// List palettes with pagination
GET /api/community/palettes
Query: { sort, search, tags, colorCount, cursor }
Response: { palettes: PublishedPalette[], hasMore: boolean, cursor: string }

// Publish new palette
POST /api/community/publish
Body: { colors, title?, harmony_type?, mood_tags?, author_display_name?, fingerprint }
Response: { success: boolean, palette?: PublishedPalette, share_code?: string }

// Toggle like
POST /api/community/palettes/[id]/like
Body: { fingerprint }
Response: { success: boolean, liked: boolean, like_count: number }
```

### Fingerprinting (`src/lib/fingerprint.ts`)

Anonymous user identification without accounts:

```typescript
getFingerprint(): string        // Generate/retrieve stable ID
getAuthorDisplayName(): string  // Get stored name
setAuthorDisplayName(name)      // Persist name for publishing
```

Components: screen size, color depth, timezone, language, platform, hardware concurrency.

### Related Files

- Store: `src/store/community.ts`
- Types: `src/lib/community-types.ts`
- Page: `src/app/explore/page.tsx`
- Components: `src/components/modes/explore/*`
- Modal: `src/components/PublishModal.tsx`

---

## Adaptive Color Engine (`src/lib/adaptive-color.ts`)

### Overview

Machine-learning-style color generation engine for Color Lab (Playground). Tracks accepted/rejected colors in OKLCH space and biases future candidates toward user preferences.

### Key Types

```typescript
interface AdaptiveEngineStats {
  reviewed: number;
  accepted: number;
  rejected: number;
}

interface AdaptiveColorEngine {
  generateCandidate: () => Color;
  generateNearNeighbor: (base: Color) => Color;
  recordAccept: (color: Color) => void;
  recordReject: (color: Color) => void;
  reset: () => void;
  getStats: () => AdaptiveEngineStats;
}

type HarmonyLabel = "Analogous" | "Complementary" | "Contrasting" | "Neutral";
```

### Key Functions

```typescript
createAdaptiveEngine(): AdaptiveColorEngine  // Factory, creates engine instance
classifyHarmony(candidateHue: number, paletteColors: Color[]): HarmonyLabel
getPsychologyKeyword(hue: number): string    // First emotion from color psychology
```

### Algorithm

1. **< 2 accepted**: Fully random candidates (L: 0.35-0.75, C: 0.08-0.2, H: 0-360)
2. **2+ accepted**: Biased generation toward learned preferences
   - Hue center via circular mean of accepted hues
   - Hue spread: avg distance × 1.5, clamped [30°, 120°]
   - Lightness/chroma ranges derived from accepted colors ± padding
   - Rejected hue zones avoided (10° buckets, 2+ rejections to activate, 20° radius)
   - 30% wildcard chance for diversity
3. **Near neighbor**: Base ± (hue 15°, lightness 0.08, chroma 0.03)

### Integration

- Engine instantiated via `useRef(createAdaptiveEngine())` in PlaygroundView
- Passed to DiscoveryPhase as `engineRef`
- Persists across Discovery ↔ Refinement phase transitions
- Uses `forceInGamut`, `clampOklch`, `oklchToHex`, `createColor` from colors.ts
- Uses `randomInRange`, `randomHue`, `normalizeHue` from random.ts

### Related Files

- View: `src/components/modes/playground/PlaygroundView.tsx`
- Discovery: `src/components/modes/playground/DiscoveryPhase.tsx`
- Card: `src/components/modes/playground/SwipeCard.tsx`
- Strip: `src/components/modes/playground/PaletteStrip.tsx`
- Refinement: `src/components/modes/playground/RefinementPhase.tsx`

---

## AI Color Assistant (`src/app/api/ai/generate/route.ts`)

### Overview

Claude-powered palette generation from natural language descriptions.

### Architecture

```
User Input → AIAssistantModal → /api/ai/generate → Claude API
                                       ↓
                              Parse JSON response
                                       ↓
                              createColor() for each hex
                                       ↓
                              Display preview → Apply to palette
```

### API Route

```typescript
POST /api/ai/generate
Body: {
  prompt: string;        // User's description (max 500 chars)
  colorCount: number;    // 2-10, defaults to current palette size
  fingerprint: string;   // For rate limiting
  isPremium: boolean;    // Tier for rate limits
}
Response: {
  success: boolean;
  colors: { hex: string; name: string }[];
  remaining: number;     // Requests remaining in window
}
```

### Rate Limits

| Tier | Per Minute | Per Day |
|------|------------|---------|
| Free | 3 | 10 |
| Premium | 30 | Unlimited |

### System Prompt

```
You are a professional color palette designer. Generate color palettes based on user descriptions.

RULES:
1. Return EXACTLY the number of colors requested (default: 5)
2. Return as JSON array: [{"hex": "#RRGGBB", "name": "Color Name"}, ...]
3. Hex codes must be valid 6-digit uppercase format
4. Color names should be descriptive (e.g., "Sunset Orange", "Deep Ocean")
5. Consider color harmony, contrast, and visual balance
6. Respond ONLY with valid JSON, no additional text
```

### Store Integration

```typescript
// State
aiSuggestions: Color[] | null;
aiLoading: boolean;
aiError: string | null;

// Actions
generateAISuggestions(prompt: string, isPremium: boolean): Promise<void>
applySuggestion(): void      // Applies to palette with undo support
clearSuggestions(): void     // Clears preview state

// Selectors
useAISuggestions(): Color[] | null
useAILoading(): boolean
useAIError(): string | null
```

### Related Files

- Modal: `src/components/AIAssistantModal.tsx`
- Store: `src/store/palette.ts` (AI state)
- Button: `src/components/ActionBar/UtilityButtons.tsx`

---

## Related Docs

- [Product Overview](/docs/HUEGO.md) - Vision and features
- [Session Start](/docs/SESSION-START.md) - Quick dev reference
- [Changelog](/docs/CHANGELOG.md) - Version history
