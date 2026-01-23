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

  // History (for undo/redo)
  history: Palette[];
  historyIndex: number;

  // Saved palettes
  savedPalettes: Palette[];

  // Actions
  generate: () => void;
  toggleLock: (index: number) => void;
  setColor: (index: number, color: Color) => void;
  setColors: (colors: Color[]) => void;
  setMode: (mode: Mode) => void;
  setHarmonyType: (type: HarmonyType) => void;
  undo: () => void;
  redo: () => void;
  savePalette: () => Palette | null;
  deleteSavedPalette: (id: string) => void;
  loadPalette: (palette: Palette) => void;
  reorderColors: (from: number, to: number) => void;
  reset: () => void;

  // Batch operations
  shuffle: () => void;
  invert: () => void;
  adjustChroma: (delta: number) => void;
  adjustLightness: (delta: number) => void;
}
```

### Selector Hooks

```typescript
// Individual selectors for optimized re-renders
useColors(): Color[]
useLocked(): boolean[]
useMode(): Mode
useHarmonyType(): HarmonyType
useSavedPalettes(): Palette[]
useHistory(): Palette[]
useHistoryIndex(): number
useCanUndo(): boolean
useCanRedo(): boolean
```

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
├── ModeToggle (header)
├── [ModeView] (dynamic)
│   ├── ImmersiveView → ColorColumn[]
│   ├── ContextView → PaletteSidebar, PreviewTypeSelector, [Preview]
│   ├── MoodView → MoodSelectionPanel, RefinementSliders
│   ├── PlaygroundView → SwipeCards
│   └── GradientView → GradientPreview, GradientControls
├── ActionBar
│   ├── HarmonySelector
│   ├── UndoRedoButtons
│   ├── SaveButton
│   └── UtilityButtons
└── [Modals] (lazy loaded)
    ├── ExportModal
    ├── AccessibilityPanel
    ├── PricingModal
    ├── ImportModal
    ├── ImageDropZone
    └── HistoryBrowser
```

### Shared UI Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `ColorEditButton` | Color picker with suggestions | `src/components/ui/` |
| `HydrationLoader` | SSR hydration loading state | `src/components/ui/` |
| `ModePageLayout` | Common mode wrapper | `src/components/layout/` |

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
| `1-5` | Copy color hex | `enableCopy` |
| `Shift+1-5` | Toggle lock | `enableLock` |
| `C` | Copy all | `enableCopy` |
| `R` | Shuffle | `enableBatchOps` |
| `I` | Invert | `enableBatchOps` |
| `D` | Desaturate | `enableBatchOps` |
| `V` | Vibrant | `enableBatchOps` |
| `H` | History | `enableBatchOps` |
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
- **No user data stored server-side** - Privacy by design
- **URL params validated** - Before use in share URLs
- **Stripe webhook signature verification** - Prevents fake events

---

## Related Docs

- [Product Overview](/docs/HUEGO.md) - Vision and features
- [Session Start](/docs/SESSION-START.md) - Quick dev reference
- [Changelog](/docs/CHANGELOG.md) - Version history
