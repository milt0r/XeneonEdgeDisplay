import Store from 'electron-store';
import type { AppSettings, WidgetLayoutItem } from '../shared/types';

interface PersistedShape {
  settings: AppSettings;
  layout: WidgetLayoutItem[];
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
