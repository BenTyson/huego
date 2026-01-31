---
name: add-mood
description: Add new mood(s) to HueGo. Triggers on "add mood", "new mood", "add a mood", or "/add-mood". Updates mood.ts, mood-icons.tsx, and count references in MoodHeader.tsx + docs.
allowed-tools: Read, Edit, Grep, Glob
---

# Add Mood

Add one or more new moods to HueGo. Each mood requires entries in 3 files and count updates in 3 more.

## Trigger Phrases

- `/add-mood`
- "add mood", "new mood", "add a mood"
- "create a mood for X"

## Required Input

For each new mood, gather from the user (or derive sensible defaults):

| Field | Description | Example |
|-------|-------------|---------|
| `id` | kebab-case slug, unique across all moods | `"dark-academia"` |
| `name` | Creative display name (1-3 words) | `"Dark Academia"` |
| `description` | Evocative tagline (2-3 words) | `"Leather & library"` |
| `category` | One of: `emotions`, `seasons`, `nature`, `aesthetics`, `industry`, `cultural`, `abstract` | `"aesthetics"` |
| `hueRange` | `[min, max]` in degrees 0-360. Wrap-around is valid (e.g., `[340, 20]`) | `[20, 50]` |
| `saturationRange` | `[min, max]` OKLCH chroma, typically 0.01-0.30 | `[0.06, 0.14]` |
| `lightnessRange` | `[min, max]` OKLCH lightness 0-1 | `[0.2, 0.45]` |
| `hueVariance` | How far hue spreads within a palette (8-180) | `30` |
| Icon SVG | 20x20, viewBox 0 0 24 24, stroke currentColor, strokeWidth 1.5, no fill | See template |
| Colors | 3 representative hex values | `["#3D2B1F", "#5C4033", "#7B5B4A"]` |

## File Locations

| File | What to add |
|------|-------------|
| `src/lib/mood.ts` | `MoodProfile` object in the `moodProfiles` array |
| `src/lib/mood-icons.tsx` | SVG in `moodIcons` + 3-color array in `moodColors` |
| `src/components/modes/mood/MoodHeader.tsx` | Update total count in subtitle |
| `docs/SESSION-START.md` | Update count in 3 places |
| `docs/HUEGO.md` | Update count in 3 places |

## Execution Steps

### Step 1: Validate Uniqueness

Read `src/lib/mood.ts` and confirm the new `id` does not already exist:

```
grep 'id: "proposed-id"' src/lib/mood.ts
```

If it exists, stop and ask the user for a different id.

### Step 2: Determine Current Count

```
grep -c '^\s*id: "' src/lib/mood.ts
```

Save this as `CURRENT_COUNT`. The new count will be `CURRENT_COUNT + N` where N is number of moods being added.

### Step 3: Add MoodProfile to `mood.ts`

Insert the new entry at the **end of its category section**, just before the next category comment block or the closing `];`.

**Template:**

```typescript
  {
    id: "MOOD_ID",
    name: "Display Name",
    description: "Short tagline",
    category: "CATEGORY",
    hueRange: [MIN_HUE, MAX_HUE],
    saturationRange: [MIN_SAT, MAX_SAT],
    lightnessRange: [MIN_LIGHT, MAX_LIGHT],
    hueVariance: VARIANCE,
  },
```

Also update the category comment count. For example, change:
```
// EMOTIONS & FEELINGS (13 moods)
```
to:
```
// EMOTIONS & FEELINGS (14 moods)
```

### Step 4: Add Icon to `mood-icons.tsx` — `moodIcons`

Insert after the last entry of the same category section.

**Template:**

```tsx
  "MOOD_ID": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <!-- SVG paths here -->
    </svg>
  ),
```

**Icon rules:**
- viewBox is always `0 0 24 24`
- width/height always `20`
- `fill="none"` `stroke="currentColor"` `strokeWidth="1.5"`
- Use `fill="currentColor"` only for small accent dots
- Keep paths simple (3-6 elements max)
- If `id` contains hyphens, use quoted key: `"my-mood": (`

### Step 5: Add Colors to `mood-icons.tsx` — `moodColors`

Insert after the last entry of the same category section.

