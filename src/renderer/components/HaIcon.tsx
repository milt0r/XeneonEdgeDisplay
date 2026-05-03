import React from 'react';

/**
 * Compact inline SVG icon set for HA entities. Stroke uses currentColor so
 * icons inherit theme color. Sized via the surrounding font-size.
 */
const I = ({ children, size = 24 }: { children: React.ReactNode; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const ICONS: Record<string, React.ReactElement> = {
  light: <I><circle cx="12" cy="9" r="5" /><path d="M9 18h6M10 21h4" /></I>,
  switch: <I><rect x="3" y="9" width="18" height="6" rx="3" /><circle cx="16" cy="12" r="2" fill="currentColor" /></I>,
  fan: <I><circle cx="12" cy="12" r="2" /><path d="M12 2c2 4 0 7-3 8 3 1 4 4 3 8M22 12c-4 2-7 0-8-3-1 3-4 4-8 3" /></I>,
  scene: <I><path d="M4 7h16M6 12h12M9 17h6" /></I>,
  script: <I><path d="M7 4h7l4 4v12H7zM14 4v4h4" /><path d="M9 13h6M9 17h4" /></I>,
  automation: <I><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" /></I>,
  input_boolean: <I><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-5" /></I>,
  media_player: <I><polygon points="9,7 18,12 9,17" fill="currentColor" stroke="none" /></I>,
  cover: <I><rect x="4" y="4" width="16" height="3" /><path d="M6 7v10M18 7v10M4 17h16M4 21h16" /></I>,
  lock: <I><rect x="6" y="11" width="12" height="9" rx="2" /><path d="M9 11V8a3 3 0 016 0v3" /></I>,
  climate: <I><path d="M12 3v12" /><circle cx="12" cy="18" r="3" /><path d="M9 9l3-3 3 3" /></I>,
  camera: <I><path d="M3 7h4l2-2h6l2 2h4v12H3z" /><circle cx="12" cy="13" r="3.5" /></I>,
  sensor: <I><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></I>,
  binary_sensor: <I><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="9" /></I>,
  weather: <I><circle cx="9" cy="13" r="4" /><path d="M13 9a4 4 0 015 4h-1" /></I>,
  person: <I><circle cx="12" cy="8" r="3.5" /><path d="M5 20c1-4 4-6 7-6s6 2 7 6" /></I>,
  device_tracker: <I><circle cx="12" cy="11" r="3" /><path d="M12 2C7 2 4 5 4 10c0 6 8 12 8 12s8-6 8-12c0-5-3-8-8-8z" /></I>,
  default: <I><rect x="4" y="4" width="16" height="16" rx="3" /><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" /></I>
};

const DEVICE_CLASS_ICONS: Record<string, React.ReactElement> = {
  temperature: <I><path d="M14 14V5a2 2 0 10-4 0v9a4 4 0 104 0z" /><path d="M12 17v-7" /></I>,
  humidity: <I><path d="M12 3s6 7 6 11a6 6 0 11-12 0c0-4 6-11 6-11z" /></I>,
  pressure: <I><circle cx="12" cy="12" r="9" /><path d="M12 12l4-4" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /></I>,
  power: <I><path d="M12 3v9M7.05 6.05a8 8 0 109.9 0" /></I>,
  energy: <I><polygon points="13,2 4,14 11,14 9,22 20,10 13,10" fill="currentColor" stroke="none" /></I>,
  battery: <I><rect x="3" y="8" width="16" height="8" rx="1" /><rect x="20" y="10" width="2" height="4" fill="currentColor" stroke="none" /><rect x="5" y="10" width="8" height="4" fill="currentColor" stroke="none" /></I>,
  illuminance: <I><circle cx="12" cy="12" r="3.5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" /></I>,
  motion: <I><circle cx="12" cy="5" r="2" /><path d="M9 9h6l-2 6 4 5M11 13l-3 7" /></I>,
  door: <I><rect x="6" y="3" width="12" height="18" /><circle cx="14" cy="13" r="1" fill="currentColor" stroke="none" /></I>,
  window: <I><rect x="4" y="4" width="16" height="16" /><path d="M12 4v16M4 12h16" /></I>,
  smoke: <I><path d="M5 16c-1-4 1-7 4-7 0-3 3-5 6-3 2-1 5 1 4 4 2 1 2 5-1 6H6a2 2 0 01-1-2v2z" /></I>,
  occupancy: <I><circle cx="12" cy="8" r="3.5" /><path d="M5 20c1-4 4-6 7-6s6 2 7 6" /></I>
};

export function entityIcon(entityId: string, attributes: Record<string, any>, size = 24): React.ReactElement {
  const domain = entityId.split('.')[0];
  const dc = attributes?.device_class as string | undefined;
  if (dc && DEVICE_CLASS_ICONS[dc]) {
    return React.cloneElement(DEVICE_CLASS_ICONS[dc], { width: size, height: size });
  }
  const fromDomain = ICONS[domain] ?? ICONS.default;
  return React.cloneElement(fromDomain, { width: size, height: size });
}

export function entityFriendlyName(entityId: string, attributes: Record<string, any>): string {
  return (attributes?.friendly_name as string | undefined) ?? entityId;
}

export function isOnState(state: string): boolean {
  return ['on', 'open', 'home', 'playing', 'unlocked', 'detected', 'active'].includes(state);
}

const DEFAULT_UNITS: Record<string, string> = {
  temperature: '°C',
  humidity: '%',
  pressure: 'hPa',
  power: 'W',
  energy: 'kWh',
  battery: '%',
  illuminance: 'lx'
};

export function entityUnit(attributes: Record<string, any>): string {
  return (attributes?.unit_of_measurement as string | undefined) ?? DEFAULT_UNITS[attributes?.device_class] ?? '';
}
