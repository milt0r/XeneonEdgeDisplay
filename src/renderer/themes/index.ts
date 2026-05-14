import type { Theme } from './theme';
export type { Theme } from './theme';

/* ---------- backgrounds (pure CSS, no network) ---------- */

const PIPBOY_BG =
  // Stacked phosphor canvas — soft green spotlight + tight scanlines + base
  "radial-gradient(ellipse at 50% 60%, rgba(31, 122, 53, 0.30), transparent 70%), repeating-linear-gradient(0deg, rgba(31, 122, 53, 0.10) 0, rgba(31, 122, 53, 0.10) 1px, transparent 2px, transparent 4px), #020a04";

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
 * BBS background: dial-up era tribute screen (Detroit-area metro,
 * c. 1985-2000s).
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
    <text x='80' y='500' fill='#55ff55'>│</text> <text x='112' y='500' fill='#ffff55'>[C]</text> <text x='168' y='500' fill='#ffffff'>Chat with Sysop</text>                       <text x='800' y='500' fill='#55ff55'>│</text>
    <text x='80' y='540' fill='#55ff55'>└────────────────────────────────────┘</text>
  </g>

  <!-- Greets / shoutouts (right side, inside middle panel) -->
  <g class='a' fill='#ffff55'>
    <text x='1320' y='300'>░▒▓ NORTH OAKLAND CO. · 313/810 ▓▒░</text>
  </g>
  <g class='s' fill='#ffffff'>
    <text x='1320' y='340'>· Cat's Meow · Lake Orion · TAG</text>
    <text x='1320' y='370'>· Les's Place: The Mansion · Orion</text>
    <text x='1320' y='400'>· Twin Star II · Waterford</text>
    <text x='1320' y='430'>· Sawblade · Waterford · (Iron Maiden)</text>
    <text x='1320' y='460'>· The Mafia · Pontiac · Telegard</text>
    <text x='1320' y='490'>· Southern Cross · Lapeer</text>
    <text x='1320' y='520'>· Utility City · Auburn Hills · FidoNet hub</text>
  </g>

  <!-- status bar -->
  <g class='a' fill='#ffff55'>
    <text x='80' y='600'>Sysop: SYSOP         Node: 01    Time On: 0:42    Calls Today: 1,994    Last Caller: PHRACK</text>
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
    fontDisplay: '"Monoton", "VT323", "Share Tech Mono", monospace',
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

/* ---------- Per-league sport themes (team picker via ThemeProvider) ---------- */

function leagueTheme(id: string, name: string, description: string, primary: string, accentHot: string): Theme {
  return {
    id,
    name,
    description,
    background: null,
    tokens: {
      bg: '#0b0d10', bgElevated: '#13171c', bgPanel: '#181d23',
      fg: '#ffffff', fgMuted: '#a0a8b3',
      accent: primary, accentSoft: '#1a2030', accentHot,
      warn: '#ffb14a', good: '#5fe39a', border: '#2a323a',
      fontUi: '"Inter", system-ui, sans-serif',
      fontMono: '"JetBrains Mono", ui-monospace, monospace',
      fontDisplay: '"Oswald", "Inter", system-ui, sans-serif',
      radius: '6px', pad: '14px',
      scanlines: false, glow: false, vignette: true, noise: false
    },
    effects: { clickSound: null }
  };
}

export const nhl = leagueTheme('nhl', 'NHL', 'Pick any NHL team — colors and rink-themed background apply', '#CE1126', '#ffffff');
export const nfl = leagueTheme('nfl', 'NFL', 'Pick any NFL team — colors and gridiron background apply', '#013369', '#D50A0A');
export const nba = leagueTheme('nba', 'NBA', 'Pick any NBA team — colors and court background apply', '#C9082B', '#17408B');
export const mlb = leagueTheme('mlb', 'MLB', 'Pick any MLB team — colors and diamond background apply', '#002D72', '#E81828');
export const f1  = leagueTheme('f1',  'Formula 1', 'Pick any F1 constructor — colors and racetrack background apply', '#E10600', '#FFFFFF');
export const nascar = leagueTheme('nascar', 'NASCAR', 'Pick any NASCAR team — colors and oval racetrack background apply', '#FFD100', '#000000');

/* ============================================================
 * Extra themes (sci-fi, games, pop-culture, aesthetic, retro,
 * music, Detroit-local). Backgrounds are inline SVG / gradient
 * data URIs with no network fetch.
 * ============================================================ */

const enc = (s: string) => `url("data:image/svg+xml;utf8,${encodeURIComponent(s.replace(/\s+/g, ' ').trim())}")`;

/* ---------- Sci-Fi ---------- */

export const lcars: Theme = {
  id: 'lcars',
  name: 'LCARS',
  description: 'Star Trek Okudagram panels in peach, amber, and lavender',
  background:
    'radial-gradient(ellipse at 0% 0%, rgba(255,153,102,0.18), transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(204,153,204,0.14), transparent 50%), #000000',
  tokens: {
    bg: '#000000', bgElevated: '#161616', bgPanel: '#1c1c1c',
    fg: '#ffcc99', fgMuted: '#cc99cc',
    accent: '#ff9966', accentSoft: '#3a1a08', accentHot: '#ffcc66',
    warn: '#cc6666', good: '#99ccff', border: '#cc6666',
    fontUi: '"Antonio", "Oswald", Helvetica, Arial, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, monospace',
    fontDisplay: '"Antonio", "Oswald", Helvetica, sans-serif',
    radius: '24px', pad: '14px',
    scanlines: false, glow: true, vignette: true, noise: false
  },
  effects: { clickSound: null }
};

