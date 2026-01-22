# HueGo - Product Overview

> **Tagline**: "Ready, set, HueGo"
> **Live**: https://huego-production.up.railway.app

---

## What

Color palette generator with 4 distinct UI modes that adapts to how designers work.

## Why

Competitors are functional but boring. We differentiate on delightful UX with a mode-switching architecture.

## Revenue

- **Free**: Ads + 10 saved palettes + basic exports
- **Pro ($5/mo)**: Ad-free, unlimited saves, all exports

---

## The 4 Modes

| Mode | URL | Purpose |
|------|-----|---------|
| **Immersive** | `/immersive` | Full-screen, spacebar to generate |
| **Context** | `/context` | See palette on real designs |
| **Mood** | `/mood` | Start with feelings, get colors |
| **Playground** | `/play` | Swipe to discover |

---

## Implementation Status

All sprints complete + V1 optimization:

1. **Foundation** - Color engine, OKLCH, Zustand store
2. **All Modes** - 4 modes with shared state
3. **Export & A11y** - 7 formats, WCAG, color blindness sim
4. **Monetization** - Stripe, premium gating, SEO
5. **Deployment** - Railway, auto-deploy from main
6. **V1 Launch Prep** - Memory leak fixes, performance optimization, component refactoring

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 |
| Styling | Tailwind 4 |
| State | Zustand |
| Animation | Framer Motion |
| Hosting | Railway |
| Payments | Stripe |

No database. localStorage only.

---

## Locked Decisions

- 4-mode architecture
- Next.js + Tailwind + Zustand + Framer Motion
- No database for MVP
- $5/month premium
- Port 3377 for dev
- OKLCH for color generation
- Railway for hosting

---

## Competitors

| Competitor | Our Advantage |
|------------|---------------|
| Coolors | Multiple modes, better UX |
| Adobe Color | Not locked to ecosystem |
| Khroma | Immediate + simpler |

---

## Related Docs

- `/docs/SESSION-START.md` - Start here for dev
- `/docs/ARCHITECTURE.md` - Technical details
- `/docs/CHANGELOG.md` - History
