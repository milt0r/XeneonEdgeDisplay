import { create } from 'zustand';
import type {
  AppSettings,
  DashboardTab,
  HAEntityState,
  SensorSnapshot,
  SpotifyPlayback,
  WeatherSnapshot,
  WidgetLayoutItem
} from '@shared/types';
import type { DiscordVoiceState } from '@shared/discord';

interface AppState {
  settings: AppSettings | null;
  /** Active tab's layout (kept for backward compat with widgets/store callers). */
  layout: WidgetLayoutItem[];
  tabs: DashboardTab[];
  activeTabId: string;
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

  setActiveTab(id: string): Promise<void>;
  addTab(name?: string): Promise<string>;
  renameTab(id: string, name: string): Promise<void>;
  setTabColor(id: string, color: string | undefined): Promise<void>;
  removeTab(id: string): Promise<void>;
  reorderTabs(ids: string[]): Promise<void>;
}

function activeTabLayout(tabs: DashboardTab[], activeTabId: string): WidgetLayoutItem[] {
  return tabs.find((t) => t.id === activeTabId)?.layout ?? [];
}

export const useApp = create<AppState>((set, get) => ({
  settings: null,
  layout: [],
  tabs: [],
  activeTabId: 'home',
  weather: null,
  sensors: null,
  spotify: null,
  discord: null,
  haEntities: new Map(),
  editing: false,
  showSettings: false,

  async init() {
    const [settings, tabsRes, weather, sensors, spotify, discord, haList] = await Promise.all([
      window.api.getSettings(),
      window.api.getTabs(),
      window.api.weather.snapshot(),
      window.api.sensors.snapshot(),
      window.api.spotify.snapshot(),
      window.api.discord.snapshot(),
      window.api.ha.listEntities()
    ]);

    const haMap = new Map<string, HAEntityState>();
    for (const e of haList) haMap.set(e.entityId, e);

    const layout = activeTabLayout(tabsRes.tabs, tabsRes.activeTabId);

    set({
      settings, weather, sensors, spotify, discord, haEntities: haMap,
      tabs: tabsRes.tabs, activeTabId: tabsRes.activeTabId, layout
    });

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
    const { tabs, activeTabId } = get();
    const next = tabs.map((t) => (t.id === activeTabId ? { ...t, layout: items } : t));
    set({ layout: items, tabs: next });
    await window.api.saveTabs(next, activeTabId);
  },

  toggleEditing() { set({ editing: !get().editing }); },
  setShowSettings(v) { set({ showSettings: v }); },

  updateConfig(instanceId, patch) {
    const next = get().layout.map((it) =>
      it.instanceId === instanceId ? { ...it, config: { ...(it.config ?? {}), ...patch } } : it
    );
    get().saveLayout(next);
  },
  removeWidget(instanceId) {
    const next = get().layout.filter((it) => it.instanceId !== instanceId);
    get().saveLayout(next);
  },
  addWidget(item) {
    const next = [...get().layout, item];
    get().saveLayout(next);
  },

  // ---------- Tab management ----------

  async setActiveTab(id) {
    const { tabs } = get();
    if (!tabs.find((t) => t.id === id)) return;
    set({ activeTabId: id, layout: activeTabLayout(tabs, id) });
    await window.api.saveTabs(tabs, id);
  },

  async addTab(name) {
    const { tabs } = get();
    const id = `tab-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newTab: DashboardTab = {
      id,
      name: name ?? `Tab ${tabs.length + 1}`,
      layout: []
    };
    const next = [...tabs, newTab];
    set({ tabs: next, activeTabId: id, layout: [] });
    await window.api.saveTabs(next, id);
    return id;
  },

  async renameTab(id, name) {
    const next = get().tabs.map((t) => (t.id === id ? { ...t, name } : t));
    set({ tabs: next });
    await window.api.saveTabs(next, get().activeTabId);
  },

  async setTabColor(id, color) {
    const next = get().tabs.map((t) => (t.id === id ? { ...t, color } : t));
    set({ tabs: next });
    await window.api.saveTabs(next, get().activeTabId);
  },

  async removeTab(id) {
    const { tabs, activeTabId } = get();
    if (tabs.length <= 1) return;
    const next = tabs.filter((t) => t.id !== id);
    let nextActive = activeTabId;
    if (id === activeTabId) nextActive = next[0].id;
    set({ tabs: next, activeTabId: nextActive, layout: activeTabLayout(next, nextActive) });
    await window.api.saveTabs(next, nextActive);
  },

  async reorderTabs(ids) {
    const { tabs, activeTabId } = get();
    const map = new Map(tabs.map((t) => [t.id, t]));
    const next = ids.map((id) => map.get(id)).filter(Boolean) as DashboardTab[];
    if (next.length !== tabs.length) return;
    set({ tabs: next });
    await window.api.saveTabs(next, activeTabId);
  }
}));