export const nostromo: Theme = {
  id: 'nostromo',
  name: 'Nostromo',
  description: 'MU-TH-UR 6000 — green phosphor terminal aboard the USCSS Nostromo',
  background:
    'radial-gradient(ellipse at 50% 50%, rgba(40, 200, 80, 0.10), transparent 70%), repeating-linear-gradient(0deg, rgba(40, 200, 80, 0.05) 0, rgba(40, 200, 80, 0.05) 1px, transparent 2px, transparent 4px), #000000',
  tokens: {
    bg: '#000000', bgElevated: '#001a05', bgPanel: '#002a08',
    fg: '#33ff66', fgMuted: '#1f8a3a',
    accent: '#33ff66', accentSoft: '#0d3b18', accentHot: '#aaffaa',
    warn: '#ffaa33', good: '#33ff66', border: '#1f8a3a',
    fontUi: '"VT323", "Share Tech Mono", monospace',
    fontMono: '"VT323", monospace',
    fontDisplay: '"VT323", monospace',
    radius: '0px', pad: '12px',
    scanlines: true, glow: true, vignette: true, noise: true
  },
  effects: { clickSound: null }
};

export const halo: Theme = {
  id: 'halo',
  name: 'Cortana',
  description: 'UNSC HUD: deep navy with holographic cyan',
  background: enc(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
    <defs><pattern id='h' x='0' y='0' width='40' height='35' patternUnits='userSpaceOnUse'>
      <path d='M20 0 L40 12 L40 35 L20 47 L0 35 L0 12 Z' fill='none' stroke='%2300d4ff' stroke-opacity='0.12' stroke-width='1'/>
    </pattern></defs>
    <rect width='200' height='200' fill='%23030814'/><rect width='200' height='200' fill='url(%23h)'/></svg>`) + ' repeat, #030814',
  tokens: {
    bg: '#030814', bgElevated: '#091428', bgPanel: '#0e1d3a',
    fg: '#cfeeff', fgMuted: '#6a90b8',
    accent: '#00d4ff', accentSoft: '#0c3a55', accentHot: '#7afff0',
    warn: '#ffb14a', good: '#5fe39a', border: '#1c3050',
    fontUi: '"Rajdhani", "Orbitron", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    fontDisplay: '"Orbitron", "Rajdhani", sans-serif',
    radius: '4px', pad: '14px',
    scanlines: false, glow: true, vignette: true, noise: false
  },
  effects: { clickSound: null }
};

export const xfiles: Theme = {
  id: 'xfiles',
  name: 'X-Files',
  description: 'The truth is out there — green CRT case file',
  background: enc(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2560 720' preserveAspectRatio='xMidYMid slice'>
    <defs>
      <radialGradient id='spot' cx='50%' cy='50%' r='65%'>
        <stop offset='0%' stop-color='%23001a00' stop-opacity='1'/>
        <stop offset='100%' stop-color='%23000000' stop-opacity='1'/>
      </radialGradient>
    </defs>
    <rect width='2560' height='720' fill='url(%23spot)'/>
    <g font-family='Special Elite, VT323, monospace' fill='%2333ff33' opacity='0.18'>
      <text x='1280' y='160' text-anchor='middle' font-size='110' letter-spacing='10'>THE TRUTH IS OUT THERE</text>
      <text x='1280' y='560' text-anchor='middle' font-size='80' letter-spacing='8'>I  W A N T  T O  B E L I E V E</text>
    </g>
    <g fill='none' stroke='%2333ff33' stroke-opacity='0.25' stroke-width='2'>
      <circle cx='1280' cy='360' r='220'/>
      <circle cx='1280' cy='360' r='160'/>
      <line x1='1060' y1='360' x2='1500' y2='360'/>
      <line x1='1280' y1='140' x2='1280' y2='580'/>
    </g>
    <g font-family='Special Elite, VT323, monospace' fill='%2333ff33' opacity='0.45' font-size='22'>
      <text x='80' y='60'>FBI · CASE FILE 7012-X · CLASSIFIED · LEVEL 4</text>
      <text x='80' y='700'>FOX MULDER · DANA SCULLY · J. EDGAR HOOVER BLDG · WASHINGTON DC</text>
    </g>
  </svg>`) + ' center/cover no-repeat, #000000',
  tokens: {
    bg: '#000000', bgElevated: '#031003', bgPanel: '#062006',
    fg: '#33ff33', fgMuted: '#1a8a1a',
    accent: '#33ff33', accentSoft: '#0a2a0a', accentHot: '#aaffaa',
    warn: '#ff5555', good: '#33ff33', border: '#1a5a1a',
    fontUi: '"Special Elite", "VT323", monospace',
    fontMono: '"Special Elite", "VT323", monospace',
    fontDisplay: '"Special Elite", "VT323", monospace',
    radius: '0px', pad: '14px',
    scanlines: true, glow: true, vignette: true, noise: true
  },
  effects: { clickSound: null }
};

/* ---------- Games ---------- */

