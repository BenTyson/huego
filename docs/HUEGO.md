# HueGo - Project Vision & Specification

> **Last Updated**: 2025-12-14
> **Current Phase**: Sprint 3 (Polish & Export)
> **Project Status**: Core features complete, polishing
> **Dev Server**: `npm run dev -- -p 3377`
> **Tagline**: "Ready, set, HueGo"

---

## Quick Links

- **[SESSION-START.md](./SESSION-START.md)** - Start here for new sessions
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical deep-dive
- **[CHANGELOG.md](./CHANGELOG.md)** - Development history

---

## 1. Project Summary

**What**: A color palette generator with 4 distinct UI modes that adapts to how designers want to work.

**Why**: Competitors are functional but boring. We differentiate on *delightful UX* with a mode-switching architecture that no one else has.

**Revenue Model**:
- Free tier: Ads + limited saves (10 palettes)
- Premium: $3/month for ad-free, unlimited saves, advanced exports

**Target Revenue**: $1-5K/month passive income

---

## 2. The 4 Modes

| Mode | Purpose | Status |
|------|---------|--------|
| **Immersive** | Full-screen meditative exploration | ✅ Complete |
| **Context** | See palette on real designs | ✅ Complete |
| **Mood** | Start with feelings, get colors | ✅ Complete |
| **Playground** | Gamified swipe discovery | ✅ Complete |

### Mode Details

**Immersive** (`/immersive`)
- Full-screen 5-column color display
- Spacebar to generate new palette
- Click to lock/unlock colors
- Hover to reveal hex, click to copy
- 6 harmony types available

**Context** (`/context`)
- Split view: palette sidebar + live preview
- 3 preview types: Website, Mobile App, Dashboard
- Colors auto-map to roles (Primary, Secondary, Accent, Background, Surface)
- Real-time updates as palette changes

**Mood** (`/mood`)
- 12 mood chips: Calm, Bold, Playful, Professional, Warm, Cool, Retro, Futuristic, Natural, Urban, Luxurious, Minimal
- 3 refinement sliders: Temperature, Vibrancy, Brightness
- Click mood → instant palette generation

**Playground** (`/play`)
- Tinder-style color cards
- Swipe right to add, left to skip
- Build 5-color palette through discovery
- Click colors to remove from palette

---

## 3. Technical Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 16 | App Router, SSR, SEO |
| Styling | Tailwind CSS 4 | Rapid development |
| State | Zustand | Simple, persistent state |
| Animation | Framer Motion | Smooth interactions |
| Storage | localStorage | No backend needed |
| Hosting | Vercel | Easy deployment |

**Key Technical Decisions**:
- OKLCH color space for perceptually uniform generation
- No database (localStorage + URL params for sharing)
- Client-side only (no server-side state)

---

## 4. Implementation Status

### ✅ Sprint 1: Foundation (Complete)
- [x] Next.js project setup
- [x] Color engine (hex, RGB, HSL, OKLCH conversions)
- [x] 6 harmony generation algorithms
- [x] Zustand store with localStorage persistence
- [x] Immersive mode (full implementation)
- [x] Keyboard shortcuts
- [x] URL sharing

### ✅ Sprint 2: All Modes (Complete)
- [x] Context mode with 3 previews
- [x] Mood mode with 12 moods + sliders
- [x] Playground mode with swipe mechanics
- [x] Mode toggle with animated indicator
- [x] ActionBar with harmony selector

### 🔄 Sprint 3: Polish & Export (In Progress)
- [ ] Export modal component
- [ ] CSS variables export
- [ ] Tailwind config export
- [ ] SCSS variables export
- [ ] JSON export
- [ ] PNG image export
- [ ] SVG export
- [ ] WCAG contrast checker
- [ ] Color blindness simulation
- [ ] Micro-interactions polish

