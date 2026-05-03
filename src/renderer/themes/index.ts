import type { Theme } from './theme';
export type { Theme } from './theme';

/* ---------- backgrounds (pure CSS, no network) ---------- */

const PIPBOY_BG =
  "radial-gradient(ellipse at 50% 60%, rgba(31, 122, 53, 0.25), transparent 70%), repeating-linear-gradient(0deg, rgba(31, 122, 53, 0.08) 0, rgba(31, 122, 53, 0.08) 1px, transparent 2px, transparent 5px), #020a04";

const DARK_BG =
  "radial-gradient(circle at 0% 0%, rgba(90, 169, 255, 0.08), transparent 40%), radial-gradient(circle at 100% 100%, rgba(95, 227, 154, 0.06), transparent 50%), #0b0d10";

const SYNTHWAVE_BG =
  "linear-gradient(180deg, #1a0933 0%, #2a1052 35%, #ff4ad8 60%, #ffe14a 100%)";

const NORD_BG =
  "linear-gradient(180deg, #2e3440 0%, #3b4252 100%), url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 720'><g fill='%234c566a' fill-opacity='0.3'><polygon points='0,720 200,500 350,560 480,440 620,520 780,420 920,500 1080,440 1240,540 1400,460 1600,520 1600,720'/></g></svg>\") bottom/cover no-repeat";

const CYBERPUNK_BG =
  "radial-gradient(ellipse at 80% 0%, rgba(255, 43, 214, 0.2), transparent 40%), radial-gradient(ellipse at 0% 100%, rgba(0, 255, 213, 0.15), transparent 40%), linear-gradient(180deg, #05060a 60%, #1a0a2a 100%)";

const DND_BG =
  "radial-gradient(ellipse at center, rgba(230, 176, 74, 0.10), transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(255, 106, 61, 0.18), transparent 50%), linear-gradient(180deg, #1a0f08 0%, #2b1b10 100%)";

/**
 * BBS background: tribute to **Baron's Flying Service** (313-738-8222 →
 * 248-738-8222, Waterford MI, sysop Art Warren, T.A.G. software,
 * 1985-2009) — one of the longest-running BBSes in the Detroit metro area.
 * Source: http://bbslist.textfiles.com/248/oldschool.html
 *
 * Includes a tribute line for other Detroit-area boards from that era.
 */
