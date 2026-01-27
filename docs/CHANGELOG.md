# HueGo Changelog

All notable changes to this project will be documented in this file.

---

## [0.21.0] - 2026-01-27

### Phase 14: Palette Layout Toggle + UI Polish

Added toggleable layout for full-screen palette views. Users can switch between vertical columns (default) and horizontal strips in both Immersive and Mood Editor. Preference persists via localStorage. Also fixed navigation bar visual inconsistencies.

#### Added

**Layout Toggle** (`src/components/ui/LayoutToggle.tsx`)
- Toggle button to switch between vertical columns and horizontal strips
- Animated icon rotates 90° to indicate current layout
- Appears in top-right of Immersive view and in Mood Editor header bar

**Palette Layout State** (`src/store/ui.ts`)
- `paletteLayout: "columns" | "strips"` state with Zustand persist middleware
- `togglePaletteLayout()` action
- `usePaletteLayout()` selector hook
- Persisted to localStorage under `huego-ui` key

**ColorColumn Orientation** (`src/components/modes/immersive/ColorColumn.tsx`)
- `orientation` prop: `"vertical"` (default) or `"horizontal"`
- Horizontal mode: drag direction switches to vertical axis
- Action pill repositioned to bottom-center in strip mode
- Lock indicator moves to right side of strip
- Index indicator moves to left side of strip
- Mobile tap hint repositioned for strip layout

#### Changed

**ImmersiveView** (`src/components/modes/immersive/ImmersiveView.tsx`)
- Reads `paletteLayout` from UI store
- Passes `orientation` prop to all ColorColumn instances
- Strips mode applies `pt-16 pb-20` padding for header/command bar clearance
- Layout toggle positioned below navigation bar

**MoodEditor** (`src/components/modes/mood/MoodEditor.tsx`)
- Reads `paletteLayout` from UI store
- Passes `orientation` prop to all ColorColumn instances
- Layout toggle replaces empty spacer in header bar

#### Fixed

**ModeSelector** (`src/components/Navigation/ModeSelector.tsx`)
- Removed `bg-command-bg`, `backdrop-blur-md`, `border border-command-border` from button
- Changed `rounded-lg` to `rounded-full` to match parent pill container
- Eliminates nested rectangle-inside-pill border mismatch

**Mode Icons** (`src/components/ModeToggle.tsx`)
- Increased `rx` from `2` to `4` on Immersive, Gradient, and Play mode icons
- More rounded rectangle shape harmonizes with pill-shaped UI

#### Technical

**New Files (1)**
```
src/components/ui/LayoutToggle.tsx
```

**Modified Files (6)**
```
src/store/ui.ts
src/components/modes/immersive/ColorColumn.tsx
src/components/modes/immersive/ImmersiveView.tsx
src/components/modes/mood/MoodEditor.tsx
src/components/Navigation/ModeSelector.tsx
src/components/ModeToggle.tsx
```

---

## [0.20.0] - 2026-01-26

### Phase 13: Mood Mode Consolidation + Global Shade Control

Consolidated Mood Editor to reuse ColorColumn from Immersive mode, providing full functionality (lock, drag, remove, shades, save, info). Added global shade controller to shift entire palette to any Tailwind shade level.

#### Added

**Global Shade Control** (`src/components/CommandCenter/ShadeBar.tsx`)
- Visible in main CommandBar (not hidden in ... menu)
- Compact preview strip showing 5 shade levels
- Dropdown with all 11 shades (50-950)
- One-click shifts entire palette to target shade
- Toast feedback on shade change

**ShadeSlider Component** (`src/components/CommandCenter/ShadeSlider.tsx`)
- Also available in CommandPanel (... menu)
- Visual shade strip with selection indicator
- Detects average shade of current palette

**Palette Store Action** (`src/store/palette.ts`)
- `shiftToShade(shade: ShadeLevel)` - shifts all colors to specified shade
- Uses `getShade()` from shade-scale library

**Refinement-to-Colors Function** (`src/lib/mood.ts`)
- `applyRefinementsToColors(colors, refinements)` - applies temp/vibrancy/brightness to existing colors
- Enables smooth slider transitions without palette regeneration

#### Changed

**MoodEditor** (`src/components/modes/mood/MoodEditor.tsx`)
- Now uses `ColorColumn` from Immersive mode
- Full action pill: lock, drag, remove, copy, shades, save, info
- Removed custom `ColorEditorColumn` (133 lines deleted)
- Added `ColorInfoPanel` for color psychology
- Removed "Apply Palette" button (writes directly to store)
- Added `disableLayoutAnimation` for smooth color transitions

**MoodView** (`src/components/modes/mood/MoodView.tsx`)
- Removed local `editorColors` state
- Writes directly to global store via `setColors()`
- Stores base palette in ref for smooth refinement sliders
- Syncs base when external changes detected (e.g., shade shift)
- Refinement sliders now transform colors smoothly (no regeneration)

**ColorColumn** (`src/components/modes/immersive/ColorColumn.tsx`)
- Added `disableLayoutAnimation` prop
- Disables Framer Motion layout animations when true
- Added `transition-colors duration-200` for smooth color changes
- ShadePopover no longer closes on mouse leave

**RefinementSliders** (`src/components/modes/mood/RefinementSliders.tsx`)
- Repositioned above CommandCenter (bottom: 5rem + safe area)
- Prevents overlap with CommandCenter controls

**ShadePopover** (`src/components/ui/ShadePopover.tsx`)
- Now uses React portal to document.body
- Escapes transformed ancestor context (fixed positioning works correctly)
- Added `max-w-[90vw]` and horizontal scroll for narrow screens

**MoodCard** (`src/components/modes/mood/MoodCard.tsx`)
- Simplified hover state (removed hex code overlay)
- Added `cursor-pointer` for hand cursor
- Subtle lift + scale on hover

**CommandCenter** (`src/components/CommandCenter/index.tsx`)
- No longer hidden in Mood edit mode
- ShadeBar visible in main CommandBar

#### Technical

**New Files (2)**
```
src/components/CommandCenter/ShadeBar.tsx
src/components/CommandCenter/ShadeSlider.tsx
```

**Architecture**
- Mood Editor now shares ColorColumn with Immersive mode (DRY)
- Global palette actions (shade, lock, save) work across all modes
- Refinement sliders work as transforms, not regenerators

---

## [0.19.0] - 2026-01-26

### Phase 12: Mood Mode Redesign - Grid of Palette Cards