export const minecraft: Theme = {
  id: 'minecraft',
  name: 'Minecraft',
  description: 'Grass blocks, dirt borders, blocky pixel font',
  background: enc(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 200' shape-rendering='crispEdges'>
    <rect width='320' height='40' fill='%2387ceeb'/>
    <g fill='%23ffffff' opacity='0.8'><rect x='40' y='10' width='40' height='10'/><rect x='200' y='15' width='50' height='8'/></g>
    <rect y='40' width='320' height='30' fill='%2360c040'/>
    <g fill='%2378d040'><rect y='40' width='10' height='6'/><rect x='30' y='40' width='6' height='4'/><rect x='80' y='40' width='14' height='8'/><rect x='160' y='40' width='8' height='5'/><rect x='220' y='40' width='12' height='7'/></g>
    <rect y='70' width='320' height='130' fill='%23805020'/>
    <g fill='%23603810'><rect x='30' y='80' width='14' height='14'/><rect x='100' y='110' width='18' height='14'/><rect x='200' y='90' width='12' height='12'/><rect x='250' y='150' width='20' height='14'/></g>
    <g fill='%239f6028'><rect x='80' y='140' width='14' height='10'/><rect x='180' y='170' width='16' height='12'/></g>
  </svg>`) + ' center/cover no-repeat, #87ceeb',
  tokens: {
    bg: '#5a3010', bgElevated: '#704018', bgPanel: '#805020',
    fg: '#ffffff', fgMuted: '#d0c8a0',
    accent: '#60c040', accentSoft: '#1f4818', accentHot: '#a4f070',
    warn: '#e0a020', good: '#60c040', border: '#3a2010',
    fontUi: '"Press Start 2P", "VT323", monospace',
    fontMono: '"Press Start 2P", "VT323", monospace',
    fontDisplay: '"Press Start 2P", "VT323", monospace',
    radius: '0px', pad: '14px',
    scanlines: false, glow: false, vignette: false, noise: true
  },
  effects: { clickSound: null }
};

export const doom: Theme = {
  id: 'doom',
  name: 'Doom',
  description: 'UAC infirmary status bar — red, brown, grey, blood',
  background:
    'linear-gradient(180deg, #1a0a0a 0%, #2a1010 60%, #5a1a0a 100%), repeating-linear-gradient(45deg, rgba(0,0,0,0.2) 0 6px, transparent 6px 12px)',
  tokens: {
    bg: '#1a0a0a', bgElevated: '#2a1010', bgPanel: '#3a1812',
    fg: '#e0d0a0', fgMuted: '#a08c5a',
    accent: '#ff2222', accentSoft: '#5a0a0a', accentHot: '#ffd060',
    warn: '#ff8c20', good: '#22cc22', border: '#5a2a18',
    fontUi: '"Bungee", "Press Start 2P", Impact, sans-serif',
    fontMono: '"VT323", monospace',
    fontDisplay: '"Bungee", Impact, sans-serif',
    radius: '0px', pad: '14px',
    scanlines: false, glow: true, vignette: true, noise: true
  },
  effects: { clickSound: null }
};

export const blackmesa: Theme = {
  id: 'blackmesa',
  name: 'Black Mesa',
  description: 'Lambda labs — orange hazard + grey concrete',
  background:
    'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%), repeating-linear-gradient(-45deg, rgba(255, 140, 0, 0.04) 0 24px, transparent 24px 48px)',
  tokens: {
    bg: '#1a1a1a', bgElevated: '#262626', bgPanel: '#333333',
    fg: '#e8e8e8', fgMuted: '#9a9a9a',
    accent: '#ff8c00', accentSoft: '#3a2208', accentHot: '#ffb84a',
    warn: '#ffb14a', good: '#5fe39a', border: '#3a3a3a',
    fontUi: '"Rajdhani", "Inter", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    fontDisplay: '"Rajdhani", sans-serif',
    radius: '2px', pad: '14px',
    scanlines: false, glow: false, vignette: true, noise: true
  },
  effects: { clickSound: null }
};

export const stardew: Theme = {
  id: 'stardew',
  name: 'Stardew Valley',
  description: 'Pixel cottagecore in pastel greens and warm wood',
  background:
    'linear-gradient(180deg, #ffd9a0 0%, #f7c890 30%, #88c070 60%, #5ca050 100%)',
  tokens: {
    bg: '#3a2a1a', bgElevated: '#5a4030', bgPanel: '#6a4a36',
    fg: '#fff4d6', fgMuted: '#d4b890',
    accent: '#88c070', accentSoft: '#3a5a28', accentHot: '#ffd866',
    warn: '#ff9c66', good: '#88c070', border: '#3a2a1a',
    fontUi: '"Press Start 2P", "VT323", monospace',
    fontMono: '"VT323", monospace',
    fontDisplay: '"Press Start 2P", monospace',
    radius: '0px', pad: '14px',
    scanlines: false, glow: false, vignette: true, noise: false
  },
  effects: { clickSound: null }
};

/* ---------- Pop-culture ---------- */

export const severance: Theme = {
  id: 'severance',
  name: 'Severance',
  description: 'Lumon Industries — austere mid-century corporate beige and ice-blue',
  background:
    'radial-gradient(ellipse at center, rgba(110, 180, 220, 0.06), transparent 60%), repeating-radial-gradient(circle at 30% 30%, rgba(0,0,0,0.06) 0 1px, transparent 1px 8px), #d8d4c4',
  tokens: {
    bg: '#d8d4c4', bgElevated: '#c4bfa8', bgPanel: '#bbb59e',
    fg: '#1a2030', fgMuted: '#5a6080',
    accent: '#2a5a90', accentSoft: '#a8b5c8', accentHot: '#0a2050',
    warn: '#a86040', good: '#406a30', border: '#9a9580',
    fontUi: '"IBM Plex Mono", "JetBrains Mono", monospace',
    fontMono: '"IBM Plex Mono", "JetBrains Mono", monospace',
    fontDisplay: '"IBM Plex Mono", monospace',
    radius: '0px', pad: '16px',
    scanlines: false, glow: false, vignette: true, noise: false
  },
  effects: { clickSound: null }
};

export const wesanderson: Theme = {
  id: 'wesanderson',
  name: 'Wes Anderson',
  description: 'Pastel symmetry — warm pink, mustard yellow, mint, deep teal',
  background:
    'linear-gradient(180deg, #f4c8c0 0%, #f4c8c0 33%, #f0d896 33%, #f0d896 66%, #b8d8c8 66%, #b8d8c8 100%)',
  tokens: {
    bg: '#f4c8c0', bgElevated: '#f0d896', bgPanel: '#fff4e8',
    fg: '#3a2018', fgMuted: '#7a5a4a',
    accent: '#c84838', accentSoft: '#e8b8a0', accentHot: '#1a4858',
    warn: '#e08a3a', good: '#5a8a6a', border: '#c89878',
    fontUi: '"Futura", "Inter", "Nunito", sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    fontDisplay: '"Futura", "Inter", sans-serif',
    radius: '0px', pad: '16px',
    scanlines: false, glow: false, vignette: true, noise: false
  },
  effects: { clickSound: null }
};

export const f1pit: Theme = {
  id: 'f1pit',
  name: 'F1 Pit Wall',
  description: 'Carbon-fibre weave with checkered-flag accents and telemetry red',
  background: enc(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'>
    <rect width='80' height='80' fill='%23151515'/>
    <g stroke='%23222222' stroke-width='1'>
      <path d='M0 0 L80 80 M0 80 L80 0'/>
      <path d='M0 40 L40 80 L80 40 L40 0 Z' fill='%231a1a1a'/>
    </g>
  </svg>`) + ' repeat, #151515',
  tokens: {
    bg: '#101010', bgElevated: '#1a1a1a', bgPanel: '#222222',
    fg: '#e8e8e8', fgMuted: '#888888',
    accent: '#e10600', accentSoft: '#3a0a08', accentHot: '#ffffff',
    warn: '#ffd100', good: '#00d05a', border: '#2a2a2a',
    fontUi: '"Rajdhani", "Inter", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    fontDisplay: '"Orbitron", "Rajdhani", sans-serif',
    radius: '2px', pad: '14px',
    scanlines: false, glow: true, vignette: false, noise: false
  },
  effects: { clickSound: null }
};

