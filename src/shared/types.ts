export interface WeatherCurrent {
  tempC: number;
  feelsLikeC: number;
  humidity: number;
  windKph: number;
  conditionCode: number;
  conditionText: string;
  isDay: boolean;
}

export interface WeatherHourly {
  time: string;
  tempC: number;
  conditionCode: number;
  precipMm: number;
}

export interface WeatherSnapshot {
  location: string;
  updatedAt: number;
  current: WeatherCurrent;
  hourly: WeatherHourly[];
}

export interface SensorSnapshot {
  source: 'signalrgb' | 'lhm' | 'mock' | 'unavailable';
  updatedAt: number;
  cpuTempC: number | null;
  cpuLoadPct: number | null;
  cpuPowerW: number | null;
  gpuTempC: number | null;
  gpuLoadPct: number | null;
  gpuPowerW: number | null;
  memUsedPct: number | null;
}

export interface HAEntityState {
  entityId: string;
  state: string;
  attributes: Record<string, unknown>;
  lastChanged: string;
  /** Area name (resolved from registry). */
  area?: string | null;
  /** Device name (resolved from registry). */
  device?: string | null;
  /** Device manufacturer (resolved from registry). */
  manufacturer?: string | null;
  /** sensor/binary_sensor device_class. */
  deviceClass?: string | null;
  /** 'config' | 'diagnostic' | undefined — if set, mostly internal. */
  entityCategory?: string | null;
  /** True if user disabled in HA. */
  disabled?: boolean;
  /** True if user hid in HA. */
  hidden?: boolean;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  artUrl: string | null;
  durationMs: number;
}

export interface SpotifyPlayback {
  isPlaying: boolean;
  progressMs: number;
  shuffle: boolean;
  repeat: 'off' | 'track' | 'context';
  volumePct: number;
  device: string | null;
  track: SpotifyTrack | null;
}

export interface AppSettings {
  themeId: string;
  weather: {
    provider: 'open-meteo' | 'openweather';
    latitude: number | null;
    longitude: number | null;
    locationLabel: string;
    units: 'metric' | 'imperial';
    apiKey?: string;
  };
  sensors: {
    preferred: 'auto' | 'signalrgb' | 'lhm' | 'mock';
    lhmUrl: string;
    pollMs: number;
  };
  homeAssistant: {
    baseUrl: string;
    enabled: boolean;
  };
  spotify: {
    clientId: string;
    enabled: boolean;
  };
  discord: {
    clientId: string;
    enabled: boolean;
  };
  layout: {
    locked: boolean;
  };
  ui: {
    onScreenKeyboard: boolean;
    fontScale: number;
    fontFamily: 'theme' | 'inter' | 'system' | 'mono' | 'serif' | 'rounded' | 'vt323' | 'pressstart';
    /** 0.4 - 1.0; widget panel background opacity. */
    widgetOpacity: number;
    /** Per-theme background override. Empty string = use theme default; 'none' = no background. */
    backgrounds: Record<string, string>;
    /** Selected team id per league theme (nhl/nfl/nba/mlb/f1/nascar). */
    sportTeams: Record<string, string>;
    /** Theme IDs the user has starred — sorted to the top of the picker. */
    favoriteThemes: string[];
  };
}

export interface WidgetLayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  pluginId: string;
  instanceId: string;
  config?: Record<string, unknown>;
}

export interface DashboardTab {
  id: string;
  name: string;
  /** Optional accent color override (CSS color); falls back to theme accent. */
  color?: string;
  layout: WidgetLayoutItem[];
}
