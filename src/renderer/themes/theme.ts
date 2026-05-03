import type { CSSProperties } from 'react';

export interface ThemeTokens {
  // Colors
  bg: string;
  bgElevated: string;
  bgPanel: string;
  fg: string;
  fgMuted: string;
  accent: string;
  accentSoft: string;
  accentHot: string;
  warn: string;
  good: string;
  border: string;

  // Typography
  fontUi: string;
  fontMono: string;
  fontDisplay: string;

  // Sizing
  radius: string;
  pad: string;

  // Effects
  scanlines: boolean;
  glow: boolean;
  vignette: boolean;
  noise: boolean;
}

export interface ThemeEffects {
  /** SFX URLs played on click/long-press; null disables */
  clickSound?: string | null;
  bootSound?: string | null;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  tokens: ThemeTokens;
  effects: ThemeEffects;
  /** Default background CSS value (gradient, url, or both). null = solid bg. */
  background?: string | null;
}

export function themeToCssVars(t: Theme): CSSProperties {
  const v: Record<string, string> = {
    '--bg': t.tokens.bg,
    '--bg-elevated': t.tokens.bgElevated,
    '--bg-panel': t.tokens.bgPanel,
    '--fg': t.tokens.fg,
    '--fg-muted': t.tokens.fgMuted,
    '--accent': t.tokens.accent,
    '--accent-soft': t.tokens.accentSoft,
    '--accent-hot': t.tokens.accentHot,
    '--warn': t.tokens.warn,
    '--good': t.tokens.good,
    '--border': t.tokens.border,
    '--font-ui': t.tokens.fontUi,
    '--font-mono': t.tokens.fontMono,
    '--font-display': t.tokens.fontDisplay,
    '--radius': t.tokens.radius,
    '--pad': t.tokens.pad
  };
  return v as CSSProperties;
}