export const apollo: Theme = {
  id: 'apollo',
  name: 'Apollo MOCR',
  description: 'NASA Mission Control — gunmetal grey, mission patch teal',
  background:
    'linear-gradient(180deg, #2a2e34 0%, #1f2228 100%), radial-gradient(circle at 80% 20%, rgba(0,180,180,0.08), transparent 50%)',
  tokens: {
    bg: '#1f2228', bgElevated: '#2a2e34', bgPanel: '#353a42',
    fg: '#eaeaea', fgMuted: '#9aa0a8',
    accent: '#00b4b4', accentSoft: '#0a3a3a', accentHot: '#ffffff',
    warn: '#ffb14a', good: '#5fe39a', border: '#3a3f48',
    fontUi: '"IBM Plex Mono", "JetBrains Mono", monospace',
    fontMono: '"IBM Plex Mono", "JetBrains Mono", monospace',
    fontDisplay: '"IBM Plex Mono", "Inter", monospace',
    radius: '4px', pad: '14px',
    scanlines: false, glow: false, vignette: true, noise: false
  },
  effects: { clickSound: null }
};

/* ---------- Aesthetic / Editor palettes ---------- */

export const solarizedDark: Theme = {
  id: 'solarized-dark',
  name: 'Solarized Dark',
  description: 'Ethan Schoonover\'s dark variant',
  background: 'radial-gradient(ellipse at center, #073642, #002b36 100%)',
  tokens: {
    bg: '#002b36', bgElevated: '#073642', bgPanel: '#0e4250',
    fg: '#eee8d5', fgMuted: '#93a1a1',
    accent: '#268bd2', accentSoft: '#0a3a5a', accentHot: '#b58900',
    warn: '#cb4b16', good: '#859900', border: '#586e75',
    fontUi: '"Inter", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", "IBM Plex Mono", monospace',
    fontDisplay: '"Inter", sans-serif',
    radius: '6px', pad: '14px',
    scanlines: false, glow: false, vignette: false, noise: false
  },
  effects: { clickSound: null }
};

export const solarizedLight: Theme = {
  id: 'solarized-light',
  name: 'Solarized Light',
  description: 'Light variant for daytime use',
  background: 'radial-gradient(ellipse at center, #fdf6e3, #eee8d5 100%)',
  tokens: {
    bg: '#fdf6e3', bgElevated: '#eee8d5', bgPanel: '#ffffff',
    fg: '#073642', fgMuted: '#586e75',
    accent: '#268bd2', accentSoft: '#bee4f5', accentHot: '#cb4b16',
    warn: '#cb4b16', good: '#859900', border: '#93a1a1',
    fontUi: '"Inter", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    fontDisplay: '"Inter", sans-serif',
    radius: '6px', pad: '14px',
    scanlines: false, glow: false, vignette: false, noise: false
  },
  effects: { clickSound: null }
};