Complete redesign of Mood mode from sidebar list to Coolors-style grid of rectangular palette cards. Clicking a card expands it into a full edit view with refinement sliders.

#### Added

**Palette Cache Hook** (`src/hooks/useMoodPaletteCache.ts`)
- Pre-generates palettes for all moods in selected category
- Caches results to avoid regeneration on category switch
- `getPalette(moodId)` returns cached or generates on-demand
- `regenerate(moodId)` forces new palette generation
- Uses `useRef` for on-demand cache to avoid render-time setState

**MoodCard Component** (`src/components/modes/mood/MoodCard.tsx`)
- 5 horizontal color stripes display (flex-col layout)
- Mood name + icon below card
- Hover: scale(1.02) + shadow + hex codes overlay
- Responsive card heights (h-24 sm:h-28)

**MoodGrid Component** (`src/components/modes/mood/MoodGrid.tsx`)
- Responsive grid: 1 col mobile, 2 sm, 3 lg, 4 xl
- Filters moods by selected category
- AnimatePresence for smooth card transitions

**MoodHeader Component** (`src/components/modes/mood/MoodHeader.tsx`)
- Title "How should it feel?" with mood icon
- Horizontal scrolling category tabs with icons
- Fade indicators for scroll overflow
- Extracted from MoodSelectionPanel

**MoodEditor Component** (`src/components/modes/mood/MoodEditor.tsx`)
- Full-screen expanded view with 5 vertical color columns
- Top bar: Back button, mood name/icon, Apply Palette button
- Each column shows hex code, color name, edit button
- Click column to open color picker
- Copy hex on click with "Copied!" feedback
- 150ms soft fade transition on color changes

**UI Store** (`src/store/ui.ts`)
- `hideCommandCenter` state for global command bar visibility
- Used by MoodView to hide command bar during edit mode

#### Changed

**RefinementSliders** (`src/components/modes/mood/RefinementSliders.tsx`)
- Added `variant?: 'sidebar' | 'overlay'` prop
- `overlay` variant: Horizontal layout, fixed bottom, safe area padding
- 3-column slider grid on desktop, stacked on mobile
- Regenerate button inline with sliders

**MoodView** (`src/components/modes/mood/MoodView.tsx`)
- Complete rewrite as state orchestrator
- Two view states: `browse` (grid) and `edit` (editor)
- Manages category, mood selection, refinements, editor colors
- Uses LayoutGroup + AnimatePresence for view transitions
- Sets `hideCommandCenter` when in edit mode

**CommandCenter** (`src/components/CommandCenter/index.tsx`)
- Now respects `hideCommandCenter` from UI store
- AnimatePresence wrapper for smooth show/hide

#### Removed

**MoodSelectionPanel** (`src/components/modes/mood/MoodSelectionPanel.tsx`)
- Functionality split into MoodHeader, MoodGrid, MoodCard

#### Technical

**New Files (6 total)**
```
src/hooks/useMoodPaletteCache.ts
src/components/modes/mood/MoodHeader.tsx
src/components/modes/mood/MoodGrid.tsx
src/components/modes/mood/MoodCard.tsx
src/components/modes/mood/MoodEditor.tsx
src/store/ui.ts
```

**Modified Files (3 total)**
```
src/components/modes/mood/MoodView.tsx
src/components/modes/mood/RefinementSliders.tsx
src/components/CommandCenter/index.tsx
```

**Deleted Files (1 total)**
```
src/components/modes/mood/MoodSelectionPanel.tsx
```

- Build passes with no errors
- No render-time setState issues (fixed with useRef pattern)
- Command center hidden during mood edit to prevent UI overlap
- 150ms CSS transition for smooth color updates on slider changes

---

## [0.18.0] - 2026-01-26

### Phase 11: Expanded Mood Presets with Categories

Massive expansion of mood-based palette generation from 12 to 64 moods, organized in 7 tabbed categories. Makes HueGo the definitive mood-based palette tool.

#### Added

**Mood Category System** (`src/lib/mood.ts`)
- `MoodCategory` type: emotions, seasons, nature, aesthetics, industry, cultural, abstract
- `MOOD_CATEGORIES` array with category metadata (id, name, icon)
- `category` field added to `MoodProfile` interface
- `getMoodsByCategory(category)` helper function
- `getMoodsGroupedByCategory()` helper for category mapping

**64 Mood Profiles** (`src/lib/mood.ts`)
- **Emotions & Feelings (10)**: Calm, Bold, Playful, Energetic, Serene, Mysterious, Romantic, Melancholy, Joyful, Hopeful
- **Seasons & Time (10)**: Spring, Summer, Autumn, Winter, Sunrise, Sunset, Golden Hour, Midnight, Twilight, Overcast
- **Nature & Elements (10)**: Natural, Ocean, Forest, Desert, Tropical, Arctic, Mountain, Meadow, Volcanic, Coastal
- **Aesthetics & Eras (12)**: Retro, Futuristic, Minimal, Art Deco, Cyberpunk, Cottagecore, Y2K, Scandinavian, Mid-Century, Bohemian, Industrial, Vaporwave
- **Industry & Brand (10)**: Professional, Healthcare, Tech Startup, Fashion, Food & Beverage, Finance, Creative Agency, Wellness, Education, Luxury Brand
- **Cultural & Regional (8)**: Japanese, Mediterranean, Nordic, Moroccan, Parisian, Tropical Paradise, Southwestern, Coastal New England
- **Abstract & Conceptual (4)**: Urban, Luxurious, Warm, Cool

**Mood Icons Library** (`src/lib/mood-icons.tsx`)
- 64 unique SVG icons (20x20, stroke-based, currentColor)
- `moodIcons` record with icons for each mood ID
- `moodColors` record with 3 representative preview colors per mood

**Category Tabs UI** (`src/components/modes/mood/MoodSelectionPanel.tsx`)
- Horizontal scrolling category tabs with icons
- Fade indicators for scroll overflow on mobile
- Tab icons for each category (heart, sun, leaf, palette, briefcase, globe, shapes)
- Animated mood list filtered by selected category
- Category mood count indicator
- Smooth AnimatePresence transitions between categories

**Category State Management** (`src/components/modes/mood/MoodView.tsx`)
- `selectedCategory` state (defaults to "emotions")
- `handleCategoryChange()` clears mood selection when switching categories
- Updated subtitle: "64 moods across 7 categories"

#### Changed

