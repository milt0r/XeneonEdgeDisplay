# Xeneon Edge Design System

> A touch-first, deeply-themeable widget dashboard for the Corsair Xeneon Edge — a 14.5" 2560×720 secondary display. The design system is built around a single React + Electron renderer whose entire look is driven by **theme bundles** of CSS variables, with one canonical out-of-the-box look (`pipboy` — a Vault-Tec CRT terminal) and a growing roster of additional aesthetics (Dark, Synthwave, Nord, Cyberpunk, LCARS, Apollo, Severance, F1 Pit Wall, ANSI BBS, league-themed sports skins, …).

```
> XENEON-EDGE BIOS v3.7.4
> Memory check: 32768 KB OK
> Initializing widget grid...
> Touch interface: ENABLED_
```

---

## Source material

This design system was reverse-engineered from the upstream code:

- **Repo:** [`milt0r/XeneonEdgeDisplay`](https://github.com/milt0r/XeneonEdgeDisplay) @ `main`
- **Imported snapshot** under [`source_repo/src/`](./source_repo/src) — App shell (`renderer/app/`), themes (`renderer/themes/`), widgets (`renderer/widgets/`), and the master stylesheet (`renderer/app/styles.css`, 1464 lines).
- Marketing-side: the README in the upstream repo (Corsair Xeneon Edge hardware context, OAuth/HA/sensor wiring, plugin contract).
- No Figma file was provided — the source of truth is the repo's `styles.css` + per-theme token bundles in `themes/index.ts`.

If you have view access to the GitHub project, that codebase is canonical. Where this design system says one thing and the code says another, **the code wins.**

---

## Index

Root files

- `README.md` — this file
- `SKILL.md` — Agent Skill entry point (cross-compatible with Claude Code)
- `colors_and_type.css` — every design token as CSS custom properties (base + semantic). Drop into any HTML file with `<link rel="stylesheet" href="colors_and_type.css">`.
- `fonts.css` — Google Fonts imports for the typefaces referenced by themes (see "Font substitutions" below).

Folders

- `assets/` — logos, mark, generic stand-in imagery
- `preview/` — small HTML cards that populate the Design System review tab (one per token group, component, etc.)
- `ui_kits/dashboard/` — full hi-fi recreation of the Xeneon Edge dashboard with multiple themes you can toggle live, plus a click-through Settings panel and a faux Spotify "now playing" overlay
- `ui_kits/home_assistant/` — the **Home Assistant** click-thru: tabbed multi-area grid, tile sizes 1×1 → 3×2, full domain-specific detail panels (Light · Climate · Media · Cover · Lock · Camera · Sensor · Scene), and the entity picker with search + filter chips
- `source_repo/src/` — imported subset of the upstream source code, for reference

---

## Product context

**Hardware:** Corsair Xeneon Edge — a 14.5", 2560×720, capacitive-touch secondary monitor that desktop builders mount to the top/side of a chassis or under a main display. It's designed to live in a peripheral spot and be glanceable + tappable.

**Software (this project):** an Electron + React kiosk app that runs full-screen on that display and presents a draggable grid of widgets: a big clock, weather, CPU/GPU sensors, Spotify now-playing, Home Assistant tiles, a calendar, Hacker News, sports scores, stocks, a Pomodoro, quick-launch shortcuts. Configuration is done entirely from a slide-in **Settings** panel that includes an on-screen keyboard, because the display has no attached keyboard or mouse.

The "edge" the product name plays on:

1. The display physically lives at the **edge** of your setup.
2. The dashboard is the **edge** of your home-automation / system-monitoring stack — it surfaces status that lives elsewhere.

**Audience:** PC enthusiasts. Tinkerers. People who already own LibreHardwareMonitor, a Home Assistant install, a Spotify Premium account, and have opinions about how their RGB looks. The dashboard rewards configuration without demanding it.

---

## Content fundamentals

The product copy is **terse, uppercase, and slightly retro-tech.** It reads like a piece of hardware firmware that gained a sense of humor.

### Tone & vibe

- **Terminal-flavored.** Labels are short and mono-spaced and look like they belong on a status line: `XENEON//EDGE`, `EDIT`, `SETTINGS`, `DONE`, `CPU TEMP`, `MEM USED`, `SOURCE: mock`, `LIVE`, `OFFLINE`.
- **Glanceable over chatty.** A widget tells you a number, optionally what the number means, and never more than that.
- **Direct, not friendly.** "Not connected to Spotify" → "Open Settings → Spotify to connect". No "Oops!", no exclamation marks, no apologizing.
- **Plays a character.** The first-launch boot screen pretends to be a BIOS POST and signs off with "Vault-Tec Industries (c)". That's the only place the pose is allowed to be theatrical. Inside the app, copy is functional.

### Casing & punctuation

- **UPPERCASE** for everything that acts as a label or chip: section headers, button text, status pills, metric labels, settings tabs, ticker symbols. Tracked-out wide (`letter-spacing: 0.1em` to `0.2em`).
- **Title Case** for theme names and widget titles only (`Quick Launch`, `Pip-Boy`, `Home Assistant Tiles`).
- **Sentence case** for descriptions and tooltips ("Big touch-friendly clock", "CPU/GPU temps and load with per-metric toggles").
- Em-dashes `—` for asides. Middle-dot `·` is the default in-line separator between two short facts ("`Detroit, MI · 47% RH · 12 km/h`"). Pipe `|` is **not** used.
- Numbers and units share a face: `44°`, `72%`, `12 km/h`, `28800 baud` — usually with the unit half a step smaller in the mono face.

### Voice samples (verbatim from the codebase)

| Where | Copy |
|---|---|
| Brand wordmark | `XENEON//EDGE` |
| Edit-mode button | `EDIT` / `DONE` |
| Boot script | `> Memory check: 32768 KB OK` |
| Boot script close | `> Touch interface: ENABLED` |
| Settings tab labels | `WIDGETS`, `THEME`, `WEATHER`, `SENSORS`, `HOME ASSISTANT`, `SPOTIFY` |
| Sensors empty state | `SOURCE: mock (install LibreHardwareMonitor for real data)` |
| Spotify empty state | `Not connected to Spotify` / `Open Settings → Spotify to connect` |
| Stocks ticker | `AAPL · 187.42 · +1.2%` |
| Theme description | `Vault-Tec approved CRT terminal aesthetic` |
| Theme description | `MU-TH-UR 6000 — green phosphor terminal aboard the USCSS Nostromo` |

Notice the descriptions: they're one line, they reference the source they're paying tribute to by name, and they read like a museum-label rather than a marketing blurb.

### What we don't do

- **No emoji as UI.** Emoji exist exactly twice: weather glyphs (`☀ 🌤 ⛅ 🌧 ⛈`) and quick-launch button labels (`▶ ⏸ ⏭ 🔉`). Everywhere else, status is communicated with color + an UPPERCASE word, not a smiley.
- **No "you" or "we" copy.** The app addresses no one. There's no "Welcome back, Mark". State is reported, not narrated.
- **No mascot. No illustration of a robot.** The theme art is the mascot.
- **No filler.** A blank Spotify card says "Nothing playing"; it does not invent a recently-played list.

---

## Visual foundations

Everything in the app is driven by a single `ThemeTokens` bundle — about 20 CSS variables — re-exported as `--bg`, `--fg`, `--accent`, etc. See [`colors_and_type.css`](./colors_and_type.css) for the canonical mapping. The structure is the same in every theme; only the values change.

### Color system (per-theme, semantic)

| Token | Role | Pip-Boy | Dark | Cyberpunk |
|---|---|---|---|---|
| `--bg` | App background (often hidden under a `background:` art layer) | `#020a04` | `#0b0d10` | `#05060a` |
| `--bg-elevated` | Header strips, toolbar, secondary surfaces | `#04140a` | `#13171c` | `#0c0e1a` |
| `--bg-panel` | Widget body, cards, settings panel | `#062012` | `#181d23` | `#10142a` |
| `--fg` | Primary text | `#7cff8a` | `#e7ecf3` | `#ffe14a` |
| `--fg-muted` | Secondary text, label text | `#3aa84a` | `#8a93a0` | `#7a86b8` |
| `--accent` | Numbers, titles, active controls, gauge fills, glow color | `#7cff8a` | `#5aa9ff` | `#fcee0c` |
| `--accent-soft` | Active-state background, soft fills, chip backgrounds | `#1f5a2a` | `#23344a` | `#3a2c00` |
| `--accent-hot` | Hover/pressed text color, second-accent | `#b6ffae` | `#7cc0ff` | `#ff2bd6` |
| `--warn` | Warning / hot temperature / overload | `#ffb14a` | `#ffb14a` | `#ff6f3c` |
| `--good` | OK / online / win | `#7cff8a` | `#5fe39a` | `#00ffd5` |
| `--border` | Hairline dividers, card outlines | `#1f7a35` | `#262d36` | `#2a1a55` |

The full table for all 30+ themes lives in [`source_repo/src/renderer/themes/index.ts`](./source_repo/src/renderer/themes/index.ts).

There are also two non-semantic "boolean" tokens that flip on/off per theme: `scanlines`, `glow`, `vignette`, `noise`. The renderer overlays each as a fullscreen `pointer-events: none` layer on top of the app.

### Typography

Each theme picks three faces:

- `--font-ui` — buttons, body, small labels
- `--font-mono` — every metric value, every chip, every clock, every status line; **monospace is the workhorse**
- `--font-display` — widget titles, big numbers, the wordmark

Most themes lean **mono-everywhere** (Pip-Boy, BBS, Nostromo, Apollo, Severance, Doom-via-Bungee). The non-CRT themes (Dark, Nord, Catppuccin, Tokyo Night) switch the UI face to Inter or system-ui but keep the mono face for numbers.

The display scale climbs steeply:

| Role | Size |
|---|---|
| Clock face | **96px** display, `line-height: 1`, centered |
| Metric numbers (sensor reading, stock price, temperature) | **44px** → **22px** depending on widget size |
| Widget title | **11px** mono, UPPERCASE, `letter-spacing: 0.15em` |
| Body label | **13–14px** ui |
| Chip / pill | **11–12px** mono, UPPERCASE, `letter-spacing: 0.1em` |
| Footer / source line | **10px** mono muted |

See [`preview/type-scale.html`](./preview/type-scale.html) for the live specimen.

### Backgrounds

Every theme can supply its own `background` string. The codebase patterns:

1. **Stacked radial gradients** for moody dark themes (Pip-Boy adds CRT scanlines on top via `repeating-linear-gradient`, Dark adds two corner glows).
2. **Inline SVG art** encoded as a data-URI for elaborate themes (the **BBS** theme draws a full Detroit-area BBS welcome screen in ANSI block art; the **X-Files** theme renders a green-phosphor case file with crosshairs).
3. **Flat hard-edged stripes** for the playful themes (Wes Anderson is a horizontal three-band 33/33/33 split; 8-bit is two color bands with a hard horizon line).
4. `null` means "use `--bg`". League sports themes do this and let the team's logo + colors take over.

Backgrounds are loaded **with no network call** — pure CSS + inline SVG. The dashboard never reaches out for an image at runtime.

### Spacing & radius

- `--pad` ranges from `12px` (BBS, Nostromo) to `16px` (Severance, Dark, Wes Anderson). Default is `14px`.
- `--radius` is theme-coded to vibe:
  - `0px` → hard-edge themes (BBS, 8-bit, Minecraft, Doom, Stardew, Severance, Wes Anderson)
  - `2px` → near-square industrial themes (Cyberpunk, Black Mesa, F1 Pit Wall, D&D)
  - `4px` → CRT terminal (Pip-Boy, Halo, Apollo)
  - `6–10px` → modern dark themes (Tokyo Night, Solarized, Nord, league sports)
  - `12px` → Dark (the most "app-like" preset)
  - `24px` → LCARS (Okudagram pill ends)

Whatever the radius, **the whole app uses one value.** Buttons, widget frames, settings cards, chips → all the same. Pills (radius `999px`) are reserved for status pills and chips inside the HA picker.

### Borders & shadows

- Hairline `1px solid var(--border)` is the dominant divider — every widget, every settings card, every chip.
- Active state = swap `border-color` to `--accent` and tint the fill `--accent-soft`. (Active button, active widget cell, active settings tab, selected team chip — all the same recipe.)
- Outer shadows are sparse. The places they appear:
  - `box-shadow: 0 12px 60px rgba(0,0,0,0.7)` on the HA detail modal
  - `box-shadow: 0 -8px 32px rgba(0,0,0,0.6)` on the on-screen keyboard
  - `box-shadow: 0 0 24px var(--accent-soft)` on a toggled-on big toggle
  - `box-shadow: 0 0 12px rgba(239, 68, 68, 0.25)` on a live sports card
- Inset shadows are used per-theme to mimic CRT bloom: `box-shadow: inset 0 0 30px rgba(124, 255, 138, 0.05);` on every Pip-Boy widget.

### Glow & text-shadow

When `tokens.glow === true`, the theme can apply a phosphor glow to its big text. Pip-Boy:

```css
text-shadow: 0 0 4px var(--accent), 0 0 12px var(--accent-soft);
```

Cyberpunk applies a **chromatic-aberration** treatment to the wordmark only:

```css
.brand { text-shadow: 2px 0 0 #ff2bd6, -2px 0 0 #00ffd5; }
```

### Effects layers (per-theme overlays)

```html
<div class="theme-root">
  ...app...
  <div class="fx-scanlines" />  <!-- when tokens.scanlines -->
  <div class="fx-vignette"  />  <!-- when tokens.vignette  -->
  <div class="fx-noise"     />  <!-- when tokens.noise     -->
</div>
```

These are absolutely positioned, `pointer-events: none`, and on the four highest z-indices in the app (`9997` – `9999`). The vignette is a radial gradient. The scanlines are a 2-px `repeating-linear-gradient` of `rgba(0,0,0,0.18)` with `mix-blend-mode: multiply`. The noise is a tiny SVG `feTurbulence` rect at `opacity: 0.05`.

### Animation

Animation is **minimal and purposeful** — this is a glanceable dashboard, not a marketing site. Where it does appear:

- **Boot screen**: typewriter — one line every 140 ms, ending with a 0.7-s blinking underscore. Then a 0.5-s `fadeOut` 1.6 s in.
- **Cursor blink**: `animation: blink 0.7s steps(1) infinite;` (step-timed, not eased, so it snaps).
- **Live sports dot**: `live-pulse 1.2s ease-in-out infinite` — pulses `scale(1) → scale(0.8)` and `opacity: 1 → 0.5`.
- **Discord speaking ring**: `discord-pulse 1s ease-in-out infinite` around a user avatar.
- **Stocks ticker**: a `transform: translateX(0) → translateX(-50%)` linear loop, duration set by JS to match content width.
- **Hover/press**: button transitions are `transition: background 120ms, color 120ms, border-color 120ms;` — fast, no easing curve, no scale. Big toggles get `transition: ... 150ms` and the active-on state lights up its `accent-soft` background.
- **Big toggle press**: `transform: scale(0.98)` on `:active` — only place the app scales anything.
- **Gauge fill**: `transition: width 250ms` so a CPU spike reads as a sweep, not a jump.

No bouncing, no easeOut-back, no Framer Motion. The vocabulary is "phosphor turns on; phosphor turns off."

### Hover & press states

Touch-first means hover and active are the **same state visually**:

```css
.btn:hover, .btn:active, .btn-active {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent-hot);
}
```

The press feedback is the color shift; only the big toggles scale.

### Hit-target floor

Hard rule from the styles: any button or row that the user can tap has `min-height: 44px`. Bigger touch surfaces — the Spotify transport — go to **72×72**. The on-screen keyboard keys are **56px tall.**

### Layout rules

- Header (`.topbar`) is **48 px fixed** at the top with the brand wordmark on the left, clock + edit + settings on the right.
- The body is a 12-column `react-grid-layout` with `rowHeight: 200`, `margin: [10, 10]`, and drag/resize only enabled in `EDIT` mode.
- Settings is a 920-px-wide overlay that slides in from the right, on top of `rgba(0,0,0,0.7)` scrim.
- Modals (HA detail) max out at `900px` wide and `calc(100vh - 40px)` tall.

### Transparency & blur

The renderer **bakes per-theme widget opacity into the `--bg-panel` and `--bg-elevated` vars** via `color-mix(in srgb, ... transparent)`. So when a user drops widget opacity from 100% to 70%, every widget pulls back to translucent and the theme background art shows through. No `backdrop-filter: blur` is used; the look is "stained glass over wallpaper," not frosted glass.

### Imagery vibe

- Theme background art is the **only imagery the app draws**. There are no photos. There are no illustrations of people.
- Spotify album art is shown at 128×128 with a `var(--radius)` corner and a `1px var(--border)` ring. It is the one place the app shows arbitrary third-party imagery.
- Sports team logos are 32×32 PNGs (from the upstream ESPN-style sports provider) with `object-fit: contain`.

The aesthetic of the curated themes — warm and grain-flecked (Pip-Boy, Doom, D&D), cold and crisp (Apollo, Halo, Tokyo Night), or aggressively flat (BBS, 8-bit, Minecraft) — is the brand. There's no Xeneon-Edge house photography style; the **system is the photography style.**

### Cards

Every "thing in a list" — a widget, a sensor, a stock, a sports game, a Discord user, a HA tile, a calendar event — uses the same card recipe:

```css
background: var(--bg-elevated);
border: 1px solid var(--border);
border-radius: var(--radius);
padding: 8-12px;
/* gap: 4-8px via flex column inside */
```

When the card is *the* active thing, swap `border-color` to `--accent` and tint with `--accent-soft`. When it represents a live/dangerous state (live sports, error), the border picks up `#ef4444` and gets a soft 12-px shadow. No drop-shadow elevation system — depth is communicated by **color**, not by Z.

### Wordmark

`XENEON//EDGE` set in `--font-display`, `letter-spacing: 0.2em`, in `var(--accent)`. The `//` is part of the mark — never substitute `/`, `:`, or a dot. See [`preview/wordmark.html`](./preview/wordmark.html).

---

## Iconography

Icons are deliberately sparse. The codebase does **not** ship a custom icon font. The patterns:

1. **Unicode glyphs as icons.** Buttons label themselves with `▶`, `⏸`, `⏭`, `⏮`, `🔉`, `🔊`, `⛶`, `⚙`, `✕`, `_`. The full keyboard of geometric, math, and arrow blocks at U+25xx / U+27xx is the icon set. This is consistent with the terminal/firmware vibe.
2. **Emoji weather icons** — `☀ 🌤 ⛅ ☁ 🌫 🌦 🌧 🌨 ❄ ⛈` — keyed off Open-Meteo's WMO weather codes. This is the **only** place emoji appear in the dashboard proper.
3. **Inline SVG for HA entity icons** — `renderer/components/HaIcon.tsx` ships a small in-house mapping that picks an SVG path per Home-Assistant entity class (light bulb, thermometer, lock, switch, camera, climate). All single-color, all stroked with `currentColor`, all sized 24×24.
4. **Sport-team PNGs** — fetched from the sports provider's CDN at runtime; not bundled.
5. **Inline SVG for theme background art** — see "Backgrounds" above.

No external icon CDN (Lucide, Heroicons, Feather) is in use. When this design system needs an icon that doesn't have a clean Unicode glyph, fall back to **inline SVG with `stroke="currentColor"` at 1.5-px stroke-weight**, sized 16–20 px for inline, 24 px for HA cards, 32 px for big toggles.

The app's own brand mark is purely typographic — there is no monogram, no lockup, no graphic mark beyond the wordmark.

---

## Font substitutions ⚠

The upstream code calls for the following families. All are available on **Google Fonts** at no cost, and `fonts.css` in this project loads them from `fonts.googleapis.com`:

- **VT323** — used by Pip-Boy, BBS, Nostromo, X-Files (CRT terminals)
- **Share Tech Mono** — alternate mono CRT face
- **JetBrains Mono** — modern mono for Dark, Tokyo Night, Catppuccin
- **IBM Plex Mono** — Apollo, Severance, F1
- **Inter** — Dark, Nord, Tokyo Night, Catppuccin, Solarized, league sports
- **Rajdhani** — Cyberpunk, Halo, F1, Black Mesa
- **Orbitron** — Synthwave, Cyberpunk, Halo, F1 display
- **Audiowide** — Synthwave display
- **Press Start 2P** — 8-Bit, Minecraft, Stardew
- **Bungee** — Doom display
- **Cinzel / Cinzel Decorative** — D&D body / display
- **IM Fell English** — D&D mono fallback
- **Special Elite** — X-Files
- **Antonio** — LCARS display
- **Monoton** — Pip-Boy display fallback
- **Oswald** — Sports display
- **Nunito** — Rounded family override
- **Futura** — Wes Anderson (replaced by Inter Black on Google Fonts — close enough)

All of these are loaded over the network by `fonts.css`. If you need to take this design system fully offline, replace those `@import url(...)` lines with self-hosted `@font-face` rules and ship the WOFF2s alongside `fonts.css`.

> **The user did not provide font files.** The fonts above are the closest matches available on Google Fonts. If a more accurate font (especially **Futura** and **Antonio**) is desired, please supply the files and I'll swap them in.

---

## SKILL.md

This project doubles as a **Claude Code Agent Skill**. Read [`SKILL.md`](./SKILL.md) and let Claude figure out the rest.

---

## What's still wobbly

- The dashboard recreation in `ui_kits/dashboard/` uses **placeholder data** for sensors, weather, Spotify, and HA — the real product pulls live values from local provider services. The hover/press/animation grammar is right; the numbers are made up.
- I've focused the type & color cards on `pipboy` (the marketed default) plus three contrasting themes (`dark`, `cyberpunk`, `nord`). The full theme catalog is documented in code; building a card for every one would be ~30 swatches.
- No real Corsair brand assets (the Xeneon Edge product photo, the Corsair sails logo) are included — this is the **dashboard app's** design system, not Corsair's corporate identity.