**Template:**

```tsx
  "MOOD_ID": ["#HEX1", "#HEX2", "#HEX3"],
```

Colors should be representative of the mood — one dark, one mid, one light within the mood's hue/saturation range.

### Step 6: Update Counts

The total count appears in **7 places**. Replace `OLD_COUNT` with `NEW_COUNT` in:

1. **`src/components/modes/mood/MoodHeader.tsx`** — line containing `moods across 7 categories`
2. **`docs/SESSION-START.md`** — line containing `mood presets across 7 categories`
3. **`docs/SESSION-START.md`** — line containing `mood.ts` comment (`# NN mood profiles`)
4. **`docs/SESSION-START.md`** — line containing `mood-icons.tsx` comment (`# NN mood icons`)
5. **`docs/HUEGO.md`** — line containing `Grid of NN mood cards`
6. **`docs/HUEGO.md`** — line containing `Expanded mood presets (NN moods`
7. **`docs/HUEGO.md`** — line containing `NN moods, grid cards`

To find them all:
```
grep -n 'mood' src/components/modes/mood/MoodHeader.tsx docs/SESSION-START.md docs/HUEGO.md | grep -E '\d+ mood'
```

### Step 7: Verify

Run the build:
```bash
npm run build
```

Then confirm counts:
```bash
grep -c '^\s*id: "' src/lib/mood.ts
grep -c '<svg width="20"' src/lib/mood-icons.tsx
grep -c '\["#' src/lib/mood-icons.tsx
```

All three numbers must match `NEW_COUNT`.

## Parameter Guidelines

### Hue Ranges by Color Family

| Color | Hue Range |
|-------|-----------|
| Red | 0-20 or 340-360 |
| Orange | 20-45 |
| Yellow | 45-70 |
| Green | 70-160 |
| Teal/Cyan | 160-200 |
| Blue | 200-260 |
| Purple | 260-310 |
| Pink/Magenta | 310-340 |
| Full spectrum | 0-360 |

### Saturation Guidelines

| Feel | Range |
|------|-------|
| Very muted/gray | 0.01-0.06 |
| Subtle | 0.04-0.12 |
| Moderate | 0.08-0.18 |
| Vivid | 0.12-0.25 |
| Intense | 0.18-0.30 |

### Lightness Guidelines

| Feel | Range |
|------|-------|
| Dark/moody | 0.15-0.40 |
| Medium | 0.35-0.65 |
| Bright | 0.55-0.80 |
| Pastel/light | 0.65-0.92 |

### Hue Variance Guidelines

| Palette Feel | Variance |
|--------------|----------|
| Monochromatic | 8-15 |
| Tight harmony | 20-35 |
| Moderate spread | 40-60 |
| Wide range | 70-100 |
| Full rainbow | 120-180 |

## Categories

The 7 valid categories and their current totals (update these after adding):

| Category | id | Current Count |
|----------|----|---------------|
| Emotions & Feelings | `emotions` | 13 |
| Seasons & Time | `seasons` | 12 |
| Nature & Elements | `nature` | 12 |
| Aesthetics & Eras | `aesthetics` | 15 |
| Industry & Brand | `industry` | 12 |
| Cultural & Regional | `cultural` | 12 |
| Abstract & Conceptual | `abstract` | 8 |
| **Total** | | **84** |

## Example: Adding a "steampunk" Mood

**Input:** Add a steampunk mood to aesthetics.

**mood.ts entry:**
```typescript
  {
    id: "steampunk",
    name: "Brass & Gears",
    description: "Victorian machinery",
    category: "aesthetics",
    hueRange: [25, 55],
    saturationRange: [0.08, 0.16],
    lightnessRange: [0.3, 0.55],
    hueVariance: 35,
  },
```

**moodIcons entry:**
```tsx
  steampunk: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
      <path d="M7 7l1.5 1.5M15.5 15.5L17 17M7 17l1.5-1.5M15.5 8.5L17 7" />
    </svg>
  ),
```

**moodColors entry:**
```tsx
  steampunk: ["#8B6914", "#B8860B", "#D4A854"],
```

**Count updates:** 84 -> 85, aesthetics comment 15 -> 16.