**MoodSelectionPanel Props**
- Added `selectedCategory: MoodCategory` prop
- Added `onCategoryChange: (category: MoodCategory) => void` prop
- Now filters moods by category instead of showing all 64

**MoodProfile Interface**
- Added required `category: MoodCategory` field
- All 64 mood profiles include category assignment

#### Technical

**New Files (1 total)**
```
src/lib/mood-icons.tsx
```

**Modified Files (3 total)**
```
src/lib/mood.ts
src/components/modes/mood/MoodSelectionPanel.tsx
src/components/modes/mood/MoodView.tsx
```

- Build passes with no errors
- Icons follow existing style: 20x20 viewBox, stroke="currentColor", strokeWidth="1.5"
- Category tabs scroll horizontally on mobile
- Each category has curated color parameters for authentic mood representation

---

## [0.17.0] - 2026-01-25

### Phase 10: Mobile UI/UX Implementation

Comprehensive mobile fixes addressing critical usability issues: viewport configuration, touch targets, hover-only interactions, safe area handling, and dynamic viewport height.

#### Added

**Viewport Configuration** (`src/app/layout.tsx`)
- Next.js 16 `Viewport` export with proper mobile settings
- `width: "device-width"` for responsive scaling
- `initialScale: 1`, `maximumScale: 5` for zoom accessibility
- `viewportFit: "cover"` for notch/home indicator support

**Mobile CSS Utilities** (`src/app/globals.css`)
- `--safe-area-top` and `--safe-area-bottom` CSS variables using `env()`
- `.h-dvh` utility class for dynamic viewport height (100dvh)
- `.touch-target` utility class (min 44px for Apple HIG compliance)

**Mobile Action Pill Tap-Toggle** (`src/components/modes/immersive/ColorColumn.tsx`)
- `isMobile` state with resize listener (breakpoint: 768px)
- `mobileExpanded` state for tap-based pill display
- Outside tap detection to close expanded pill
- "Tap for options" hint text on mobile when collapsed
- Desktop: hover-based behavior unchanged
- Mobile: tap column to toggle action pill visibility

#### Changed

**Touch Target Sizes** (Apple HIG 44px minimum)
- `ColorSlider.tsx`: Track `h-8 md:h-5`, thumb `w-6 h-6 md:w-4 md:h-4`
- `NavigationBar.tsx`: Help button `w-11 h-11 md:w-9 md:h-9`
- `ShadePopover.tsx`: Swatches `w-11 h-14 md:w-8 md:h-12`
- `ColorColumn.tsx`: ActionButtons `min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0`
- All action icons increased from 14px to 16px

**Safe Area Handling**
- `CommandCenter/index.tsx`: Bottom uses `max(1.5rem, env(safe-area-inset-bottom))`
- `NavigationBar.tsx`: Top uses `max(1rem, env(safe-area-inset-top))`
- `ImmersiveView.tsx`: Generate and undo buttons respect safe area insets

**Dynamic Viewport Height** (Mobile browser address bar fix)
- `ImmersiveView.tsx`: `h-screen` → `h-dvh`
- `ContextView.tsx`: `h-screen` → `h-dvh`
- `MoodView.tsx`: `h-screen` → `h-dvh`
- `PlaygroundView.tsx`: `h-screen` → `h-dvh`

**Dropdown Overflow Fix**
- `ModeSelector.tsx`: `w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[220px] max-w-[280px]`

#### Technical

**Modified Files (12 total)**
```
src/app/layout.tsx
src/app/globals.css
src/components/modes/immersive/ColorColumn.tsx
src/components/ui/ColorSlider.tsx
src/components/ui/ShadePopover.tsx
src/components/Navigation/NavigationBar.tsx
src/components/Navigation/ModeSelector.tsx
src/components/CommandCenter/index.tsx
src/components/modes/immersive/ImmersiveView.tsx
src/components/modes/context/ContextView.tsx
src/components/modes/mood/MoodView.tsx
src/components/modes/playground/PlaygroundView.tsx
```

- Build passes with no new errors
- All touch targets ≥44px on mobile
- No content behind notch/home indicator
- No layout shift with mobile browser address bar

---

## [0.16.0] - 2026-01-25

### Phase 9: Coolors-style Color Column Actions

Added Coolors-style functionality to the ColorColumn component in Immersive mode, including remove color, shade popover, saved/favorite colors, drag-to-reorder, and an Apple/Notion-inspired contextual action pill UI.

#### Added

**Saved Colors System** (`src/store/palette.ts`)
- `savedColors: Color[]` state persisted to localStorage
- `toggleSaveColor(color, isPremium)` - Toggle save/unsave with limit check
- `isSavedColor(hex)` - Check if a color is saved
- `deleteSavedColor(hex)` - Remove from saved colors
- `useSavedColors()` selector hook for reactive updates

**Feature Limits** (`src/lib/feature-limits.ts`)
- `FREE_SAVED_COLORS_LIMIT = 10` constant
- `PREMIUM_SAVED_COLORS_LIMIT = Infinity` constant
- `getSavedColorsLimit(isPremium)` helper function

**Remove Color at Index** (`src/store/palette.ts`)
- `removeColorAt(index)` - Remove specific color (respects min 2 colors)
- Properly updates both `colors` and `locked` arrays

**Shade Popover Component** (`src/components/ui/ShadePopover.tsx`)
- Frosted glass floating popover with 11-shade scale (50-950)
- Uses existing `generateShadeScaleWithBase()` from `shade-scale.ts`
- Click any shade to copy hex with checkmark feedback
- Base shade indicated with ring highlight
- Hover tooltips showing hex codes
- Closes on click outside or Escape key
- Spring animations for entrance/exit

**Contextual Action Pill** (`src/components/modes/immersive/ColorColumn.tsx`)
- Floating horizontal pill below hex code, appears on column hover
- Frosted glass effect with backdrop blur and subtle border
- 6 action icons in a row:
  1. **X** - Remove color (disabled at min 2 colors)
  2. **Half-circle** - Toggle shade popover
  3. **Heart** - Toggle saved/favorite (fills when saved)
  4. **6-dot grip** - Drag handle for reordering
  5. **Copy** - Copy hex code
  6. **Info (i)** - Color psychology panel
- Icons scale on hover (1.1x), spring animations
- Lock icon moved to top-right corner (always visible when locked)

**Drag-to-Reorder** (`src/components/modes/immersive/ColorColumn.tsx`)
- Framer Motion drag controls with drag handle
- Only drag handle initiates drag (not entire column)
- Column scales (1.02x) and gets shadow during drag
- Calculates target position based on drag distance
- Calls existing `reorderColors(from, to)` store action