export const catppuccin: Theme = {
  id: 'catppuccin',
  name: 'Catppuccin Mocha',
  description: 'Soothing pastel theme beloved by devs',
  background: 'radial-gradient(circle at 0% 0%, #313244, #1e1e2e 60%)',
  tokens: {
    bg: '#1e1e2e', bgElevated: '#181825', bgPanel: '#313244',
    fg: '#cdd6f4', fgMuted: '#a6adc8',
    accent: '#cba6f7', accentSoft: '#3a2c4a', accentHot: '#f5c2e7',
    warn: '#fab387', good: '#a6e3a1', border: '#45475a',
    fontUi: '"Inter", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    fontDisplay: '"Inter", sans-serif',
    radius: '8px', pad: '14px',
    scanlines: false, glow: false, vignette: false, noise: false
  },
  effects: { clickSound: null }
};

export const tokyonight: Theme = {
  id: 'tokyonight',
  name: 'Tokyo Night',
  description: 'Purple-tinted dark with neon highlights',
  background: 'radial-gradient(ellipse at 100% 0%, #414868, #1a1b26 70%)',
  tokens: {
    bg: '#1a1b26', bgElevated: '#24283b', bgPanel: '#2f334d',
    fg: '#c0caf5', fgMuted: '#7982a9',
    accent: '#7aa2f7', accentSoft: '#1c2e54', accentHot: '#bb9af7',
    warn: '#e0af68', good: '#9ece6a', border: '#414868',
    fontUi: '"Inter", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    fontDisplay: '"Inter", sans-serif',
    radius: '6px', pad: '14px',
    scanlines: false, glow: false, vignette: false, noise: false
  },
  effects: { clickSound: null }
};

export const gruvbox: Theme = {
  id: 'gruvbox',
  name: 'Gruvbox Dark',
  description: 'Warm retro terminal',
  background: 'radial-gradient(ellipse at center, #3c3836, #282828 70%)',
  tokens: {
    bg: '#282828', bgElevated: '#32302f', bgPanel: '#3c3836',
    fg: '#ebdbb2', fgMuted: '#a89984',
    accent: '#fabd2f', accentSoft: '#3a2a08', accentHot: '#fe8019',
    warn: '#fb4934', good: '#b8bb26', border: '#504945',
    fontUi: '"JetBrains Mono", ui-monospace, monospace',
    fontMono: '"JetBrains Mono", monospace',
    fontDisplay: '"JetBrains Mono", monospace',
    radius: '4px', pad: '14px',
    scanlines: false, glow: false, vignette: false, noise: false
  },
  effects: { clickSound: null }
};

export const monokai: Theme = {
  id: 'monokai',
  name: 'Monokai Pro',
  description: 'Vibrant code-editor classic',
  background: 'linear-gradient(135deg, #2d2a2e 0%, #221f22 100%)',
  tokens: {
    bg: '#221f22', bgElevated: '#2d2a2e', bgPanel: '#403e41',
    fg: '#fcfcfa', fgMuted: '#939293',
    accent: '#ff6188', accentSoft: '#4a1c2a', accentHot: '#ffd866',
    warn: '#fc9867', good: '#a9dc76', border: '#5b595c',
    fontUi: '"JetBrains Mono", monospace',
    fontMono: '"JetBrains Mono", monospace',
    fontDisplay: '"JetBrains Mono", monospace',
    radius: '4px', pad: '14px',
    scanlines: false, glow: false, vignette: false, noise: false
  },
  effects: { clickSound: null }
};

/* ---------- Retro period pieces ---------- */

export const atari2600: Theme = {
  id: 'atari2600',
  name: 'Atari 2600',
  description: 'Saturated 8-color cartridge era',
  background:
    'linear-gradient(180deg, #6b3c00 0%, #6b3c00 20%, #cc3333 20%, #cc3333 40%, #ee9900 40%, #ee9900 60%, #00aa00 60%, #00aa00 80%, #0088cc 80%, #0088cc 100%)',
  tokens: {
    bg: '#000000', bgElevated: '#1a1a1a', bgPanel: '#2a2a2a',
    fg: '#ffffff', fgMuted: '#cccccc',
    accent: '#ee9900', accentSoft: '#3a2200', accentHot: '#ffcc33',
    warn: '#cc3333', good: '#00aa00', border: '#cc3333',
    fontUi: '"Press Start 2P", monospace',
    fontMono: '"Press Start 2P", monospace',
    fontDisplay: '"Press Start 2P", monospace',
    radius: '0px', pad: '14px',
    scanlines: true, glow: false, vignette: true, noise: true
  },
  effects: { clickSound: null }
};

