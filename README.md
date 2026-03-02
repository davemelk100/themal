# Live Design System

An interactive design system that lets you pick a brand color and watch every token update in real time. Export a CSS snapshot or open a PR to propose changes.

## How It Works

All palette colors are HSL custom properties on `:root`. From one brand color, the system derives a full token set (secondary, accent, muted, destructive) using your choice of color harmony scheme: complementary, triadic, analogous, split-complementary, or tetradic.

Every foreground/background pair is audited against WCAG AA (4.5:1) via axe-core. Failing pairs are auto-corrected by adjusting foreground lightness. Your theme persists in localStorage across reloads.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- axe-core (WCAG AA accessibility auditing)
- Lucide React (icons)
- Netlify Functions (GitHub PR creation)

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment

Hosted on Netlify. Pushes to `main` trigger automatic deploys.