const BBS_BG = (() => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2560 720' preserveAspectRatio='xMidYMid slice'>
  <defs>
    <style>
      .a{font-family:'VT323','IBM Plex Mono','Share Tech Mono',monospace;font-size:32px;letter-spacing:0.5px}
      .b{font-family:'VT323',monospace;font-size:88px;letter-spacing:6px}
      .s{font-family:'VT323',monospace;font-size:22px}
      .m{font-family:'VT323',monospace;font-size:24px;letter-spacing:2px}
    </style>
  </defs>
  <rect width='2560' height='720' fill='#000080'/>

  <!-- top + bottom double-line border -->
  <g class='a' fill='#aaaaaa'>
    <text x='40' y='60'>╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗</text>
    <text x='40' y='680'>╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝</text>
  </g>
  <!-- side bars -->
  <g class='a' fill='#aaaaaa'>
    <text x='40' y='90'>║</text><text x='2476' y='90'>║</text>
    <text x='40' y='130'>║</text><text x='2476' y='130'>║</text>
    <text x='40' y='170'>║</text><text x='2476' y='170'>║</text>
    <text x='40' y='210'>║</text><text x='2476' y='210'>║</text>
    <text x='40' y='250'>║</text><text x='2476' y='250'>║</text>
    <text x='40' y='290'>║</text><text x='2476' y='290'>║</text>
    <text x='40' y='330'>║</text><text x='2476' y='330'>║</text>
    <text x='40' y='370'>║</text><text x='2476' y='370'>║</text>
    <text x='40' y='410'>║</text><text x='2476' y='410'>║</text>
    <text x='40' y='450'>║</text><text x='2476' y='450'>║</text>
    <text x='40' y='490'>║</text><text x='2476' y='490'>║</text>
    <text x='40' y='530'>║</text><text x='2476' y='530'>║</text>
    <text x='40' y='570'>║</text><text x='2476' y='570'>║</text>
    <text x='40' y='610'>║</text><text x='2476' y='610'>║</text>
    <text x='40' y='650'>║</text><text x='2476' y='650'>║</text>
  </g>
  <!-- inner separators -->
  <g class='a' fill='#55ffff'>
    <text x='40' y='250'>╠══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣</text>
    <text x='40' y='560'>╠══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣</text>
  </g>

  <!-- BARON'S big wordmark -->
  <g class='b' fill='#55ffff'>
    <text x='240' y='180'>▓█████  ▄▄▄       ██▀███   ▒█████   ███▄    █     '   ██████</text>
  </g>
  <g class='s' fill='#0000aa'>
    <text x='244' y='210'>▒▒▒▒▒  ▒▒▒       ▒▒  ▒▒    ▒▒▒▒▒   ▒▒▒    ▒        ▒▒▒▒▒▒</text>
  </g>
  <!-- subtitle: FLYING SERVICE -->
  <g class='m' fill='#ffff55'>
    <text x='320' y='240'>F L Y I N G   S E R V I C E   ░▒▓ B B S ▓▒░   ·   T.A.G.   ·   Established 1985   ·   Waterford, MI</text>
  </g>

  <!-- Biplane ASCII art (right side, inside top panel) -->
  <g class='a' fill='#ff55ff'>
    <text x='1860' y='100'>            __|__</text>
    <text x='1860' y='130'>     --o--(_)--o--</text>
    <text x='1860' y='160'>       --=======-</text>
    <text x='1860' y='190'>     /            \\</text>
    <text x='1860' y='220'>    /______________\\</text>
  </g>

  <!-- Main menu (left side) -->
  <g class='a'>
    <text x='80' y='300' fill='#55ff55'>┌──────────── MAIN MENU ─────────────┐</text>
    <text x='80' y='340' fill='#55ff55'>│</text> <text x='112' y='340' fill='#ffff55'>[F]</text> <text x='168' y='340' fill='#ffffff'>File Areas    .. 24 CD-ROMs online</text> <text x='800' y='340' fill='#55ff55'>│</text>
    <text x='80' y='380' fill='#55ff55'>│</text> <text x='112' y='380' fill='#ffff55'>[M]</text> <text x='168' y='380' fill='#ffffff'>Message Bases ..  FidoNet 1:120</text>     <text x='800' y='380' fill='#55ff55'>│</text>
    <text x='80' y='420' fill='#55ff55'>│</text> <text x='112' y='420' fill='#ffff55'>[D]</text> <text x='168' y='420' fill='#ffffff'>Door Games    .. LORD, TW2002, BRE</text>  <text x='800' y='420' fill='#55ff55'>│</text>
    <text x='80' y='460' fill='#55ff55'>│</text> <text x='112' y='460' fill='#ffff55'>[E]</text> <text x='168' y='460' fill='#ffffff'>NetMail / Email</text>                     <text x='800' y='460' fill='#55ff55'>│</text>
    <text x='80' y='500' fill='#55ff55'>│</text> <text x='112' y='500' fill='#ffff55'>[C]</text> <text x='168' y='500' fill='#ffffff'>Chat with Sysop (ART WARREN)</text>       <text x='800' y='500' fill='#55ff55'>│</text>
    <text x='80' y='540' fill='#55ff55'>└────────────────────────────────────┘</text>
  </g>

  <!-- Greets / shoutouts (right side, inside middle panel) -->
  <g class='a' fill='#ffff55'>
    <text x='1320' y='300'>░▒▓ GREETZ TO THE 313 / 810 SCENE ▓▒░</text>
  </g>
  <g class='s' fill='#ffffff'>
    <text x='1320' y='340'>· Woody's Nest · The Jungle</text>
    <text x='1320' y='370'>· Hartland Pride · The Club II</text>
    <text x='1320' y='400'>· Tower of High Sorcery · Falcon's Lair</text>
    <text x='1320' y='430'>· The Praise Board · Tandy Harbor</text>
    <text x='1320' y='460'>· The Snake Pit · The Robot Factory</text>
    <text x='1320' y='490'>· Genesis II · The Outpost · Cross Corner</text>
    <text x='1320' y='520'>· Big Blue Globe · Utility City</text>
  </g>

  <!-- status bar -->
  <g class='a' fill='#ffff55'>
    <text x='80' y='600'>Sysop: ART WARREN    Node: 01    Time On: 0:42    Calls Today: 1,994    Last Caller: PHRACK</text>
  </g>
  <g class='a' fill='#55ffff'>
    <text x='80' y='640'>Connected to 313-738-8222 at 28800 baud · ANSI · 8N1 · » CARRIER 28800 «  ░▒▓████████████▓▒░</text>
  </g>
</svg>`.replace(/\s+/g, ' ').trim();
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") center/cover no-repeat, #000080`;
})();

