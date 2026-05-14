import type {
  AppSettings,
  DashboardTab,
  HAEntityState,
  SensorSnapshot,
  SpotifyPlayback,
  WeatherSnapshot,
  WidgetLayoutItem
} from './types';
import type { StockHeadline, StockQuote } from './stocks';
import type { League, SportsGame, SportsTeam } from './sports';
import type { DiscordVoiceState } from './discord';

export type ProviderEvent =
  | { kind: 'weather'; payload: WeatherSnapshot }
  | { kind: 'sensors'; payload: SensorSnapshot }
  | { kind: 'ha:state'; payload: HAEntityState }
  | { kind: 'ha:bulk'; payload: HAEntityState[] }
  | { kind: 'spotify'; payload: SpotifyPlayback }
  | { kind: 'discord'; payload: DiscordVoiceState };

export type ProviderEventKind = ProviderEvent['kind'];

export interface IpcApi {
  getSettings(): Promise<AppSettings>;
  updateSettings(patch: Partial<AppSettings>): Promise<AppSettings>;

  setSecret(key: string, value: string): Promise<void>;
  hasSecret(key: string): Promise<boolean>;
  clearSecret(key: string): Promise<void>;

  getLayout(): Promise<WidgetLayoutItem[]>;
  saveLayout(items: WidgetLayoutItem[]): Promise<void>;

  getTabs(): Promise<{ tabs: DashboardTab[]; activeTabId: string }>;
  saveTabs(tabs: DashboardTab[], activeTabId?: string): Promise<void>;

  weather: {
    refresh(): Promise<WeatherSnapshot | null>;
    snapshot(): Promise<WeatherSnapshot | null>;
  };
  sensors: {
    snapshot(): Promise<SensorSnapshot | null>;
    setSource(source: AppSettings['sensors']['preferred']): Promise<void>;
  };
  ha: {
    listEntities(): Promise<HAEntityState[]>;
    callService(domain: string, service: string, data?: Record<string, unknown>): Promise<void>;
    test(baseUrl: string, token: string): Promise<{ ok: boolean; error?: string }>;
    cameraSnapshot(entityId: string): Promise<string | null>;
  };
  spotify: {
    snapshot(): Promise<SpotifyPlayback | null>;
    play(): Promise<void>;
    pause(): Promise<void>;
    next(): Promise<void>;
    previous(): Promise<void>;
    setVolume(pct: number): Promise<void>;
    transferTo(deviceId: string): Promise<void>;
    listDevices(): Promise<Array<{ id: string; name: string; isActive: boolean }>>;
    beginAuth(): Promise<{ ok: boolean; error?: string }>;
    isAuthorized(): Promise<boolean>;
    logout(): Promise<void>;
  };

  stocks: {
    quotes(symbols: string[]): Promise<StockQuote[]>;
    news(symbols: string[]): Promise<StockHeadline[]>;
  };

  sports: {
    games(leagues: League[]): Promise<SportsGame[]>;
    teams(league: League): Promise<SportsTeam[]>;
  };

  net: {
    speedtest(): Promise<{ pingMs: number; downloadMbps: number; jitterMs: number; ok: boolean; error?: string }>;
    arp(): Promise<Array<{ ip: string; mac: string; iface?: string; vendor?: string }>>;
  };

  calendar: {
    fetchIcs(url: string): Promise<{ ok: boolean; events?: Array<{ uid: string; summary: string; start: number; end: number; location?: string; allDay: boolean }>; error?: string }>;
  };

  scripts: {
    run(cmd: string, timeoutMs?: number): Promise<{ ok: boolean; stdout: string; stderr: string; exitCode: number }>;
  };

  discord: {
    snapshot(): Promise<DiscordVoiceState>;
    pickAudioFiles(): Promise<string[]>;
    beginAuth(): Promise<{ ok: boolean; error?: string }>;
  };

  window: {
    toggleFullscreen(): Promise<void>;
    quit(): Promise<void>;
  };

  on(channel: ProviderEventKind, handler: (payload: any) => void): () => void;
}

declare global {
  interface Window {
    api: IpcApi;
  }
}

export const IPC = {
  Settings: { get: 'settings:get', update: 'settings:update' },
  Secrets: { set: 'secrets:set', has: 'secrets:has', clear: 'secrets:clear' },
  Layout: { get: 'layout:get', save: 'layout:save' },
  Tabs: { get: 'tabs:get', save: 'tabs:save' },
  Weather: { refresh: 'weather:refresh', snapshot: 'weather:snapshot' },
  Sensors: { snapshot: 'sensors:snapshot', setSource: 'sensors:setSource' },
  Ha: { list: 'ha:list', call: 'ha:call', test: 'ha:test', camera: 'ha:camera' },
  Spotify: {
    snapshot: 'spotify:snapshot',
    play: 'spotify:play',
    pause: 'spotify:pause',
    next: 'spotify:next',
    previous: 'spotify:previous',
    setVolume: 'spotify:setVolume',
    transferTo: 'spotify:transferTo',
    listDevices: 'spotify:listDevices',
    beginAuth: 'spotify:beginAuth',
    isAuthorized: 'spotify:isAuthorized',
    logout: 'spotify:logout'
  },
  Window: { toggleFullscreen: 'window:toggleFullscreen', quit: 'window:quit' },
  Stocks: { quotes: 'stocks:quotes', news: 'stocks:news' },
  Sports: { games: 'sports:games', teams: 'sports:teams' },
  Net: { speedtest: 'net:speedtest', arp: 'net:arp' },
  Calendar: { fetchIcs: 'cal:fetchIcs' },
  Scripts: { run: 'scripts:run' },
  Discord: { snapshot: 'discord:snapshot', pickAudioFiles: 'discord:pickAudioFiles', beginAuth: 'discord:beginAuth' },
  Events: { provider: 'event:provider' }
} as const;