export const amiga: Theme = {
  id: 'amiga',
  name: 'Amiga Workbench',
  description: 'Workbench 1.3 grey pinstripes on Topaz blue',
  background:
    'repeating-linear-gradient(90deg, #0a55aa 0 1px, #0844a0 1px 2px), #0844a0',
  tokens: {
    bg: '#0844a0', bgElevated: '#9090c0', bgPanel: '#a8a8c8',
    fg: '#000000', fgMuted: '#404060',
    accent: '#ff8800', accentSoft: '#ffd9a0', accentHot: '#ffaa44',
    warn: '#cc0000', good: '#008800', border: '#000000',
    fontUi: '"VT323", "Share Tech Mono", monospace',
    fontMono: '"VT323", monospace',
    fontDisplay: '"VT323", monospace',
    radius: '0px', pad: '12px',
    scanlines: false, glow: false, vignette: false, noise: false
  },
  effects: { clickSound: null }
};

export const y2k: Theme = {
  id: 'y2k',
  name: 'iMac G3',
  description: 'Translucent Bondi blue Aqua, circa 1999',
  background:
    'radial-gradient(ellipse at 30% 0%, #b0e8f0 0%, #4ab8d4 50%, #006080 100%)',
  tokens: {
    bg: '#006080', bgElevated: '#0078a0', bgPanel: '#0098c0',
    fg: '#ffffff', fgMuted: '#cce8f0',
    accent: '#00d8f8', accentSoft: '#005060', accentHot: '#ffffff',
    warn: '#ff6a3d', good: '#5fe39a', border: '#005a78',
    fontUi: '"Lucida Grande", "Inter", "Helvetica Neue", sans-serif',
    fontMono: '"Monaco", "JetBrains Mono", monospace',
    fontDisplay: '"Lucida Grande", "Inter", sans-serif',
    radius: '14px', pad: '14px',
    scanlines: false, glow: true, vignette: true, noise: false
  },
  effects: { clickSound: null }
};

export const win31: Theme = {
  id: 'win31',
  name: 'Windows 3.1',
  description: 'Chunky bevels on the iconic teal hatched desktop',
  background: enc(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 4'>
    <rect width='4' height='4' fill='%23008080'/>
    <rect x='0' y='0' width='1' height='1' fill='%23000000'/>
    <rect x='2' y='2' width='1' height='1' fill='%23000000'/>
  </svg>`) + ' repeat, #008080',
  tokens: {
    bg: '#008080', bgElevated: '#c0c0c0', bgPanel: '#c0c0c0',
    fg: '#000000', fgMuted: '#404040',
    accent: '#000080', accentSoft: '#a0a0e0', accentHot: '#ffffff',
    warn: '#cc0000', good: '#008000', border: '#808080',
    fontUi: '"MS Sans Serif", "Tahoma", "Inter", sans-serif',
    fontMono: '"VT323", monospace',
    fontDisplay: '"MS Sans Serif", "Inter", sans-serif',
    radius: '0px', pad: '10px',
    scanlines: false, glow: false, vignette: false, noise: false
  },
  effects: { clickSound: null }
};

/* ---------- Music / Cultural ---------- */

export const vaporwave: Theme = {
  id: 'vaporwave',
  name: 'Vaporwave',
  description: 'A E S T H E T I C — pink + teal gradients with chrome',
  background:
    'linear-gradient(180deg, #ff71ce 0%, #b967ff 50%, #01cdfe 100%), radial-gradient(circle at center, rgba(255,255,255,0.1), transparent 60%)',
  tokens: {
    bg: '#1a0533', bgElevated: '#2a0a4a', bgPanel: '#3a1066',
    fg: '#ffffff', fgMuted: '#d4b8ff',
    accent: '#ff71ce', accentSoft: '#5a1c4a', accentHot: '#01cdfe',
    warn: '#fffb96', good: '#05ffa1', border: '#b967ff',
    fontUi: '"Audiowide", "Orbitron", system-ui, sans-serif',
    fontMono: '"VT323", monospace',
    fontDisplay: '"Audiowide", "Orbitron", sans-serif',
    radius: '6px', pad: '14px',
    scanlines: false, glow: true, vignette: true, noise: false
  },
  effects: { clickSound: null }
};

export const lofi: Theme = {
  id: 'lofi',
  name: 'Lo-Fi',
  description: 'Warm muted browns and oranges, Chillhop-cafe vibe',
  background:
    'radial-gradient(ellipse at 30% 30%, #d8a878 0%, #b07848 40%, #6a4828 100%)',
  tokens: {
    bg: '#3a2818', bgElevated: '#4a3424', bgPanel: '#5a4030',
    fg: '#fff0d8', fgMuted: '#c8a888',
    accent: '#e8a86a', accentSoft: '#5a3a1a', accentHot: '#fff0d8',
    warn: '#e87a4a', good: '#9ac890', border: '#7a5838',
    fontUi: '"Nunito", "Inter", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    fontDisplay: '"Nunito", sans-serif',
    radius: '12px', pad: '14px',
    scanlines: false, glow: false, vignette: true, noise: true
  },
  effects: { clickSound: null }
};

export const detroittechno: Theme = {
  id: 'detroittechno',
  name: 'Detroit Techno',
  description: 'Submerge / UR — concrete grey + flat magenta',
  background:
    'radial-gradient(ellipse at 50% 50%, #2a2a2a 0%, #0a0a0a 80%), repeating-linear-gradient(0deg, rgba(255,0,128,0.04) 0 1px, transparent 1px 12px)',
  tokens: {
    bg: '#0a0a0a', bgElevated: '#181818', bgPanel: '#222222',
    fg: '#ffffff', fgMuted: '#888888',
    accent: '#ff0080', accentSoft: '#3a0020', accentHot: '#ffd400',
    warn: '#ffd400', good: '#00ffaa', border: '#333333',
    fontUi: '"Bungee", "Orbitron", Impact, sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    fontDisplay: '"Bungee", Impact, sans-serif',
    radius: '0px', pad: '14px',
    scanlines: false, glow: true, vignette: true, noise: true
  },
  effects: { clickSound: null }
};

/* ---------- Music / Cultural ---------- */

export const metallica: Theme = {
  id: 'metallica',
  name: 'Metallica',
  description: 'Lightning-bolt M — sharp angular black on chrome',
  background: enc(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2560 720' preserveAspectRatio='xMidYMid slice'>
    <defs>
      <linearGradient id='chrome' x1='0%' y1='0%' x2='0%' y2='100%'>
        <stop offset='0%' stop-color='%23404040'/>
        <stop offset='40%' stop-color='%23a0a0a0'/>
        <stop offset='55%' stop-color='%23ffffff'/>
        <stop offset='70%' stop-color='%23a0a0a0'/>
        <stop offset='100%' stop-color='%23202020'/>
      </linearGradient>
      <radialGradient id='spot' cx='50%' cy='50%' r='70%'>
        <stop offset='0%' stop-color='%23303030'/>
        <stop offset='100%' stop-color='%23000000'/>
      </radialGradient>
    </defs>
    <rect width='2560' height='720' fill='url(%23spot)'/>
    <g transform='translate(1280 360)' opacity='0.18'>
      <!-- giant lightning-bolt M silhouette -->
      <path d='M -560 200 L -380 -200 L -260 -200 L -140 80 L -20 -200 L 100 -200 L 220 80 L 340 -200 L 460 -200 L 560 200 L 440 200 L 380 80 L 300 200 L 180 200 L 100 30 L 20 200 L -100 200 L -180 30 L -260 200 L -380 200 Z'
        fill='url(%23chrome)' stroke='%23ffffff' stroke-width='2'/>
    </g>
    <g font-family='Black Ops One, Impact, sans-serif' fill='%23ffffff' opacity='0.55'>
      <text x='1280' y='80' text-anchor='middle' font-size='32' letter-spacing='12'>· KILL · EM · ALL ·</text>
      <text x='1280' y='680' text-anchor='middle' font-size='28' letter-spacing='10'>SAN FRANCISCO · SINCE 1981</text>
    </g>
  </svg>`) + ' center/cover no-repeat, #000000',
  tokens: {
    bg: '#000000', bgElevated: '#1a1a1a', bgPanel: '#222222',
    fg: '#e8e8e8', fgMuted: '#888888',
    accent: '#c0c0c0', accentSoft: '#3a3a3a', accentHot: '#ffffff',
    warn: '#ff3838', good: '#5fe39a', border: '#404040',
    fontUi: '"Black Ops One", "Bungee", Impact, sans-serif',
    fontMono: '"Share Tech Mono", monospace',
    fontDisplay: '"Black Ops One", Impact, sans-serif',
    radius: '0px', pad: '14px',
    scanlines: false, glow: false, vignette: true, noise: true
  },
  effects: { clickSound: null }
};

