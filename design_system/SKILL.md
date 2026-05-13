---
name: xeneon-edge-design
description: Use this skill to generate well-branded interfaces and assets for the Xeneon Edge dashboard — Corsair's touch-first secondary-display widget kit. Use it for production work, mocks, throwaway prototypes, and any other artifact that should feel like the Xeneon Edge product. Contains the full color + type token system, copy voice, iconography rules, theme catalog (Pip-Boy, Dark, Cyberpunk, Nord, …30+ more), and a full hi-fidelity React UI kit.
user-invocable: true
---

# Xeneon Edge — design skill

This skill packages a complete design system for the **Xeneon Edge** dashboard — a touch-first widget kit that runs on Corsair's 2560×720 secondary monitor. The vibe is **firmware that learned to be friendly**: retro-tech, terminal-flavored, deeply themeable.

## How to use

1. **Read [`README.md`](./README.md) first.** It has:
   - Product context (what Xeneon Edge is, who uses it)
   - Content fundamentals (tone, casing, voice samples)
   - Visual foundations (color, type, spacing, animation, hover/press, FX)
   - Iconography rules (Unicode glyphs first, inline SVG fallback)
2. **Token system** lives in [`colors_and_type.css`](./colors_and_type.css). Drop it into any HTML file with:
   ```html
   <link rel="stylesheet" href="fonts.css">
   <link rel="stylesheet" href="colors_and_type.css">
   <body class="theme-pipboy">…</body>
   ```
   Switch themes by changing the `theme-…` class on `<body>` or `<html>`.
3. **Component recipes** are in [`preview/`](./preview/) — small standalone HTML cards (700px wide) demonstrating buttons, chips, metrics, gauges, sports cards, ticker, widget frame, on-screen keyboard, etc. Copy patterns from these for fidelity.
4. **Full hi-fi recreation** is in [`ui_kits/dashboard/`](./ui_kits/dashboard/) — a React app that mocks the whole product. Use its `Widget`, `TopBar`, and per-widget JSX as scaffolding when building anything dashboard-shaped.
5. **Home Assistant deep-dive** is in [`ui_kits/home_assistant/`](./ui_kits/home_assistant/) — full click-thru with tabbed pages, multi-size tile grid, domain-specific detail panels (Light · Climate · Media · Lock · Cover · Camera · Sensor), and the entity picker. Use this kit as the source-of-truth for any HA-shaped surface.

## Working on visual artifacts (slides, mocks, throwaway prototypes)

- **Always wrap in a theme class.** Default to `.theme-pipboy` unless the user asks otherwise — that's the marketed look.
- Copy assets from `assets/` and `preview/` into your output directory; don't link cross-folder unless the artifact is meant to live in this project.
- The Pip-Boy theme requires VT323 + Monoton (`fonts.css` loads them from Google Fonts). For offline output, swap to `@font-face` self-hosting.
- When showing fake data, follow the existing fixture vibe — Detroit-area locations (the project's home turf), realistic CPU temps (50-90°C), terse uppercase labels.

## Working on production code

- The upstream renderer is Electron + React + Zustand. Snapshot in [`source_repo/src/renderer/`](./source_repo/src/renderer/) for reference.
- The single source of truth for theme tokens is [`source_repo/src/renderer/themes/index.ts`](./source_repo/src/renderer/themes/index.ts). When the docs here disagree with that file, the code wins.
- New widgets follow the `WidgetPlugin` contract in [`source_repo/src/shared/widget-plugin.ts`](./source_repo/src/shared/widget-plugin.ts) (referenced in the upstream README — not yet imported into this project; pull it on demand).

## If the user invokes the skill without other guidance

Ask:
1. **What surface?** A single screen (full dashboard mock-up), one widget at a time, a marketing piece, an installer/onboarding flow, or something else?
2. **Which theme?** Pip-Boy (default) or one of the others — Dark, Cyberpunk, Nord, Synthwave, Apollo, LCARS, …
3. **Fidelity?** Static HTML mock, clickable prototype, or production-grade JSX?
4. **What data?** Live providers, fixture data, or interactive scrubbable state?

Then act as an expert designer who outputs HTML artifacts (default) or production code (when the user asks for a real PR).

## What's NOT in this skill

- Corsair corporate-brand assets (no Xeneon Edge product photography, no Corsair "sails" mark). This is the **app's** design system.
- A full theme card for every one of the 30+ included themes. Pip-Boy / Dark / Cyberpunk / Nord are documented in depth; others can be lifted whole from the source TypeScript file.
- Real provider credentials. Anything that touches Spotify, Home Assistant, LibreHardwareMonitor, or Open-Meteo is fixture data — wire real providers in production code only.