### ⏳ Sprint 4: Monetization (Pending)
- [ ] Google AdSense integration
- [ ] Premium subscription gate
- [ ] Stripe checkout
- [ ] Ad-free premium experience

### ⏳ Sprint 5: Growth (Future)
- [ ] SEO optimization
- [ ] Social sharing cards
- [ ] Community palette gallery
- [ ] AI mood analysis

---

## 5. File Structure

```
huego/
├── docs/
│   ├── SESSION-START.md    # AI agent onboarding
│   ├── HUEGO.md            # This file
│   ├── ARCHITECTURE.md     # Technical details
│   └── CHANGELOG.md        # Development history
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Redirects to /immersive
│   │   ├── immersive/
│   │   ├── context/
│   │   ├── mood/
│   │   ├── play/
│   │   └── p/[id]/         # Shared palette view
│   ├── components/
│   │   ├── ModeToggle.tsx
│   │   ├── ActionBar.tsx
│   │   └── modes/
│   │       ├── immersive/
│   │       ├── context/
│   │       ├── mood/
│   │       └── playground/
│   ├── lib/
│   │   ├── types.ts
│   │   ├── colors.ts       # Color conversions
│   │   ├── generate.ts     # Palette algorithms
│   │   ├── mood.ts         # Mood profiles
│   │   └── share.ts        # URL encoding
│   ├── store/
│   │   └── palette.ts      # Zustand store
│   └── hooks/
│       └── useKeyboard.ts
├── public/
├── tailwind.config.ts
└── package.json
```

---

## 6. Competitive Landscape

| Competitor | Strengths | Our Advantage |
|------------|-----------|---------------|
| **Coolors** | Fast, popular | Multiple modes, better UX |
| **Adobe Color** | Color theory | Not locked to ecosystem |
| **PaletteMaker** | Context preview | More contexts + 3 other modes |
| **Khroma** | AI learning | Immediate + AI later |
| **Color Hunt** | Community | Active creation + browsing |

**Our Positioning**: "The color palette tool that adapts to you"

---

## 7. Success Metrics

| Metric | 6 Month Target | 12 Month Target |
|--------|----------------|-----------------|
| Monthly Visitors | 30K | 100K |
| Palettes Generated | 500K | 2M |
| Premium Subscribers | 200 | 1,000 |
| Monthly Revenue | $500-1K | $2-5K |

---

## 8. Decisions Log

### Locked Decisions (DO NOT CHANGE)
- 4-mode architecture
- Next.js + Tailwind + Zustand + Framer Motion stack
- No database for MVP
- $3/month premium pricing
- Context previews: Website, Mobile, Dashboard
- Port 3377 for development
- OKLCH for color generation

### Open Questions (Decide Later)
- Community gallery feature
- AI integration for Mood mode
- Additional context previews
- Sound design (currently skipped)

---

## 9. Session Log

### 2025-12-14 - Sprint 1 & 2 Complete
- Initialized Next.js project
- Built color engine with OKLCH support
- Implemented all 6 harmony algorithms
- Created Zustand store with persistence
- Built Immersive mode (full implementation)
- Built Context mode with 3 previews
- Built Mood mode with 12 moods + sliders
- Built Playground mode with swipe mechanics
- Added keyboard shortcuts, URL sharing, action bar
- All 4 modes functional and tested
- Next: Sprint 3 (Export & Polish)

### 2025-12-13 - Initial Planning
- Researched competitive landscape
- Identified UX as key differentiator
- Designed 4-mode architecture
- Named project "HueGo"
- Created initial documentation

---

## 10. Notes for AI Agents

**START HERE**: Read [SESSION-START.md](./SESSION-START.md) first!

**Key Points**:
1. All architectural decisions are final
2. Focus on execution, not re-design
3. Test on mobile (many users will be mobile)
4. Performance matters (it's an interactive tool)
5. Keep it simple (no over-engineering)

**Current Priority**: Sprint 3 - Export modal and accessibility features.