const EIGHTBIT_BG =
  "linear-gradient(180deg, #00479c 0%, #00479c 70%, #58e000 70%, #58e000 100%)";

/* ---------- themes ---------- */

export const pipboy: Theme = {
  id: 'pipboy',
  name: 'Pip-Boy',
  description: 'Vault-Tec approved CRT terminal aesthetic',
  background: PIPBOY_BG,
  tokens: {
    bg: '#020a04', bgElevated: '#04140a', bgPanel: '#062012',
    fg: '#7cff8a', fgMuted: '#3aa84a',
    accent: '#7cff8a', accentSoft: '#1f5a2a', accentHot: '#b6ffae',
    warn: '#ffb14a', good: '#7cff8a', border: '#1f7a35',
    fontUi: '"VT323", "Share Tech Mono", "Consolas", monospace',
    fontMono: '"VT323", "Share Tech Mono", "Consolas", monospace',
    fontDisplay: '"Monoton", "VT323", monospace',
    radius: '4px', pad: '14px',
    scanlines: true, glow: true, vignette: true, noise: true
  },
  effects: { clickSound: null, bootSound: null }
};

export const dark: Theme = {
  id: 'dark',
  name: 'Dark',
  description: 'Modern minimalist dark UI',
  background: DARK_BG,
  tokens: {
    bg: '#0b0d10', bgElevated: '#13171c', bgPanel: '#181d23',
    fg: '#e7ecf3', fgMuted: '#8a93a0',
    accent: '#5aa9ff', accentSoft: '#23344a', accentHot: '#7cc0ff',
    warn: '#ffb14a', good: '#5fe39a', border: '#262d36',
    fontUi: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    fontMono: 'ui-monospace, "JetBrains Mono", Consolas, monospace',
    fontDisplay: 'system-ui, sans-serif',
    radius: '12px', pad: '16px',
    scanlines: false, glow: false, vignette: false, noise: false
  },
  effects: { clickSound: null }
};

export const synthwave: Theme = {
  id: 'synthwave',
  name: 'Synthwave',
  description: 'Neon grid, sunset gradients',
  background: SYNTHWAVE_BG,
  tokens: {
    bg: '#1a0933', bgElevated: '#2a1052', bgPanel: '#321461',
    fg: '#ffd0ff', fgMuted: '#a982e0',
    accent: '#ff4ad8', accentSoft: '#5c1a8a', accentHot: '#ffe14a',
    warn: '#ffb14a', good: '#4afff0', border: '#5c1a8a',
    fontUi: '"Orbitron", "Audiowide", system-ui, sans-serif',
    fontMono: 'ui-monospace, monospace',
    fontDisplay: '"Audiowide", "Orbitron", sans-serif',
    radius: '6px', pad: '14px',
    scanlines: false, glow: true, vignette: true, noise: false
  },
  effects: { clickSound: null }
};

export const nord: Theme = {
  id: 'nord',
  name: 'Nord',
  description: 'Calm arctic palette',
  background: NORD_BG,
  tokens: {
    bg: '#2e3440', bgElevated: '#3b4252', bgPanel: '#434c5e',
    fg: '#eceff4', fgMuted: '#a9b1c0',
    accent: '#88c0d0', accentSoft: '#4c566a', accentHot: '#8fbcbb',
    warn: '#ebcb8b', good: '#a3be8c', border: '#4c566a',
    fontUi: 'Inter, system-ui, sans-serif',
    fontMono: 'ui-monospace, "JetBrains Mono", monospace',
    fontDisplay: 'Inter, sans-serif',
    radius: '10px', pad: '14px',
    scanlines: false, glow: false, vignette: false, noise: false
  },
  effects: { clickSound: null }
};

