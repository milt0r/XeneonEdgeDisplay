import { create } from 'zustand';
import type {
  AppSettings,
  HAEntityState,
  SensorSnapshot,
  SpotifyPlayback,
  WeatherSnapshot,
  WidgetLayoutItem
} from '@shared/types';
import type { DiscordVoiceState } from '@shared/discord';

interface AppState {
  settings: AppSettings | null;
  layout: WidgetLayoutItem[];
  weather: WeatherSnapshot | null;
  sensors: SensorSnapshot | null;
  spotify: SpotifyPlayback | null;
  discord: DiscordVoiceState | null;
  haEntities: Map<string, HAEntityState>;
  editing: boolean;
  showSettings: boolean;

  init(): Promise<void>;
  setSettings(s: AppSettings): void;
  setLayout(items: WidgetLayoutItem[]): void;
  saveLayout(items: WidgetLayoutItem[]): Promise<void>;
  toggleEditing(): void;
  setShowSettings(v: boolean): void;
  updateConfig(instanceId: string, patch: Record<string, unknown>): void;
  removeWidget(instanceId: string): void;
  addWidget(item: WidgetLayoutItem): void;
}

export const useApp = create<AppState>((set, get) => ({
  settings: null,
  layout: [],
  weather: null,
  sensors: null,
  spotify: null,
  discord: null,
  haEntities: new Map(),
  editing: false,
  showSettings: false,

  async init() {
    const [settings, layout, weather, sensors, spotify, discord, haList] = await Promise.all([
      window.api.getSettings(),
      window.api.getLayout(),
      window.api.weather.snapshot(),
      window.api.sensors.snapshot(),
      window.api.spotify.snapshot(),
      window.api.discord.snapshot(),
      window.api.ha.listEntities()
    ]);

    const haMap = new Map<string, HAEntityState>();
    for (const e of haList) haMap.set(e.entityId, e);

    set({ settings, layout, weather, sensors, spotify, discord, haEntities: haMap });

    window.api.on('weather', (s) => set({ weather: s }));
    window.api.on('sensors', (s) => set({ sensors: s }));
    window.api.on('spotify', (s) => set({ spotify: s }));
    window.api.on('discord', (s) => set({ discord: s }));
    window.api.on('ha:bulk', (list: HAEntityState[]) => {
      const m = new Map(get().haEntities);
      for (const e of list) m.set(e.entityId, e);
      set({ haEntities: m });
    });
    window.api.on('ha:state', (e: HAEntityState) => {
      const m = new Map(get().haEntities);
      m.set(e.entityId, e);
      set({ haEntities: m });
    });
  },

  setSettings(s) { set({ settings: s }); },
  setLayout(items) { set({ layout: items }); },
  async saveLayout(items) {
    set({ layout: items });
    await window.api.saveLayout(items);
  },
  toggleEditing() { set({ editing: !get().editing }); },
  setShowSettings(v) { set({ showSettings: v }); },
  updateConfig(instanceId, patch) {
    const next = get().layout.map((it) =>
      it.instanceId === instanceId ? { ...it, config: { ...(it.config ?? {}), ...patch } } : it
    );
    set({ layout: next });
    window.api.saveLayout(next);
  },
  removeWidget(instanceId) {
    const next = get().layout.filter((it) => it.instanceId !== instanceId);
    set({ layout: next });
    window.api.saveLayout(next);
  },
  addWidget(item) {
    const next = [...get().layout, item];
    set({ layout: next });
    window.api.saveLayout(next);
  }
}));