#### Changed

**ColorColumn Props** (`src/components/modes/immersive/ColorColumn.tsx`)
- Added `isSaved: boolean` - Whether color is in saved list
- Added `totalColors: number` - For min size check on remove
- Added `onToggleSave: () => void` - Save/unsave callback
- Added `onRemove: () => void` - Remove color callback
- Added `onReorder: (toIndex: number) => void` - Reorder callback

**ImmersiveView** (`src/components/modes/immersive/ImmersiveView.tsx`)
- Changed key from `index` to `${color.hex}-${index}` for stable animations
- Added `LayoutGroup` wrapper for smooth reorder animations
- Wired up all new ColorColumn props
- Uses `isSavedColor()` for reactive saved state

**Store Persistence** (`src/store/palette.ts`)
- Added `savedColors` to `partialize` for localStorage persistence

#### Technical

**New Files (1 total)**
```
src/components/ui/ShadePopover.tsx
```

**Modified Files (4 total)**
```
src/lib/feature-limits.ts
src/store/palette.ts
src/components/modes/immersive/ColorColumn.tsx
src/components/modes/immersive/ImmersiveView.tsx
```

- Build passes with no errors
- All new code lints clean
- Action pill uses framer-motion spring animations
- Shade popover reuses existing shade-scale library

---

## [0.15.0] - 2026-01-25

### Phase 8: Enhanced Tailwind Export

Professional-grade Tailwind export matching Coolors' functionality. Adds version selection (v3/v4), color space options (Hex/OKLCH/RGB/HSL), and improved Export button visibility across the app.

#### Added

**Tailwind Export Types** (`src/lib/export.ts`)
- `TailwindVersion` type: `"v3" | "v4"`
- `ColorSpace` type: `"hex" | "oklch" | "rgb" | "hsl"`
- `TailwindExportOptions` interface for configuring exports

**New Export Functions** (`src/lib/export.ts`)
- `exportTailwindWithOptions()` - Main export function with version/color space support
- `exportTailwindV3()` - JS `module.exports` format for Tailwind v3
- `exportTailwindV4()` - CSS `@theme` format for Tailwind v4
- `formatColorValue()` - Converts hex to any color space (OKLCH, RGB, HSL)
- `slugifyColorName()` - Converts color names to URL-safe slugs (e.g., "Deep Blue" → "deep-blue")

**Export Modal Options Panel** (`src/components/ExportModal.tsx`)
- Dedicated "Tailwind Options" section in sidebar when Tailwind format selected
- Version toggle: v3 (JS Config) / v4 (CSS Theme)
- Color space selector: Hex / OKLCH / RGB / HSL (2x2 grid)
- Shade scale toggle with descriptive labels ("Full scale 50-950" vs "Single color only")
- Wider sidebar (56 units) to accommodate options

**Prominent Export Button**
- `CommandBar.tsx` - Added labeled Export button with indigo→purple gradient
- `UtilityButtons.tsx` - Promoted Export to labeled button, secondary actions to overflow menu
- Export now visible without clicking "..." menu in both ActionBar and CommandCenter

#### Changed

**ExportModal UI** (`src/components/ExportModal.tsx`)
- Tailwind options moved from inline row to dedicated sidebar section
- File extension display updates dynamically (.css for v4, .js for v3)
- `handleCopy()` now copies preview content directly (respects all options)
- `handleDownload()` generates correct file type based on version

**CommandBar** (`src/components/CommandCenter/CommandBar.tsx`)
- Added `onExport` prop for direct export access
- Export button styled with gradient to stand out from other actions

**UtilityButtons** (`src/components/ActionBar/UtilityButtons.tsx`)
- Export promoted to labeled gradient button
- Import, Extract, Accessibility, Publish moved to overflow menu
- AI Assistant and Share remain visible as primary actions

#### Output Formats

