import type { AppSettings, WidgetLayoutItem } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
  themeId: 'pipboy',
  weather: {
    provider: 'open-meteo',
    latitude: null,
    longitude: null,
    locationLabel: 'Auto',
    units: 'metric'
  },
  sensors: {
    preferred: 'auto',
    lhmUrl: 'http://localhost:8085/data.json',
    pollMs: 2000
  },
  homeAssistant: {
    baseUrl: 'http://homeassistant.local:8123',
    enabled: false
  },
  spotify: {
    clientId: '',
    enabled: false
  },
  discord: {
    clientId: '',
    enabled: false
  },
  layout: {
    locked: false
  },
  ui: {
    onScreenKeyboard: false,
    fontScale: 1.0,
    fontFamily: 'theme',
    widgetOpacity: 1.0,
    backgrounds: {},
    sportTeams: { nhl: 'detroit', nfl: 'det', nba: 'det', mlb: 'det', f1: 'redbull', nascar: 'hendrick' },
    favoriteThemes: []
  }
};

export const DEFAULT_LAYOUT: WidgetLayoutItem[] = [
  { i: 'clock-1', instanceId: 'clock-1', pluginId: 'clock', x: 0, y: 0, w: 3, h: 2 },
  { i: 'weather-1', instanceId: 'weather-1', pluginId: 'weather', x: 3, y: 0, w: 3, h: 2 },
  { i: 'sensors-1', instanceId: 'sensors-1', pluginId: 'sensors', x: 6, y: 0, w: 3, h: 2 },
  { i: 'spotify-1', instanceId: 'spotify-1', pluginId: 'spotify', x: 9, y: 0, w: 3, h: 2 },
  { i: 'ha-1', instanceId: 'ha-1', pluginId: 'ha-tiles', x: 0, y: 2, w: 8, h: 2 },
  { i: 'launch-1', instanceId: 'launch-1', pluginId: 'quick-launch', x: 8, y: 2, w: 4, h: 2 }
];
