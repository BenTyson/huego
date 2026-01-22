# HueGo - Session Start Guide

> **Read this before doing anything.**
> Last Updated: 2026-01-22
> Production: https://huego-production.up.railway.app
> Dev: `npm run dev` (port 3377)

---

## Status

**Phase: Live / Monitoring**

All sprints complete. Product is live. Stripe in test mode.

**Next actions (when ready):**
- Flip Stripe to live mode for real payments
- Apply for AdSense (needs traffic first)
- Add analytics if optimizing

**Live features:** 4 modes, 6 harmony types, manual color picker, 7 export formats, WCAG checker, color blindness sim, Stripe checkout ($5/mo), Railway auto-deploy.

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
│   ├── immersive/     # Main mode (uses ModePageLayout)
│   ├── context/       # Preview mode
│   ├── mood/          # Mood-based generation
│   ├── play/          # Swipe mode
│   ├── p/[id]/        # Shared palettes
│   ├── api/
│   │   ├── checkout/  # Stripe checkout
│   │   ├── webhook/   # Stripe webhooks
│   │   └── subscription/
│   └── checkout/      # Success/cancel pages
├── components/
│   ├── ActionBar/     # Split into sub-components
│   │   ├── index.tsx
│   │   ├── HarmonySelector.tsx
│   │   ├── UndoRedoButtons.tsx
│   │   ├── SaveButton.tsx
│   │   ├── UtilityButtons.tsx
│   │   └── Toast.tsx
│   ├── layout/
│   │   └── ModePageLayout.tsx  # Common mode wrapper
│   ├── ui/
│   │   ├── ColorEditButton.tsx
│   │   └── HydrationLoader.tsx
│   ├── modes/
│   │   ├── immersive/
│   │   ├── context/   # +PaletteSidebar, PreviewTypeSelector
│   │   ├── mood/      # +MoodSelectionPanel, RefinementSliders
│   │   └── playground/
│   ├── ModeToggle.tsx
│   ├── ExportModal.tsx
│   ├── AccessibilityPanel.tsx
│   └── PricingModal.tsx
├── lib/
│   ├── colors.ts      # Color conversions + getTextColorsForBackground
│   ├── generate.ts    # Palette algorithms
│   ├── export.ts      # Export formats
│   ├── mood.ts        # Mood profiles
│   ├── stripe.ts      # Stripe server
│   └── accessibility.ts
└── store/
    ├── palette.ts     # Main state + selector hooks
    └── subscription.ts # Premium state
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

type Mode = "immersive" | "context" | "mood" | "playground";
```

---

## Do Not

1. Add database/auth - localStorage is sufficient
2. Change the stack - it works
3. Over-engineer - keep it simple
4. Skip mobile testing
5. Change locked decisions

---

## Deployment

Push to `main` triggers Railway auto-deploy.

```bash
git add -A && git commit -m "message" && git push origin main
```

---

## Related Docs

- `/docs/HUEGO.md` - Product vision
- `/docs/ARCHITECTURE.md` - Technical details
- `/docs/CHANGELOG.md` - History