export const foofighters: Theme = {
  id: 'foofighters',
  name: 'Foo Fighters',
  description: 'Crimson rock with the FF circle seal',
  background: enc(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2560 720' preserveAspectRatio='xMidYMid slice'>
    <defs>
      <radialGradient id='spot' cx='50%' cy='50%' r='70%'>
        <stop offset='0%' stop-color='%23501010'/>
        <stop offset='100%' stop-color='%23150505'/>
      </radialGradient>
    </defs>
    <rect width='2560' height='720' fill='url(%23spot)'/>
    <g transform='translate(1280 360)' opacity='0.22'>
      <!-- circle seal -->
      <circle r='240' fill='none' stroke='%23ffffff' stroke-width='14'/>
      <circle r='220' fill='none' stroke='%23ffffff' stroke-width='4'/>
      <!-- mirrored FFs -->
      <g font-family='Pacifico, cursive' font-size='280' fill='%23ffffff' text-anchor='middle' dominant-baseline='central'>
        <text x='-70' y='0'>F</text>
        <g transform='translate(70 0) scale(-1 1)'><text y='0'>F</text></g>
      </g>
    </g>
    <g font-family='Pacifico, cursive' fill='%23ffffff' opacity='0.6'>
      <text x='1280' y='110' text-anchor='middle' font-size='80'>Foo Fighters</text>
    </g>
    <g font-family='Bebas Neue, Oswald, sans-serif' fill='%23ffffff' opacity='0.4'>
      <text x='1280' y='670' text-anchor='middle' font-size='36' letter-spacing='14'>SEATTLE · 1994</text>
    </g>
  </svg>`) + ' center/cover no-repeat, #1a0606',
  tokens: {
    bg: '#1a0606', bgElevated: '#2a0c0c', bgPanel: '#3a1212',
    fg: '#ffffff', fgMuted: '#c8a8a8',
    accent: '#c8102e', accentSoft: '#5a0a14', accentHot: '#ffffff',
    warn: '#ffb14a', good: '#5fe39a', border: '#5a1a1a',
    fontUi: '"Bebas Neue", "Oswald", "Inter", sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    fontDisplay: '"Pacifico", "Bebas Neue", cursive',
    radius: '6px', pad: '14px',
    scanlines: false, glow: false, vignette: true, noise: true
  },
  effects: { clickSound: null }
};

export const t2: Theme = {
  id: 't2',
  name: 'Terminator 2',
  description: 'Skynet HK glow — chrome T2 on black with neon-blue scanner',
  background: enc(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2560 720' preserveAspectRatio='xMidYMid slice'>
    <defs>
      <linearGradient id='chrome' x1='0%' y1='0%' x2='0%' y2='100%'>
        <stop offset='0%' stop-color='%23404040'/>
        <stop offset='40%' stop-color='%23a0a0a0'/>
        <stop offset='55%' stop-color='%23ffffff'/>
        <stop offset='70%' stop-color='%23a0a0a0'/>
        <stop offset='100%' stop-color='%23202020'/>
      </linearGradient>
      <radialGradient id='spot' cx='50%' cy='40%' r='70%'>
        <stop offset='0%' stop-color='%23001020'/>
        <stop offset='100%' stop-color='%23000000'/>
      </radialGradient>
      <filter id='glow'>
        <feGaussianBlur stdDeviation='4'/>
        <feMerge><feMergeNode/><feMergeNode in='SourceGraphic'/></feMerge>
      </filter>
    </defs>
    <rect width='2560' height='720' fill='url(%23spot)'/>
    <!-- giant chrome T2 -->
    <g transform='translate(1280 380)' font-family='Saira Stencil One, Orbitron, Impact, sans-serif' font-size='460' text-anchor='middle' dominant-baseline='central' opacity='0.30'>
      <text fill='url(%23chrome)' stroke='%23ffffff' stroke-width='3'>T2</text>
    </g>
    <!-- terminator red scanner -->
    <g transform='translate(1280 360)' opacity='0.55'>
      <ellipse rx='30' ry='18' cx='-60' cy='-180' fill='%23ff2222' filter='url(%23glow)'/>
      <ellipse rx='30' ry='18' cx='60' cy='-180' fill='%23ff2222' filter='url(%23glow)'/>
    </g>
    <!-- subtitle -->
    <g font-family='Saira Stencil One, Orbitron, sans-serif' fill='%2300d4ff' opacity='0.7'>
      <text x='1280' y='620' text-anchor='middle' font-size='44' letter-spacing='14'>JUDGMENT  DAY</text>
    </g>
    <g font-family='Saira Stencil One, Orbitron, sans-serif' fill='%2300d4ff' opacity='0.4'>
      <text x='1280' y='670' text-anchor='middle' font-size='22' letter-spacing='8'>CYBERDYNE  SYSTEMS  ·  MODEL  101  ·  T-800</text>
    </g>
  </svg>`) + ' center/cover no-repeat, #000000',
  tokens: {
    bg: '#000000', bgElevated: '#0a141e', bgPanel: '#0f1c2a',
    fg: '#cfeeff', fgMuted: '#7a90a8',
    accent: '#00d4ff', accentSoft: '#0a2a3a', accentHot: '#ff2222',
    warn: '#ff2222', good: '#5fe39a', border: '#1a3a4a',
    fontUi: '"Saira Stencil One", "Orbitron", Impact, sans-serif',
    fontMono: '"Share Tech Mono", "JetBrains Mono", monospace',
    fontDisplay: '"Saira Stencil One", "Orbitron", Impact, sans-serif',
    radius: '0px', pad: '14px',
    scanlines: true, glow: true, vignette: true, noise: true
  },
  effects: { clickSound: null }
};

