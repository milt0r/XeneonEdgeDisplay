import Store from 'electron-store';
import type { AppSettings, DashboardTab, WidgetLayoutItem } from '../shared/types';

interface PersistedShape {
  settings: AppSettings;
  layout: WidgetLayoutItem[];
  tabs?: DashboardTab[];
  activeTabId?: string;
}

export class SettingsStore {
  private store: Store<PersistedShape>;

  constructor(defaults: AppSettings, defaultLayout: WidgetLayoutItem[]) {
    this.store = new Store<PersistedShape>({
      name: 'xeneon-edge',
      defaults: { settings: defaults, layout: defaultLayout }
    });
  }

  getSettings(): AppSettings {
    return this.store.get('settings');
  }

  updateSettings(patch: Partial<AppSettings>): AppSettings {
    const merged = deepMerge(this.store.get('settings'), patch) as AppSettings;
    this.store.set('settings', merged);
    return merged;
  }

  getLayout(): WidgetLayoutItem[] {
    return this.store.get('layout');
  }

  saveLayout(items: WidgetLayoutItem[]): void {
    this.store.set('layout', items);
  }

  /**
   * Tabs are the user-facing primary container. On first read we migrate
   * the legacy single-layout into a default 'Home' tab.
   */
  getTabs(): { tabs: DashboardTab[]; activeTabId: string } {
    let tabs = this.store.get('tabs');
    if (!tabs || tabs.length === 0) {
      tabs = [{ id: 'home', name: 'Home', layout: this.store.get('layout') ?? [] }];
      this.store.set('tabs', tabs);
    }
    let activeTabId = this.store.get('activeTabId');
    if (!activeTabId || !tabs.find((t) => t.id === activeTabId)) {
      activeTabId = tabs[0].id;
      this.store.set('activeTabId', activeTabId);
    }
    return { tabs, activeTabId };
  }

  saveTabs(tabs: DashboardTab[], activeTabId?: string): void {
    this.store.set('tabs', tabs);
    if (activeTabId) {
      this.store.set('activeTabId', activeTabId);
      // Mirror active tab's layout into the legacy 'layout' key so older
      // consumers (the tray icon, future tools) still see something sensible.
      const t = tabs.find((x) => x.id === activeTabId);
      if (t) this.store.set('layout', t.layout);
    }
  }
}

function deepMerge<T>(a: T, b: Partial<T>): T {
  if (a === null || typeof a !== 'object' || Array.isArray(a)) return (b as T) ?? a;
  const out: any = { ...a };
  for (const [k, v] of Object.entries(b ?? {})) {
    out[k] =
      v && typeof v === 'object' && !Array.isArray(v)
        ? deepMerge((a as any)[k] ?? {}, v as any)
        : v;
  }
  return out;
}
