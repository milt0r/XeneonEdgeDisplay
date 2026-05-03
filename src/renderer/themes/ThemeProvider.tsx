import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { getTheme, type Theme } from './index';
import { themeToCssVars } from './theme';
import { useApp } from '../store/app';
import { teamsForSport, getSportTeam, sportsBackground, type Sport } from './sports';

interface Ctx {
  theme: Theme;
}

const ThemeCtx = createContext<Ctx>({ theme: getTheme('dark') });

const FAMILY_STACKS: Record<string, { ui: string; mono: string; display: string } | null> = {
  theme: null,
  inter: { ui: '"Inter", system-ui, sans-serif', mono: '"JetBrains Mono", ui-monospace, monospace', display: '"Inter", system-ui, sans-serif' },
  system: { ui: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', mono: 'ui-monospace, Consolas, monospace', display: 'system-ui, sans-serif' },
  mono: { ui: '"JetBrains Mono", ui-monospace, Consolas, monospace', mono: '"JetBrains Mono", ui-monospace, Consolas, monospace', display: '"JetBrains Mono", monospace' },
  serif: { ui: 'Georgia, "Cormorant Garamond", serif', mono: '"IM Fell English", Georgia, serif', display: '"Cinzel", Georgia, serif' },
  rounded: { ui: '"Nunito", system-ui, sans-serif', mono: 'ui-monospace, monospace', display: '"Nunito", system-ui, sans-serif' }
};

export function ThemeProvider({ themeId, children }: { themeId: string; children: React.ReactNode }) {
  const baseTheme = useMemo(() => getTheme(themeId), [themeId]);
  const fontFamily = useApp((s) => s.settings?.ui?.fontFamily ?? 'theme');
  const widgetOpacity = useApp((s) => s.settings?.ui?.widgetOpacity ?? 1.0);
  const backgrounds = useApp((s) => s.settings?.ui?.backgrounds ?? {});
  const sportTeams = useApp((s) => s.settings?.ui?.sportTeams ?? {});

  // Derive per-league sport theme from the active team selection.
  const theme = useMemo<Theme>(() => {
    const sportIds: Sport[] = ['nhl', 'nfl', 'nba', 'mlb', 'f1', 'nascar'];
    if (!sportIds.includes(baseTheme.id as Sport)) return baseTheme;
    const sport = baseTheme.id as Sport;
    const teamId = sportTeams[sport] ?? teamsForSport(sport)[0]?.id;
    if (!teamId) return baseTheme;
    const team = getSportTeam(sport, teamId);
    return {
      ...baseTheme,
      name: `${baseTheme.name} · ${team.name}`,
      description: `${team.name} (${team.abbr})`,
      background: sportsBackground(team),
      tokens: {
        ...baseTheme.tokens,
        accent: team.primary,
        accentSoft: hexAlpha(team.primary, 0.22),
        accentHot: team.secondary,
        fg: '#ffffff'
      }
    };
  }, [baseTheme, sportTeams]);

  useEffect(() => {
    document.body.dataset.theme = theme.id;
    document.body.dataset.scanlines = String(theme.tokens.scanlines);
    document.body.dataset.glow = String(theme.tokens.glow);
    document.body.dataset.vignette = String(theme.tokens.vignette);
    document.body.dataset.noise = String(theme.tokens.noise);
  }, [theme]);

  const baseStyle = themeToCssVars(theme) as Record<string, string>;
  const override = FAMILY_STACKS[fontFamily];

  // Background resolution: explicit override > theme default > token bg
  const bgOverride = backgrounds[theme.id];
  let bgValue: string;
  if (bgOverride === 'none') {
    bgValue = theme.tokens.bg;
  } else if (bgOverride && bgOverride.length > 0) {
    bgValue = bgOverride.startsWith('http') || bgOverride.startsWith('file') || bgOverride.startsWith('data')
      ? `url("${bgOverride}") center/cover no-repeat, ${theme.tokens.bg}`
      : bgOverride;
  } else {
    bgValue = theme.background ?? theme.tokens.bg;
  }

  // Bake widget opacity into the panel/elevated CSS vars so every rule that
  // already uses var(--bg-panel) / var(--bg-elevated) picks it up automatically.
  const opacityPct = `${Math.round(widgetOpacity * 100)}%`;
  const mix = (color: string) =>
    widgetOpacity >= 0.999
      ? color
      : `color-mix(in srgb, ${color} ${opacityPct}, transparent)`;

  const style: React.CSSProperties = {
    ...baseStyle,
    '--bg-panel': mix(theme.tokens.bgPanel),
    '--bg-elevated': mix(theme.tokens.bgElevated),
    ...(override ? { '--font-ui': override.ui, '--font-mono': override.mono, '--font-display': override.display } : {}),
    '--widget-opacity': String(widgetOpacity),
    background: bgValue,
    backgroundAttachment: 'fixed'
  } as React.CSSProperties;

  return (
    <ThemeCtx.Provider value={{ theme }}>
      <div className="theme-root" style={style}>
        {children}
        {theme.tokens.scanlines && <div className="fx-scanlines" aria-hidden />}
        {theme.tokens.vignette && <div className="fx-vignette" aria-hidden />}
        {theme.tokens.noise && <div className="fx-noise" aria-hidden />}
      </div>
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}

function hexAlpha(hex: string, alpha: number): string {
  const m = hex.replace('#', '');
  const n = m.length === 3
    ? parseInt(m.split('').map((c) => c + c).join(''), 16)
    : parseInt(m, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