/* ---------- Detroit-specific ---------- */

export const vernors: Theme = {
  id: 'vernors',
  name: 'Vernors',
  description: 'Detroit\'s ginger soda — green + gold + cream',
  background:
    'linear-gradient(180deg, #1a4a1a 0%, #2a5a2a 100%), radial-gradient(circle at 30% 30%, rgba(212,175,55,0.10), transparent 60%)',
  tokens: {
    bg: '#1a4a1a', bgElevated: '#2a5a2a', bgPanel: '#356a35',
    fg: '#fff8e0', fgMuted: '#c8d8a8',
    accent: '#d4af37', accentSoft: '#4a3a10', accentHot: '#fff8e0',
    warn: '#e87a3a', good: '#a8d878', border: '#1a3a1a',
    fontUi: '"Cinzel", "Oswald", serif',
    fontMono: '"JetBrains Mono", monospace',
    fontDisplay: '"Cinzel Decorative", "Cinzel", serif',
    radius: '8px', pad: '14px',
    scanlines: false, glow: false, vignette: true, noise: true
  },
  effects: { clickSound: null }
};

export const THEMES: Theme[] = [
  // System / minimal
  dark, nord, solarizedLight, solarizedDark, catppuccin, tokyonight, gruvbox, monokai,
  // Retro terminals & periods
  pipboy, bbs, eightbit, atari2600, amiga, win31, y2k,
  // Sci-fi
  lcars, nostromo, halo, xfiles,
  // Games
  minecraft, doom, blackmesa, stardew,
  // Pop-culture
  severance, wesanderson, f1pit, apollo,
  // Music / cultural
  synthwave, vaporwave, lofi, detroittechno, metallica, foofighters,
  // Movies / TV
  t2,
  // Adventure / fantasy
  cyberpunk, dnd,
  // Detroit special
  vernors,
  // Sports leagues (per-team picker via ThemeProvider)
  nhl, nfl, nba, mlb, f1, nascar
];

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? dark;
}
