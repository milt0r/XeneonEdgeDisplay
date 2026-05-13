# Home Assistant UI Kit

The deep, click-through Home-Assistant surface — the heart of the Xeneon Edge product. The dashboard is a draggable tile grid; tap any tile and the appropriate **detail panel** slides up with native controls for that entity type (light with brightness + color temp, climate with target + HVAC modes, media player with transport + sources, etc).

## Files

- `index.html` — the running app. Theme is toggleable from a small picker in the chrome.
- `styles.css` — kit-local styles.
- `data.js` — fixture entities (10+ entities across all supported domains).
- `HAApp.jsx` — page shell + theme state + boot flag.
- `HATabs.jsx` — Living Room / Kitchen / Office / Outdoor + add-page.
- `HAToolbar.jsx` — EDIT toggle + entity count + add-entity.
- `HATile.jsx` — generic tile component that routes by domain.
- `HADetail.jsx` — slide-up detail modal with per-domain controls (Light / Climate / Media / Lock / Cover / Switch / Scene / Camera / Sensor).
- `BigSlider.jsx` — touch-first horizontal slider used everywhere.
- `HAPicker.jsx` — full entity picker (search + filter chips + grouped rows).
- `HAIcons.jsx` — inline SVG icons keyed off HA entity domain + device_class.

## Flow

1. App boots into the **Living Room** page in **Pip-Boy** theme.
2. Tap a tile → detail modal opens with the right controls.
3. Click **EDIT** in the toolbar → tiles get a size-cycle pill and a ✕ remove badge; the **+ Add entity** button appears.
4. **+ Add entity** opens the full HA picker. Pick anything → it lands on the current page as a 1×1 tile.
5. Switch pages from the tab bar; pages persist their own layouts in component state.

## What's faked

- All HA entity state is local React state, not real WebSocket data. Toggling a light updates the local `state` immediately.
- The camera tile shows a placeholder SVG diagram, not a real RTSP feed.
- The on-screen keyboard isn't wired to the search input here (it is in the main dashboard kit). Use a real keyboard.

## How to extend

To add a new domain — say `vacuum.*` — add an `entityIcon` clause in `HAIcons.jsx`, a tile variant in `HATile.jsx` (or fall through to `ToggleTile`), and a control block in `HADetail.jsx`. The token system needs no changes.