**v3 + Hex (with shades):**
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'deep-blue': {
          50: '#e6f0ff',
          100: '#cce0ff',
          // ...
          DEFAULT: '#1e3a8a',
        },
      }
    }
  }
}
```

**v4 + OKLCH (with shades):**
```css
@theme {
  --color-deep-blue-50: oklch(0.970 0.050 265.0);
  --color-deep-blue-100: oklch(0.930 0.080 265.0);
  /* ... */
  --color-deep-blue: oklch(0.372 0.125 265.8);
}
```

#### Technical

**Modified Files (4 total)**
```
src/lib/export.ts
src/components/ExportModal.tsx
src/components/CommandCenter/CommandBar.tsx
src/components/CommandCenter/index.tsx
src/components/ActionBar/UtilityButtons.tsx
```

- Uses existing `hexToRgb`, `hexToHsl`, `hexToOklch` from `colors.ts`
- Color names slugified for valid CSS/JS identifiers
- All 8 combinations (2 versions × 4 color spaces) supported
- Build passes with no errors

---

## [0.14.0] - 2026-01-25

### Phase 7: Context Mode Enhancement

Comprehensive upgrade to Context mode matching/exceeding Coolors' Tailwind page. Adds Tailwind-compatible shade scale generation, light/dark preview toggle, 4 new UI component previews, and color adjustment sliders.

#### Added

**Shade Scale Generation** (`src/lib/shade-scale.ts`)
- Tailwind-compatible 50-950 shade scale generation using OKLCH color space
- `generateShadeScale(hex)` - Creates 11 shades from any base color
- `detectShadeLevel(hex)` - Identifies which shade level (50-950) a color matches
- `generateShadeScaleWithBase(hex)` - Returns scale with base shade info
- `getShade(hex, level)` - Get specific shade from base color
- `getContrastingShades()` - Suggests text colors for backgrounds
- `shadeScaleToCSS()` - Export shades as CSS custom properties
- Chroma adjustment factors per shade level for perceptually uniform results

**Types** (`src/lib/types.ts`)
- `ShadeScale` interface for 50-950 shade mapping
- `ShadeLevel` type for shade level keys

**Preview Utilities** (`src/components/modes/context/previewUtils.ts`)
- `getPreviewColors()` - Theme-aware color extraction from palette
- Light mode: Uses palette colors directly
- Dark mode: Uses shade scales to generate darker variants
- Returns: primary, secondary, accent, background, surface, text colors

**New Preview Components** (`src/components/modes/context/previews/`)
- `ButtonStatesPreview.tsx` - Button grid with solid/outline variants, hover/active/disabled states
- `FormControlsPreview.tsx` - Text inputs, checkboxes, toggles, select dropdowns with focus states
- `PricingCardsPreview.tsx` - 3-tier pricing cards (Basic, Pro highlighted, Enterprise)
- `StatsCardsPreview.tsx` - Metric cards with trends, progress bars, quick stats list

**Color Slider Component** (`src/components/ui/ColorSlider.tsx`)
- Reusable slider with gradient background support
- Pointer event handling for smooth drag
- Value display with customizable units

#### Changed

**PreviewTypeSelector** (`src/components/modes/context/PreviewTypeSelector.tsx`)
- Added 4 new preview types: Buttons, Forms, Pricing, Stats (7 total)
- Added `PreviewTheme` type (`'light' | 'dark'`)
- Added theme toggle button with sun/moon icons
- Redesigned as horizontal nav bar with clear visual separation from main menu
- Container with `bg-zinc-800/80`, rounded corners, border styling
- Vertical divider between preview types and theme toggle

**ContextView** (`src/components/modes/context/ContextView.tsx`)
- Added `previewTheme` state for light/dark toggle
- Imports and renders all 7 preview components
- Passes `theme` prop to all preview components

**PaletteSidebar** (`src/components/modes/context/PaletteSidebar.tsx`)
- Added `ShadeScaleDisplay` component showing 11-shade grid per color
- Added `ColorSliders` component with Hue/Saturation/Lightness controls
- Expandable sections for shade scales and sliders
- Real-time preview updates when adjusting sliders

**Existing Preview Components** (WebsitePreview, MobileAppPreview, DashboardPreview)
- Added `theme: PreviewTheme` prop
- Updated to use `getPreviewColors()` for theme-aware styling
- Both light and dark modes now render correctly

**Export System** (`src/lib/export.ts`)
- Added `exportTailwindWithShades()` function
- Generates full Tailwind config with 11 shades per color plus DEFAULT
- Format: `primary: { 50: '#...', 100: '#...', ..., 950: '#...', DEFAULT: '#...' }`

**ExportModal** (`src/components/ExportModal.tsx`)
- Added "Include shade scales" toggle for Tailwind export
- Conditionally uses `exportTailwindWithShades()` when enabled

#### Technical

**New Files (7 total)**
```
src/lib/shade-scale.ts
src/components/modes/context/previewUtils.ts
src/components/modes/context/previews/ButtonStatesPreview.tsx
src/components/modes/context/previews/FormControlsPreview.tsx
src/components/modes/context/previews/PricingCardsPreview.tsx
src/components/modes/context/previews/StatsCardsPreview.tsx
src/components/ui/ColorSlider.tsx
```

**Modified Files (9 total)**
```
src/lib/types.ts
src/lib/export.ts
src/components/ExportModal.tsx
src/components/modes/context/ContextView.tsx
src/components/modes/context/PreviewTypeSelector.tsx
src/components/modes/context/PaletteSidebar.tsx
src/components/modes/context/WebsitePreview.tsx
src/components/modes/context/MobileAppPreview.tsx
src/components/modes/context/DashboardPreview.tsx
```

- Algorithm: OKLCH for perceptually uniform shade generation
- Shade lightness targets derived from Tailwind's default palette analysis
- Chroma factors: 0.25 (50) → 1.0 (500) → 0.45 (950)
- `forceInGamut()` ensures all shades are valid sRGB
- Build passes with no errors
- All 7 preview types support light/dark modes

---

## [0.13.0] - 2026-01-25

### Phase 6: Named Colors Database

Replaced the limited algorithmic color naming system (~84 names like "Muted Yellow") with a proper named colors database (~1,552 names like "Coral", "Crimson", "Lavender Blush") using perceptually uniform OKLab color matching.

#### Added

**Named Colors Database** (`src/lib/color-names/`)
- `database.ts` - 1,552 colors from "Name That Color" with pre-computed OKLab values (~140KB)
- `search.ts` - OKLab Euclidean distance matching algorithm
- `index.ts` - Barrel export for the module

**Generator Script** (`scripts/generate-color-database.ts`)
- Node script to generate database.ts from raw color data
- Computes OKLab values at build time for runtime performance
- Run with `npx tsx scripts/generate-color-database.ts`

#### Changed

**Two-Tier Color Naming System** (`src/lib/colors.ts`)
- `generateColorName()` now accepts optional RGB parameter
- Tier 1: Database lookup - finds closest named color within distance threshold (0.12)
- Tier 2: Enhanced algorithmic fallback - 24+ hue names with contextual modifiers
- `createColor()` now passes RGB to enable database lookup

**Example Improvements**

| Hex | Before | After |
|-----|--------|-------|
| #FF7F50 | Bright Coral | Coral |
| #DC143C | Vivid Red | Crimson |
| #F0F8FF | Pastel Blue | Alice Blue |
| #E6E6FA | Light Blue | Lavender |
| #8B9846 | Muted Yellow | Olive Haze |
| #DBDBF1 | Light Blue | Fog |
| #2E8B57 | Bright Emerald | Sea Green |

#### Technical

**New Files (4 total)**
```
scripts/generate-color-database.ts
src/lib/color-names/database.ts
src/lib/color-names/search.ts
src/lib/color-names/index.ts
```

**Modified Files (1 total)**
```
src/lib/colors.ts
```

- Algorithm: OKLab Euclidean distance (perceptually uniform)
- Distance threshold: 0.12 for "close enough" matches
- Performance: ~0.1ms per lookup (linear search through 1,552 colors)
- Bundle impact: ~15-20KB gzipped
- Build passes with no errors
- All exports (JSON, PDF, PNG, ASE) use the new naming system

---

## [0.12.0] - 2026-01-24

### Phase 5: V2 UI/UX Redesign

Complete redesign of navigation and action bar with Apple/Airbnb/Notion-level polish. New component architecture replacing the old ModeToggle and ActionBar.

#### Added

**Navigation System** (`src/components/Navigation/`)
- `NavigationBar.tsx` - Top bar with pill-shaped container, backdrop blur, shadow
- `ModeSelector.tsx` - Dropdown with mode cards, icons, and descriptions
- `ExploreLink.tsx` - Separate navigation for Explore (browsing, not creating)
- `KeyboardShortcuts.tsx` - Press `?` to view all shortcuts overlay
- Keyboard listener for `?` key to trigger help overlay

**Command Center** (`src/components/CommandCenter/`)
- `index.tsx` - Main orchestrator with modal state management
- `CommandBar.tsx` - Bottom bar with 5 primary actions always visible
- `CommandPanel.tsx` - Slide-up panel with grouped actions (Edit, Tools, Output)
- `CommandGroup.tsx` - Section component with title and staggered animations
- `CommandItem.tsx` - Action button with icon, label, and keyboard shortcut hint
- `GenerateButton.tsx` - Prominent white CTA with Space key hint
- `PaletteControls.tsx` - Unified size (+/-) and harmony dropdown

**Design Tokens** (`src/app/globals.css`)
- `--command-bg` - Command panel background (dark: rgba(24,24,27,0.95))
- `--command-border` - Panel border color
- `--command-hover` - Hover state background
- `--primary-cta` - Primary CTA button color (white/dark mode aware)
- `--primary-cta-text` - CTA text color

**Mood Page Improvements** (`src/components/modes/mood/`)
- Rich list view replacing cramped 4-column grid
- Mood icons for each of 12 moods
- Color preview dots (3 representative colors per mood)
- Descriptions visible (e.g., "Peaceful, serene, tranquil")
- Staggered entrance animations
- Selected state with indicator line

**Gradient Page Improvements** (`src/components/modes/gradient/`)
- Editable color dots - click to open native color picker
- Compact inline Copy button in CSS preview
- Fixed CSS property conflicts (background vs backgroundSize)
- Added bottom padding for CommandCenter clearance

#### Changed

**ModePageLayout** (`src/components/layout/ModePageLayout.tsx`)
- Now uses `NavigationBar` instead of `ModeToggle`
- Now uses `CommandCenter` instead of `ActionBar`

**ColorColumn** (`src/components/modes/immersive/ColorColumn.tsx`)
- Edit/info buttons repositioned below nav (`top-16`/`top-20`)
- Lock indicator repositioned below nav
- Icons more subtle (smaller, lower opacity by default)
- Hover to reveal full opacity
- Locked state more visible (80% opacity)

**Pro Gating** (`src/store/subscription.ts`)
- Temporarily disabled for V2 development
- `useIsPremium()` now always returns `true`

#### Deprecated

The following components are kept but no longer imported:
- `src/components/ModeToggle.tsx` - Replaced by `Navigation/`
- `src/components/ActionBar/*` - Replaced by `CommandCenter/`

#### Technical

**New Files (12 total)**
```
src/components/CommandCenter/index.tsx
src/components/CommandCenter/CommandBar.tsx
src/components/CommandCenter/CommandPanel.tsx
src/components/CommandCenter/CommandGroup.tsx
src/components/CommandCenter/CommandItem.tsx
src/components/CommandCenter/GenerateButton.tsx
src/components/CommandCenter/PaletteControls.tsx
src/components/Navigation/index.tsx
src/components/Navigation/NavigationBar.tsx
src/components/Navigation/ModeSelector.tsx
src/components/Navigation/ExploreLink.tsx
src/components/Navigation/KeyboardShortcuts.tsx
```

**Modified Files (7 total)**
```
src/app/globals.css
src/components/layout/ModePageLayout.tsx
src/components/modes/gradient/GradientView.tsx
src/components/modes/immersive/ColorColumn.tsx
src/components/modes/mood/MoodSelectionPanel.tsx
src/components/modes/mood/MoodView.tsx
src/store/subscription.ts
```

- Build passes with no errors
- 1,644 lines added across 19 files

---

## [0.11.0] - 2026-01-24

### Phase 3: AI Color Assistant

AI-powered color palette generation using Claude API. Users can describe palettes in natural language and receive professional color suggestions.

#### Added

**API Route** (`src/app/api/ai/generate/route.ts`)
- POST endpoint for Claude API integration
- Uses `claude-sonnet-4-20250514` model (fast, cost-effective)
- Rate limiting: 3/min and 10/day free, 30/min unlimited premium
- System prompt returns JSON array with hex codes and descriptive names
- Hex validation and error handling

**AI Modal Component** (`src/components/AIAssistantModal.tsx`)
- Textarea for prompt input (max 500 characters)
- Example prompt chips for inspiration (warm sunset, ocean waves, etc.)
- Loading spinner during generation
- Color preview swatches with hex codes and names
- "Apply Palette" and "Regenerate" buttons
- Purple/pink gradient accent for visual differentiation

**Store Extensions** (`src/store/palette.ts`)
- New state: `aiSuggestions`, `aiLoading`, `aiError`
- New actions: `generateAISuggestions()`, `applySuggestion()`, `clearSuggestions()`
- New selectors: `useAISuggestions()`, `useAILoading()`, `useAIError()`
- Apply preserves undo history

**UI Integration**
- AI button in ActionBar (sparkles icon with purple gradient)
- Lazy-loaded AIAssistantModal via dynamic import
- Modal accessible from UtilityButtons

#### Technical

**New Files (2 total)**
```
src/app/api/ai/generate/route.ts
src/components/AIAssistantModal.tsx
```

**Modified Files (4 total)**
```
src/store/palette.ts
src/components/ActionBar/index.tsx
src/components/ActionBar/UtilityButtons.tsx
.env.example
```

- New dependency: `@anthropic-ai/sdk`
- Build passes with no errors
- Environment variable: `ANTHROPIC_API_KEY`

---

## [0.10.0] - 2026-01-24

### Phase 3: Codebase Audit & Refactoring

Comprehensive audit addressing compartmentalization, modularization, optimization, and code cleanup. No breaking changes - internal refactoring only.

#### Fixed

**Memory Leak** (`src/components/ImageDropZone.tsx`)
- Added `URL.revokeObjectURL()` cleanup for `createObjectURL` calls
- Cleanup on unmount, error, apply, and reset actions
- Proper ref tracking to prevent stale URL references

#### Added

**Shared UI Components** (`src/components/ui/`)
- `ModalBase.tsx` - Reusable modal with backdrop, header, content, footer
- `LoadingSpinner.tsx` - Framer Motion spinner with size/variant options
- `CloseButton.tsx` - Standard close button component
- `ModalCancelButton` and `ModalPrimaryButton` helper components

**Utility Hooks** (`src/hooks/`)
- `useClipboardFeedback.ts` - Copy with visual feedback and timeout
- `useModal.ts` - Modal open/close state management
- `useToast.ts` - Toast notifications with auto-dismiss

**Shared Utilities** (`src/lib/`)
- `random.ts` - Consolidated `randomInRange()`, `randomHue()`, `normalizeHue()`, `randomHueInRange()`, `shuffleArray()`, `randomElement()`
- `color-factory.ts` - `colorFromOklch()`, `adjustLightness()`, `adjustChroma()`, `shiftHue()`, `invertLightness()`, `getComplement()`
- `file-operations.ts` - `downloadFile()`, `copyToClipboard()`, `readFileAsText()`, `readFileAsDataURL()`, `getMimeType()`
- `feature-limits.ts` - Centralized FREE_MAX, PREMIUM_MAX constants and helper functions

**Accessibility Sub-components** (`src/components/accessibility/`)
- `ContrastPanel.tsx` - WCAG contrast checking (extracted from AccessibilityPanel)
- `ColorBlindnessPanel.tsx` - Color blindness simulation (extracted from AccessibilityPanel)

**Image Extract Sub-components** (`src/components/image-extract/`)
- `DropZone.tsx` - Drag and drop zone
- `ImagePreview.tsx` - Image preview with loading state
- `ExtractedPalette.tsx` - Extracted colors display
- `HarmonizeToggle.tsx` - Harmonization toggle switch

**Error Handling** (`src/components/ErrorBoundary.tsx`)
- Global error boundary component
- Fallback UI with retry/refresh options
- Development mode error details

**Keyboard Hook Split** (`src/hooks/`)
- `useKeyboardGeneration.ts` - Spacebar generation, undo/redo
- `useKeyboardClipboard.ts` - Copy operations, number key shortcuts
- `useKeyboardBatchOps.ts` - Shuffle, invert, adjust operations

#### Changed

**Store Decoupling**
- `palette.ts` no longer directly imports `subscription.ts`
- `addColor()` and `savePalette()` now accept `isPremium` parameter
- Feature limits imported from centralized `feature-limits.ts`

**Component Optimizations**
- `ExplorePaletteCard` - Wrapped with `React.memo()`
- `ColorColumn` - Wrapped with `React.memo()`

**Modal Refactoring**
- `ImportModal` - Fully refactored to use `ModalBase`
- `ExportModal` - Uses `LoadingSpinner` and `CloseButton`
- `PublishModal` - Uses `LoadingSpinner` and `CloseButton`
- `AccessibilityPanel` - Uses `CloseButton`, composed from sub-panels
- `ImageDropZone` - Uses `LoadingSpinner`, `CloseButton`, and sub-components

**Lib File Updates**
- `generate.ts` - Uses shared `randomInRange()`, `randomHue()` from `random.ts`
- `mood.ts` - Uses shared `randomInRange()`, `normalizeHue()`, `randomHueInRange()` from `random.ts`
- `suggestions.ts` - Removed unused imports

#### Technical

**New Files (18 total)**
```
src/components/ui/ModalBase.tsx
src/components/ui/LoadingSpinner.tsx
src/components/ui/CloseButton.tsx
src/components/accessibility/ContrastPanel.tsx
src/components/accessibility/ColorBlindnessPanel.tsx
src/components/image-extract/DropZone.tsx
src/components/image-extract/ImagePreview.tsx
src/components/image-extract/ExtractedPalette.tsx
src/components/image-extract/HarmonizeToggle.tsx
src/components/ErrorBoundary.tsx
src/hooks/useClipboardFeedback.ts
src/hooks/useModal.ts
src/hooks/useToast.ts
src/hooks/useKeyboardGeneration.ts
src/hooks/useKeyboardClipboard.ts
src/hooks/useKeyboardBatchOps.ts
src/lib/random.ts
src/lib/color-factory.ts
src/lib/file-operations.ts
src/lib/feature-limits.ts
```

**Modified Files (15 total)**
```
src/components/ImageDropZone.tsx
src/components/ImportModal.tsx
src/components/ExportModal.tsx
src/components/PublishModal.tsx
src/components/AccessibilityPanel.tsx
src/components/ActionBar/PaletteSizeSelector.tsx
src/components/ActionBar/SaveButton.tsx
src/components/modes/explore/ExplorePaletteCard.tsx
src/components/modes/immersive/ColorColumn.tsx
src/hooks/useKeyboard.ts
src/store/palette.ts
src/store/subscription.ts
src/lib/generate.ts
src/lib/mood.ts
src/lib/suggestions.ts
```

- Build passes with no errors
- Lint shows only pre-existing issues (3 errors, 14 warnings)
- No breaking changes to public API

---

## [0.9.0] - 2026-01-23

### Phase 2: Community Explorer (Competitive Roadmap)

Adding community features to close the gap with Coolors.co's 10M+ palette library. Implements Supabase database, palette explorer, and publish flow.

#### Added

**Supabase Integration** (`src/lib/supabase.ts`)
- Supabase client initialization with graceful fallback
- Environment variable configuration for URL and anon key
- `isSupabaseConfigured()` helper for feature detection

**Anonymous Fingerprinting** (`src/lib/fingerprint.ts`)
- Browser-based fingerprint generation for anonymous users
- Combines screen, timezone, language, platform characteristics
- Persisted to localStorage for consistent identification
- Author display name storage for publishing

**Community Types** (`src/lib/community-types.ts`)
- `PublishedPalette` interface for database records
- `PublishPaletteRequest/Response` for API contracts
- `PaletteListResponse` with cursor-based pagination
- `LikeResponse` for toggle like operations
- `ExploreFilters` with sort, search, tags
- `MOOD_TAGS` constant for predefined tag options

**Community Store** (`src/store/community.ts`)
- Zustand store with persist middleware
- Palettes array with loading, hasMore, cursor state
- Filters management (sort, search, tags)
- Liked palette IDs (persisted locally)
- Publish count tracking for free tier limits
- Optimistic like/unlike with server sync
- Selector hooks: `usePalettes()`, `useIsLoading()`, `useHasMore()`, `useFilters()`, `useLikedPaletteIds()`, `usePublishCount()`

**API Routes**
- `GET /api/community/palettes` - List with pagination, sorting (newest/popular/most_liked), search, tag filtering
- `POST /api/community/publish` - Publish palette with rate limiting (10/hour), duplicate detection
- `POST /api/community/palettes/[id]/like` - Toggle like with fingerprint tracking

**Explore Mode** (`/explore`)
- New mode accessible from ModeToggle (free tier)
- `ExploreView` - Main view with header, filters, grid
- `ExploreFilterBar` - Search input (debounced), sort dropdown, tag filter pills
- `ExplorePaletteGrid` - Responsive grid with infinite scroll
- `ExplorePaletteCard` - Color strip preview, metadata, like button, hover overlay with "Use Palette"

**Publish Modal** (`src/components/PublishModal.tsx`)
- Palette preview with hex codes
- Optional title input (max 50 chars)
- Optional author name input (max 30 chars, persisted)
- Tag selection (up to 5 from predefined list)
- Free tier limit display (3 publishes)
- Loading state during publish

**Database Schema** (`supabase/migrations/`)
- `published_palettes` table with JSONB colors, hex_codes array, metadata
- `palette_likes` table with unique constraint on palette_id + fingerprint
- Automatic `like_count` trigger on insert/delete
- Row Level Security policies for anonymous access
- Indexes on created_at, like_count, share_code, hex_codes (GIN)

#### Changed

- `Mode` type now includes `"explore"`
- `FREE_MODES` updated to include `"explore"`
- Added `FREE_PUBLISH_LIMIT = 3` and `PREMIUM_PUBLISH_LIMIT` constants
- `ModeToggle` includes Explore mode with compass icon
- `UtilityButtons` includes Publish button (paper plane icon)
- `ActionBar` manages PublishModal state
- Stack now includes Supabase for database

#### Technical

- New dependency: `@supabase/supabase-js`
- 14 new files created
- 6 files modified
- Supabase migration stored in `supabase/migrations/`
- Build passes with no lint errors in new files

---

## [0.8.0] - 2026-01-23

### Phase 1: Foundation Enhancements (Competitive Roadmap)

Closing competitive gaps with Coolors.co while amplifying HueGo's unique strengths. Implements variable palette sizes, dark mode, and color psychology insights.

#### Added

**Variable Palette Size** (`src/store/palette.ts`, `src/components/ActionBar/PaletteSizeSelector.tsx`)
- Dynamic palette size from 2-10 colors (was fixed at 5)
- +/- controls in ActionBar to add/remove colors
- Free tier: 2-7 colors
- Premium tier: 2-10 colors
- Keyboard shortcuts extended to 1-9 and 0 (for 10th color)
- New store actions: `setPaletteSize()`, `addColor()`, `removeColor()`
- New constants: `MIN_PALETTE_SIZE`, `MAX_PALETTE_SIZE`, `FREE_MAX_PALETTE_SIZE`, `PREMIUM_MAX_PALETTE_SIZE`

**Dark Mode Theme System** (`src/store/theme.ts`, `src/components/ThemeToggle.tsx`)
- Three theme modes: light, dark, system (auto-detect)
- CSS custom properties for comprehensive theming
- `prefers-color-scheme` media query support
- Theme persisted to localStorage
- Keyboard shortcut: `T` to toggle theme
- New variables: `--glass`, `--glass-border`, `--overlay`, `--card`, `--popover`, etc.

**Color Psychology Panel** (`src/lib/color-psychology.ts`, `src/components/ColorInfoPanel.tsx`)
- Comprehensive color psychology data for 9 color families
- Emotions, traits, use cases, and industry associations per color
- Cultural context (Western, Eastern, Universal meanings)
- Saturation effects (muted/balanced/vibrant)
- Lightness effects (dark/medium/light/pastel)
- Neutral color handling (black, gray, white)
- Info button on each color column to open psychology panel
- Slide-out panel with detailed color analysis

#### Changed

- `PaletteState` interface now includes `paletteSize` property
- `generatePalette()` respects dynamic size from store
- Keyboard shortcuts 1-9 and 0 work for variable palette sizes
- `SubscriptionStore` includes `getMaxPaletteSize()` and `canUsePaletteSize()` helpers
- `globals.css` restructured with light/dark theme variables
- `ModeToggle` now includes `ThemeToggle` component
- `ColorColumn` has new info button alongside edit button

#### Technical

- 8 new files created
- 10 files modified
- New store: `src/store/theme.ts`
- New component: `src/components/ActionBar/PaletteSizeSelector.tsx`
- New component: `src/components/ThemeToggle.tsx`
- New component: `src/components/ColorInfoPanel.tsx`
- New lib: `src/lib/color-psychology.ts`
- Build passes with no lint errors

---

## [0.7.1] - 2026-01-23

### PDF & ASE Export Formats

Added two professional export formats for premium users.

#### Added

**PDF Export** (`src/lib/export.ts`)
- Professional presentation-ready PDF generation
- Landscape A4 layout with color swatches
- Color details table (HEX, RGB, HSL, contrast)
- HueGo branding/footer
- Uses `jspdf` for client-side generation

**ASE Export** (`src/lib/export.ts`)
- Adobe Swatch Exchange binary format
- Compatible with Photoshop, Illustrator, InDesign
- UTF-16BE color names
- Proper ASEF header and RGB float values

#### Changed

- `ExportFormat` type now includes `"pdf" | "ase"`
- `PREMIUM_EXPORT_FORMATS` updated to include PDF and ASE
- `ExportModal` hides "Copy Code" button for binary formats (png, pdf, ase)

#### Technical

- New dependency: `jspdf` (client-side PDF generation)
- Build passes with no new lint errors

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
| Exports | 2 (CSS, JSON) | All 9 |
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
| Phase 1 complete | ✅ | 2026-01-23 |
| Phase 2 complete | ✅ | 2026-01-23 |
| Phase 3 (Refactoring) complete | ✅ | 2026-01-24 |
| Phase 3 (AI Assistant) complete | ✅ | 2026-01-24 |
| Phase 5 (V2 UI/UX) complete | ✅ | 2026-01-24 |
| Phase 6 (Named Colors) complete | ✅ | 2026-01-25 |
| Phase 7 (Context Mode) complete | ✅ | 2026-01-25 |
| Phase 8 (Enhanced Tailwind Export) complete | ✅ | 2026-01-25 |
| Phase 9 (Coolors-style Actions) complete | ✅ | 2026-01-25 |
| Phase 10 (Mobile UI/UX) complete | ✅ | 2026-01-25 |
| Phase 11 (Expanded Mood Presets) complete | ✅ | 2026-01-26 |

---

## Related Docs

- [Product Overview](/docs/HUEGO.md)
- [Technical Architecture](/docs/ARCHITECTURE.md)
- [Session Start Guide](/docs/SESSION-START.md)

---

## Contributors

- Development: AI-assisted (Claude)
- Product/Design: Ben Tyson
