# HueGo - Technical Architecture

> Detailed technical documentation for developers and AI agents.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App Router                        │
├─────────────────────────────────────────────────────────────────┤
│  /immersive    /context      /mood        /play      /p/[id]   │
│      │             │           │            │            │       │
│      └─────────────┴───────────┴────────────┴────────────┘       │
│                              │                                   │
│                    ┌─────────▼─────────┐                        │
│                    │   Zustand Store   │                        │
│                    │   (palette.ts)    │                        │
│                    └─────────┬─────────┘                        │
│                              │                                   │
│              ┌───────────────┼───────────────┐                  │
│              │               │               │                   │
│      ┌───────▼───────┐ ┌─────▼─────┐ ┌──────▼──────┐           │
│      │  colors.ts    │ │generate.ts│ │   mood.ts   │           │
│      │ (conversions) │ │(algorithms)│ │  (mapping)  │           │
│      └───────────────┘ └───────────┘ └─────────────┘           │
│                              │                                   │
│                    ┌─────────▼─────────┐                        │
│                    │   localStorage    │                        │
│                    │   (persistence)   │                        │
│                    └───────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Color Engine (`src/lib/colors.ts`)

### Color Spaces

HueGo uses multiple color spaces for different purposes:

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

This means a palette generated in OKLCH will have balanced visual weights.

### Key Functions

```typescript
// Color space conversions
hexToRgb(hex: string): RGB
rgbToHex(rgb: RGB): string
rgbToHsl(rgb: RGB): HSL
hslToRgb(hsl: HSL): RGB
rgbToOklch(rgb: RGB): OKLCH
oklchToRgb(oklch: OKLCH): RGB

// Utilities
getContrastColor(rgb: RGB): "white" | "black"
getContrastRatio(rgb1: RGB, rgb2: RGB): number
getLuminance(rgb: RGB): number
createColor(hex: string): Color  // Creates full Color object

// Gamut handling
isInGamut(oklch: OKLCH): boolean
forceInGamut(oklch: OKLCH): OKLCH  // Reduces chroma until valid
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
  locked: (Color | null)[],  // Locked colors preserved
  size: number = 5
): Color[]
```

1. Determine base hue (from locked color or random)
2. Apply harmony algorithm to calculate target hues
3. Generate OKLCH values within aesthetic constraints
4. Force all colors into sRGB gamut
5. Sort by lightness for visual balance
6. Convert to full Color objects

### Aesthetic Constraints

- Lightness: 0.3 - 0.85 (avoid pure black/white)
- Chroma: 0.05 - 0.2 (avoid gray or oversaturated)
- Hue variance based on harmony type

---

## State Management (`src/store/palette.ts`)

### Store Structure

```typescript
interface PaletteState {
  // Current state
  colors: Color[];           // 5 colors
  locked: boolean[];         // Per-color locks
  mode: Mode;                // Current UI mode
  harmonyType: HarmonyType;  // Generation algorithm

  // History (for undo/redo)
  history: Palette[];        // Up to 50 states
  historyIndex: number;      // Current position

  // Saved palettes
  savedPalettes: Palette[];  // Up to 10 (free tier)

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
}
```

### Persistence

Uses Zustand's `persist` middleware:

```typescript
persist(
  (set, get) => ({ ... }),
  {
    name: "huego-palette",
    partialize: (state) => ({
      colors: state.colors,
      locked: state.locked,
      mode: state.mode,
      harmonyType: state.harmonyType,
      savedPalettes: state.savedPalettes,
      // Note: history NOT persisted (keep localStorage small)
    }),
  }
)
```

---

## Mood System (`src/lib/mood.ts`)

### Mood Profiles

Each mood defines color generation constraints:

```typescript
interface MoodProfile {
  id: string;
  name: string;
  hueRange: [number, number];        // Allowed hue range
  saturationRange: [number, number]; // OKLCH chroma range
  lightnessRange: [number, number];  // OKLCH lightness range
  hueVariance: number;               // Spread within palette
}
```

### Available Moods

| Mood | Hue Range | Characteristics |
|------|-----------|-----------------|
| Calm | 180-240 (blues) | Low saturation, high lightness |
| Bold | 0-360 (any) | High saturation, medium lightness |
| Playful | 280-60 (pink-yellow) | High saturation, bright |
| Professional | 200-260 (blue) | Medium saturation, varied lightness |
| Warm | 15-50 (orange) | Warm tones, comfortable |
| Cool | 170-250 (cyan-blue) | Cool tones, fresh |
| Retro | 20-60 (orange-yellow) | Desaturated, vintage feel |
| Futuristic | 240-300 (purple-pink) | High saturation, tech feel |
| Natural | 60-150 (green) | Earthy, organic |
| Urban | 0-360 (any) | Very low saturation, dark |
| Luxurious | 260-320 (purple) | Rich, deep colors |
| Minimal | 0-360 (any) | Very low saturation, clean |

