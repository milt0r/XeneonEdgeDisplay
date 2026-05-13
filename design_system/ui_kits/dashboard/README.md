# Dashboard UI Kit

A hi-fidelity recreation of the Xeneon Edge dashboard — the touch-first widget grid the product ships with. Components are written as JSX, kept small, and composed in `index.html`. The whole kit is one screen because **the product is one screen**: a 2560×720 secondary monitor showing widgets and a slide-in Settings drawer.

## Files

- `index.html` — the running app. Loads React, Babel, the theme CSS, and every component below.
- `styles.css` — kit-local styles (everything that isn't a design-token).
- `BootScreen.jsx` — BIOS POST intro.
- `TopBar.jsx` — wordmark + clock + EDIT/SETTINGS.
- `Widget.jsx` — generic widget shell (header + gear + remove).
- `widgets/Clock.jsx` — big clock widget.
- `widgets/Weather.jsx` — current + hourly strip.
- `widgets/Sensors.jsx` — CPU/GPU gauges.
- `widgets/Spotify.jsx` — now-playing + transport.
- `widgets/HATiles.jsx` — Home Assistant tile grid.
- `widgets/QuickLaunch.jsx` — one-tap shortcuts.
- `widgets/Sports.jsx` — live + post-game cards.
- `widgets/StocksTicker.jsx` — scrolling marquee.
- `widgets/Calendar.jsx` — agenda list.
- `SettingsPanel.jsx` — slide-in drawer (themes, widgets, on-screen keyboard).
- `OnScreenKeyboard.jsx` — 56-px touch QWERTY.

## What's mocked

Every provider in the real app (weather → Open-Meteo, sensors → LibreHardwareMonitor, Spotify → OAuth, HA → REST/WebSocket) is replaced with a deterministic fixture. The interaction grammar — toggle a light, slide the volume, switch theme, open settings, type on the on-screen keyboard, scroll the ticker — is real. The numbers are not.

## Theme switching

The page is wrapped in a single `<div class="theme-pipboy">` (or `.theme-dark`, etc.) — every other style is driven by the active token bundle. Switch themes from the **Settings** drawer to see the same widgets in Pip-Boy, Dark, Cyberpunk, Nord, and Synthwave.
