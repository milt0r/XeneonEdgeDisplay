# Xeneon Edge Dashboard

A touch-first, themeable widget dashboard built with Electron + React + TypeScript,
designed for the **Corsair Xeneon Edge** 14.5" 2560×720 secondary touchscreen
(but it'll run on any monitor).

Built-in widgets: Clock, Weather, System Sensors (CPU/GPU temps), Spotify, Home
Assistant tiles, Quick Launch — plus a stubbed plugin system you can extend.

![themes](./resources/preview-placeholder.png)

## Features

- **Fullscreen kiosk mode** tuned for 2560×720 landscape
- **Touch-first UI** — large hit targets, on-screen keyboard, no hover-only
  affordances, drag-to-rearrange edit mode
- **Themes** — built-in **Pip-Boy** (CRT scanlines, glow, boot sequence),
  **Dark**, **Synthwave**, and **Nord**. Themes are CSS variable bundles, easy
  to author your own.
- **Providers** behind swappable interfaces:
  - Weather → [Open-Meteo](https://open-meteo.com/) (no API key needed)
  - Sensors → tries SignalRGB first, falls back to
    [LibreHardwareMonitor](https://github.com/LibreHardwareMonitor/LibreHardwareMonitor)'s
    built-in HTTP/JSON server, then a deterministic mock
  - Home Assistant → REST + WebSocket using a long-lived access token
  - Spotify → OAuth PKCE, full Web API control (play/pause/skip/devices)
- **Plugin system** — `WidgetPlugin` contract + `PluginRegistry` are real;
  external loading from `plugins/` is mocked (two stub external plugins ship
  disabled to demonstrate the contract).

## Quick start

```powershell
npm install
npm run dev          # launches Electron with hot reload
npm run build        # typecheck + build renderer + main + unpacked app
npm run package      # produce installers (NSIS + portable) under release/
```

## First-time configuration

Open **Settings** (top right) on first launch.

### Weather
Defaults to Open-Meteo with IP-based geolocation. Override latitude/longitude
in Settings → Weather for accuracy.

### CPU/GPU sensors
1. Install [LibreHardwareMonitor](https://github.com/LibreHardwareMonitor/LibreHardwareMonitor/releases).
2. In LHM, enable **Options → Remote Web Server**. Default port `8085`.
3. Settings → Sensors: leave **Source** on `Auto` (SignalRGB → LHM → Mock).

> **SignalRGB note:** SignalRGB does not currently expose a public local HTTP API for
> sensor values, so the SignalRGB probe is best-effort and will usually fall through
> to LHM. If/when SignalRGB adds an endpoint, the provider in
> `src/main/providers/sensors.ts` is the only file that needs updating.

### Home Assistant
1. In HA, **Profile → Long-Lived Access Tokens → Create**.
2. Settings → Home Assistant: enter base URL (e.g. `http://homeassistant.local:8123`)
   and paste the token. Click **Save & Test**.
3. Add the **Home Assistant Tiles** widget; pick which entities to show.

### Spotify
1. Go to <https://developer.spotify.com/dashboard>, create an app.
2. Under **Redirect URIs** add: `http://127.0.0.1:53145/callback`
3. Copy the **Client ID** into Settings → Spotify (no client secret needed; uses PKCE).
4. Click **Connect** — a browser window opens for OAuth.

## Themes

Themes live in [`src/renderer/themes/`](./src/renderer/themes/). A theme is
just an object of design tokens:

```ts
export const myTheme: Theme = {
  id: 'my-theme',
  name: 'My Theme',
  description: '...',
  tokens: {
    bg: '#000', fg: '#fff', accent: '#0ff',
    fontUi: 'Inter, sans-serif',
    /* ...colors, fonts, radius, padding, scanlines, glow, vignette, noise... */
  },
  effects: { clickSound: null }
};
```

Add it to `THEMES` in [`themes/index.ts`](./src/renderer/themes/index.ts) — done.

## Authoring widgets / plugins

Every widget implements the `WidgetPlugin` interface
([`src/shared/widget-plugin.ts`](./src/shared/widget-plugin.ts)):

```tsx
export const MyWidget: WidgetPlugin = {
  id: 'my-widget',
  title: 'My Widget',
  description: '...',
  category: 'utility',
  defaultSize: { w: 3, h: 2 },
  themeable: true,
  component: ({ config, updateConfig, editing }) => <div>Hello</div>
};
```

Register it in [`src/renderer/plugins/registry.ts`](./src/renderer/plugins/registry.ts).

Future external plugins will be loaded from a `plugins/` folder by
`loadExternalPlugins()` (currently stubbed).

## Architecture

```
src/
├─ main/              Electron main process
│  ├─ index.ts        window + IPC wiring
│  ├─ secrets.ts      safeStorage-backed secret store
│  ├─ settings.ts     electron-store wrapper
│  └─ providers/      weather, sensors, home-assistant, spotify
├─ preload/           contextBridge exposing typed window.api
├─ shared/            types + IPC contract + WidgetPlugin contract
└─ renderer/          React UI
   ├─ app/            App shell, TopBar, Dashboard, Settings, BootScreen
   ├─ themes/         Theme tokens + ThemeProvider
   ├─ widgets/        Built-in widget plugins
   ├─ components/     WidgetFrame, OnScreenKeyboard
   ├─ plugins/        PluginRegistry
   └─ store/          Zustand app store
```

The renderer talks to providers exclusively via the typed
`window.api.*` surface defined in
[`src/shared/ipc-contract.ts`](./src/shared/ipc-contract.ts). Providers
broadcast updates over the `event:provider` channel which the store
subscribes to, so widgets get live updates with no extra plumbing.

## Keyboard shortcuts

- `F11` — toggle fullscreen
- `Ctrl+Shift+Q` — quit

## Roadmap

- Real external plugin loader (file-system based)
- Per-widget skin overrides
- Multi-monitor / multi-Edge support
- Voice control (stubbed)
- Auto-update via electron-updater

## License

MIT