### Refinement Sliders

Three parameters adjust any mood:

- **Temperature**: -1 (cooler) to +1 (warmer) - shifts hue
- **Vibrancy**: -1 (subtle) to +1 (vibrant) - scales chroma
- **Brightness**: -1 (dark) to +1 (light) - shifts lightness

---

## URL Sharing (`src/lib/share.ts`)

### Encoding Scheme

Palettes are shared via URL-safe encoding:

```
/p/FF5733-C70039-900C3F-581845-FFC300
     │       │       │       │       └─ Color 5
     │       │       │       └───────── Color 4
     │       │       └─────────────── Color 3
     │       └────────────────────── Color 2
     └─────────────────────────── Color 1
```

### Functions

```typescript
encodePalette(colors: Color[]): string    // Colors → URL segment
decodePalette(encoded: string): Color[]   // URL segment → Colors
generateShareUrl(colors: Color[]): string // Full shareable URL
copyShareUrl(colors: Color[]): Promise<boolean>
```

---

## Component Architecture

### Mode Pages

Each mode follows the same pattern:

```tsx
// src/app/[mode]/page.tsx
"use client";

export default function ModePage() {
  const [mounted, setMounted] = useState(false);

  useKeyboard({ /* options */ });

  useEffect(() => setMounted(true), []);

  if (!mounted) return <Loading />;

  return (
    <>
      <ModeToggle />
      <ModeView />     {/* Mode-specific component */}
      <ActionBar />
    </>
  );
}
```

### Shared Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `ModeToggle` | Mode switcher in header | All modes |
| `ActionBar` | Bottom bar with actions | All modes |
| `useKeyboard` | Keyboard shortcut handler | All modes |

### Mode-Specific Components

| Mode | Main Component | Sub-Components |
|------|----------------|----------------|
| Immersive | `ImmersiveView` | `ColorColumn` |
| Context | `ContextView` | `WebsitePreview`, `MobileAppPreview`, `DashboardPreview` |
| Mood | `MoodView` | (inline) |
| Playground | `PlaygroundView` | (inline) |

---

## Animation Patterns

Using Framer Motion throughout:

### Color Transitions
```tsx
<motion.div
  style={{ backgroundColor: color.hex }}
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: index * 0.05, duration: 0.3 }}
/>
```

### Mode Toggle Indicator
```tsx
<motion.div
  layoutId="activeMode"  // Shared layout animation
  transition={{ type: "spring", bounce: 0.2 }}
/>
```

### Swipe Cards (Playground)
```tsx
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.7}
  onDragEnd={handleDragEnd}
  exit={{ x: exitX, rotate: exitX > 0 ? 15 : -15 }}
/>
```

---

## Performance Considerations

### Current Optimizations

1. **Zustand selectors** - Prevent unnecessary re-renders
   ```typescript
   export const useColors = () => usePaletteStore((state) => state.colors);
   ```

2. **Client-side only** - All modes use `"use client"` + mounted check to prevent hydration mismatch

3. **Lazy color generation** - Colors only generated when needed

4. **Minimal localStorage** - History not persisted

### Future Optimizations (Sprint 3)

- Memoize color conversions
- Virtualize long lists (saved palettes)
- Optimize animation performance
- Add loading states for heavy operations

---

## Testing Strategy

### Manual Testing Checklist

1. **Palette Generation**
   - [ ] All 6 harmony types work
   - [ ] Locked colors preserved
   - [ ] No out-of-gamut colors

2. **Mode Switching**
   - [ ] Palette persists across modes
   - [ ] No flash/flicker during transition
   - [ ] Mode toggle updates correctly

3. **Persistence**
   - [ ] Palette survives page refresh
   - [ ] Saved palettes persist
   - [ ] Mode preference persists

4. **Sharing**
   - [ ] URL encoding works
   - [ ] Shared links load correctly
   - [ ] Invalid URLs handled gracefully

5. **Mobile**
   - [ ] All modes responsive
   - [ ] Touch interactions work
   - [ ] No horizontal scroll

---

## Error Handling

### Current Approach

- Color parsing: Returns `null` for invalid input
- Out-of-gamut: `forceInGamut()` reduces chroma
- Invalid share URLs: Error page with "Start Fresh" option

### Future Improvements

- Add error boundaries per mode
- Better error messages
- Telemetry for errors (post-MVP)

---

## Security Considerations

- No user data stored server-side
- No authentication (MVP)
- URL params validated before use
- No external API calls

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Environment Variables

None required for MVP.

Future (monetization):
- `NEXT_PUBLIC_STRIPE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_ADSENSE_ID`