export const cyberpunk: Theme = {
  id: 'cyberpunk',
  name: 'Cyberpunk',
  description: 'Night City: hot yellow + cyan + magenta on black',
  background: CYBERPUNK_BG,
  tokens: {
    bg: '#05060a', bgElevated: '#0c0e1a', bgPanel: '#10142a',
    fg: '#ffe14a', fgMuted: '#7a86b8',
    accent: '#fcee0c', accentSoft: '#3a2c00', accentHot: '#ff2bd6',
    warn: '#ff6f3c', good: '#00ffd5', border: '#2a1a55',
    fontUi: '"Rajdhani", "Orbitron", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", "Share Tech Mono", monospace',
    fontDisplay: '"Orbitron", "Audiowide", "Rajdhani", sans-serif',
    radius: '2px', pad: '14px',
    scanlines: false, glow: true, vignette: true, noise: true
  },
  effects: { clickSound: null }
};

export const dnd: Theme = {
  id: 'dnd',
  name: 'Dragon Lair',
  description: 'Parchment, gold, and dragonfire — for the tabletop adventurer',
  background: DND_BG,
  tokens: {
    bg: '#1a0f08', bgElevated: '#2b1b10', bgPanel: '#3a2616',
    fg: '#f3dfb3', fgMuted: '#a48c5e',
    accent: '#e6b04a', accentSoft: '#6b4318', accentHot: '#ff6a3d',
    warn: '#ff8a3d', good: '#9bc26b', border: '#5a3818',
    fontUi: '"Cinzel", "IM Fell English", "Cormorant Garamond", Georgia, serif',
    fontMono: '"IM Fell English", Georgia, serif',
    fontDisplay: '"Cinzel Decorative", "Cinzel", "UnifrakturCook", serif',
    radius: '2px', pad: '16px',
    scanlines: false, glow: true, vignette: true, noise: true
  },
  effects: { clickSound: null }
};

export const bbs: Theme = {
  id: 'bbs',
  name: 'ANSI BBS',
  description: 'Dial-up modems and ANSI block art on royal blue',
  background: BBS_BG,
  tokens: {
    bg: '#000080',
    bgElevated: '#000055',
    bgPanel: '#0000aa',
    fg: '#ffff55',
    fgMuted: '#aaaaaa',
    accent: '#55ffff',
    accentSoft: '#005555',
    accentHot: '#ff55ff',
    warn: '#ffaa00',
    good: '#55ff55',
    border: '#aaaaaa',
    fontUi: '"VT323", "IBM Plex Mono", "Share Tech Mono", monospace',
    fontMono: '"VT323", "IBM Plex Mono", "Share Tech Mono", monospace',
    fontDisplay: '"VT323", "IBM Plex Mono", monospace',
    radius: '0px',
    pad: '12px',
    scanlines: true,
    glow: true,
    vignette: false,
    noise: false
  },
  effects: { clickSound: null }
};

export const eightbit: Theme = {
  id: 'eightbit',
  name: '8-Bit',
  description: 'NES-era pixel art with bright primaries',
  background: EIGHTBIT_BG,
  tokens: {
    bg: '#00479c',
    bgElevated: '#1b2a4e',
    bgPanel: '#0a0a23',
    fg: '#ffffff',
    fgMuted: '#a0c0ff',
    accent: '#ffd866',
    accentSoft: '#3e2d00',
    accentHot: '#ff5050',
    warn: '#ff5050',
    good: '#58e000',
    border: '#000000',
    fontUi: '"Press Start 2P", "VT323", monospace',
    fontMono: '"Press Start 2P", "VT323", monospace',
    fontDisplay: '"Press Start 2P", "VT323", monospace',
    radius: '0px',
    pad: '14px',
    scanlines: false,
    glow: false,
    vignette: false,
    noise: false
  },
  effects: { clickSound: null }
};

export const nhl: Theme = {
  id: 'nhl',
  name: 'NHL Team',
  description: 'Pick any NHL team — colors and rink-themed background apply',
  // background, accent, etc. are derived per-team in ThemeProvider
  background: null,
  tokens: {
    bg: '#0b0d10', bgElevated: '#13171c', bgPanel: '#181d23',
    fg: '#ffffff', fgMuted: '#a0a8b3',
    accent: '#CE1126', accentSoft: '#3a0a10', accentHot: '#ffffff',
    warn: '#ffb14a', good: '#5fe39a', border: '#2a323a',
    fontUi: '"Inter", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, monospace',
    fontDisplay: '"Oswald", "Inter", system-ui, sans-serif',
    radius: '6px', pad: '14px',
    scanlines: false, glow: false, vignette: true, noise: false
  },
  effects: { clickSound: null }
};

export const THEMES: Theme[] = [pipboy, dark, synthwave, nord, cyberpunk, dnd, bbs, eightbit, nhl];

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? dark;
}
