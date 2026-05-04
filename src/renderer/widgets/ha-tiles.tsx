import React, { useEffect, useMemo, useState } from 'react';
import type { WidgetPlugin, WidgetComponentProps } from '@shared/widget-plugin';
import { useApp } from '../store/app';
import { entityIcon, entityFriendlyName, entityUnit, isOnState } from '../components/HaIcon';
import { OnScreenKeyboard } from '../components/OnScreenKeyboard';
import { HaEntityDetail } from '../components/HaEntityDetail';

interface Page {
  id: string;
  name: string;
  entityIds: string[];
  /** Per-entity size override; absent means '1x1'. */
  sizes?: Record<string, TileSize>;
}

type TileSize = '1x1' | '2x1' | '1x2' | '2x2' | '3x1';

const SIZE_CYCLE: TileSize[] = ['1x1', '2x1', '3x1', '1x2', '2x2'];
const SIZE_LABEL: Record<TileSize, string> = {
  '1x1': '1×1', '2x1': '2×1', '3x1': '3×1', '1x2': '1×2', '2x2': '2×2'
};

interface Config {
  pages?: Page[];
  activePageId?: string;
  // legacy single-page format
  entityIds?: string[];
}

type Mode = 'dashboard' | 'picker';

const DOMAIN_FILTERS: Array<{ id: string; label: string; match: RegExp }> = [
  { id: 'all', label: 'All', match: /.*/ },
  { id: 'lights', label: 'Lights', match: /^light\./ },
  { id: 'switches', label: 'Switches', match: /^(switch|input_boolean|fan)\./ },
  { id: 'scenes', label: 'Scenes', match: /^(scene|script|automation)\./ },
  { id: 'sensors', label: 'Sensors', match: /^sensor\./ },
  { id: 'binary', label: 'Binary', match: /^binary_sensor\./ },
  { id: 'climate', label: 'Climate', match: /^climate\./ },
  { id: 'media', label: 'Media', match: /^media_player\./ },
  { id: 'cameras', label: 'Cameras', match: /^camera\./ },
  { id: 'covers', label: 'Covers', match: /^cover\./ },
  { id: 'locks', label: 'Locks', match: /^lock\./ },
  { id: 'people', label: 'People', match: /^(person|device_tracker)\./ }
];

function callToggle(entityId: string) {
  const domain = entityId.split('.')[0];
  let service = 'toggle';
  if (domain === 'scene' || domain === 'script') service = 'turn_on';
  else if (domain === 'lock') service = 'unlock';
  else if (domain === 'cover') service = 'toggle';
  else if (domain === 'automation') service = 'trigger';
  window.api.ha.callService(domain, service, { entity_id: entityId });
}

/* ---------------- Cards ---------------- */

function RemoveBadge({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      className="tile-remove"
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      aria-label="Remove"
    >
      ✕
    </button>
  );
}

function CameraTile({ entityId, name, onRemove }: { entityId: string; name: string; onRemove?: () => void }) {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const url = await window.api.ha.cameraSnapshot(entityId);
    setSrc(url);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId]);

  return (
    <div className="ha-card camera-card" onClick={refresh} title="Tap to refresh">
      {src ? <img src={src} alt={name} className="camera-img" /> : (
        <div className="camera-placeholder">{loading ? 'Loading…' : 'No image'}</div>
      )}
      <div className="camera-label">{name}</div>
      {onRemove && <RemoveBadge onClick={(e) => { e.stopPropagation(); onRemove(); }} />}
    </div>
  );
}

const ISO_TS = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

function SensorReadout({
  value, unit, name, icon, onRemove
}: { value: string; unit: string; name: string; icon: React.ReactElement; onRemove?: () => void }) {
  const num = parseFloat(value);
  let display: string;
  if (Number.isFinite(num)) {
    display = num.toFixed(num >= 100 || Number.isInteger(num) ? 0 : 1);
  } else if (ISO_TS.test(value)) {
    display = '—';
  } else {
    display = value;
  }
  return (
    <div className="ha-card sensor-card">
      <div className="sensor-top">
        <span className="sensor-icon">{icon}</span>
        <span className="sensor-name">{name}</span>
      </div>
      <div className="sensor-value">
        {display}
        <span className="sensor-unit">{unit}</span>
      </div>
      {onRemove && <RemoveBadge onClick={(e) => { e.stopPropagation(); onRemove(); }} />}
    </div>
  );
}

function isTimestampState(v: string): boolean {
  return ISO_TS.test(v);
}

function ToggleTile({
  entityId, state, name, icon, onRemove
}: { entityId: string; state: string; name: string; icon: React.ReactElement; onRemove?: () => void }) {
  const on = isOnState(state);
  const stateLabel = isTimestampState(state) ? '—' : state;
  return (
    <button className={`ha-card toggle-card ${on ? 'on' : ''}`} onClick={() => callToggle(entityId)}>
      <span className="toggle-icon">{icon}</span>
      <span className="toggle-name">{name}</span>
      <span className="toggle-state">{stateLabel}</span>
      {onRemove && <RemoveBadge onClick={(e) => { e.stopPropagation(); onRemove(); }} />}
    </button>
  );
}

function ClimateTile({ entityId, attrs, state, name, icon, onRemove }: any) {
  const cur = attrs.current_temperature;
  const tgt = attrs.temperature;
  const unit = attrs.unit_of_measurement ?? '°';
  return (
    <button className="ha-card climate-card" onClick={() => callToggle(entityId)}>
      <div className="sensor-top">
        <span className="sensor-icon">{icon}</span>
        <span className="sensor-name">{name}</span>
      </div>
      <div className="sensor-value">{cur != null ? cur : '—'}<span className="sensor-unit">{unit}</span></div>
      <div className="muted mono" style={{ fontSize: 11 }}>{state}{tgt != null ? ` → ${tgt}${unit}` : ''}</div>
      {onRemove && <RemoveBadge onClick={(e) => { e.stopPropagation(); onRemove(); }} />}
    </button>
  );
}

function MediaTile({ entityId, attrs, state, name, icon, onRemove }: any) {
  const title = attrs.media_title ?? '';
  const artist = attrs.media_artist ?? '';
  return (
    <button className="ha-card media-card" onClick={() => callToggle(entityId)}>
      <div className="sensor-top">
        <span className="sensor-icon">{icon}</span>
        <span className="sensor-name">{name}</span>
      </div>
      <div className="media-title">{title || state}</div>
      {artist && <div className="muted mono" style={{ fontSize: 11 }}>{artist}</div>}
      {onRemove && <RemoveBadge onClick={(e) => { e.stopPropagation(); onRemove(); }} />}
    </button>
  );
}

/* ---------------- Page-name editor ---------------- */

function PageNameEditor({ page, onCommit, onCancel }: { page: Page; onCommit: (name: string) => void; onCancel: () => void }) {
  const [name, setName] = useState(page.name);
  return (
    <div className="page-rename">
      <input
        autoFocus
        className="ha-search"
        style={{ minHeight: 36, fontSize: 14, padding: '6px 10px', maxWidth: 220 }}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onCommit(name);
          if (e.key === 'Escape') onCancel();
        }}
      />
      <button className="btn" onClick={() => onCommit(name)}>OK</button>
      <button className="btn" onClick={onCancel}>✕</button>
    </div>
  );
}

/* ---------------- Picker ---------------- */

function Picker({
  ids, allEntities, onChange, onClose, oskEnabled, pageName
}: {
  ids: string[];
  allEntities: ReturnType<typeof useApp.getState>['haEntities'];
  onChange: (next: string[]) => void;
  onClose: () => void;
  oskEnabled: boolean;
  pageName: string;
}) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [oskOpen, setOskOpen] = useState(false);

  const filterRe = DOMAIN_FILTERS.find((d) => d.id === filter)?.match ?? /.*/;
  const q = search.trim().toLowerCase();

  const entries = Array.from(allEntities.values());

  const choices = useMemo(() => {
    const filtered = entries
      .filter((e) => filterRe.test(e.entityId))
      .filter((e) => {
        if (!q) return true;
        const friendly = entityFriendlyName(e.entityId, e.attributes).toLowerCase();
        return e.entityId.toLowerCase().includes(q) || friendly.includes(q);
      });

    const selectedSet = new Set(ids);
    return filtered.sort((a, b) => {
      const sa = selectedSet.has(a.entityId) ? 0 : 1;
      const sb = selectedSet.has(b.entityId) ? 0 : 1;
      if (sa !== sb) return sa - sb;
      return entityFriendlyName(a.entityId, a.attributes).localeCompare(
        entityFriendlyName(b.entityId, b.attributes)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries.length, q, filter, ids.join(',')]);

  const toggle = (entityId: string) => {
    if (ids.includes(entityId)) onChange(ids.filter((x) => x !== entityId));
    else onChange([...ids, entityId]);
  };

  return (
    <div className="ha-picker">
      <div className="ha-picker-header no-drag">
        <button className="btn btn-icon" onClick={onClose} title="Back">←</button>
        <input
          className="ha-search"
          placeholder={`Search entities for "${pageName}"…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => oskEnabled && setOskOpen(true)}
        />
        {search && (
          <button className="btn btn-icon" onClick={() => setSearch('')} title="Clear">✕</button>
        )}
        <button className="btn" onClick={onClose}>DONE ({ids.length})</button>
      </div>
      <div className="ha-filter-bar no-drag">
        {DOMAIN_FILTERS.map((d) => {
          const count = entries.filter((e) => d.match.test(e.entityId)).length;
          return (
            <button
              key={d.id}
              className={`chip ${filter === d.id ? 'active' : ''}`}
              onClick={() => setFilter(d.id)}
            >
              {d.label} <span className="chip-count">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="ha-picker-list no-drag">
        {choices.length === 0 ? (
          <div className="ha-empty">
            <div style={{ fontSize: 16 }}>No matches</div>
            <div className="muted mono" style={{ fontSize: 12, marginTop: 4 }}>
              Try a different filter or clear your search
            </div>
          </div>
        ) : (
          choices.slice(0, 500).map((e) => {
            const name = entityFriendlyName(e.entityId, e.attributes);
            const selected = ids.includes(e.entityId);
            return (
              <button
                key={e.entityId}
                className={`ha-pick-row ${selected ? 'selected' : ''}`}
                onClick={() => toggle(e.entityId)}
              >
                <span className="pick-icon">{entityIcon(e.entityId, e.attributes, 24)}</span>
                <div className="pick-text">
                  <div className="pick-name">{name}</div>
                  <div className="pick-id">{e.entityId}</div>
                </div>
                <span className="pick-state mono">{e.state}</span>
                <span className={`pick-add ${selected ? 'on' : ''}`}>{selected ? '✓' : '+'}</span>
              </button>
            );
          })
        )}
      </div>
      <div className="ha-picker-footer mono muted">
        {choices.length} {choices.length === 1 ? 'entity' : 'entities'}{choices.length > 500 ? ' (showing first 500)' : ''} • {ids.length} selected
      </div>
      {oskEnabled && oskOpen && (
        <OnScreenKeyboard
          value={search}
          onChange={setSearch}
          onClose={() => setOskOpen(false)}
        />
      )}
    </div>
  );
}

/* ---------------- Dashboard ---------------- */

function migrateConfig(config: Config): { pages: Page[]; activePageId: string } {
  let pages = config.pages;
  if (!pages || pages.length === 0) {
    pages = [{ id: 'main', name: 'Home', entityIds: config.entityIds ?? [] }];
  }
  const activeId = pages.find((p) => p.id === config.activePageId) ? (config.activePageId as string) : pages[0].id;
  return { pages, activePageId: activeId };
}

const HaDashboard: React.FC<WidgetComponentProps<Config>> = ({ config, updateConfig }) => {
  const entities = useApp((s) => s.haEntities);
  const settings = useApp((s) => s.settings);

  const { pages, activePageId } = useMemo(() => migrateConfig(config), [config]);
  const activePage = pages.find((p) => p.id === activePageId) ?? pages[0];

  const [mode, setMode] = useState<Mode>(activePage.entityIds.length === 0 ? 'picker' : 'dashboard');
  const [editing, setEditing] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  // If user removes the last entity on this page, jump to picker.
  useEffect(() => {
    if (activePage.entityIds.length === 0 && mode === 'dashboard') setMode('picker');
  }, [activePage.entityIds.length, mode]);

  if (!settings?.homeAssistant.enabled) {
    return <div className="muted mono">Home Assistant not configured. Open Settings.</div>;
  }

  const setActive = (id: string) =>
    updateConfig({ pages, activePageId: id, entityIds: undefined } as any);

  const updatePages = (next: Page[], nextActiveId?: string) =>
    updateConfig({ pages: next, activePageId: nextActiveId ?? activePageId, entityIds: undefined } as any);

  const updateActivePage = (mutator: (p: Page) => Page) => {
    const next = pages.map((p) => (p.id === activePageId ? mutator(p) : p));
    updatePages(next);
  };

  const addPage = () => {
    const id = `p-${Date.now()}`;
    const newPage: Page = { id, name: `Page ${pages.length + 1}`, entityIds: [], sizes: {} };
    updatePages([...pages, newPage], id);
    setMode('picker');
  };

  const deletePage = (id: string) => {
    if (pages.length === 1) return;
    const next = pages.filter((p) => p.id !== id);
    const nextActive = id === activePageId ? next[0].id : activePageId;
    updatePages(next, nextActive);
  };

  const renamePage = (id: string, name: string) => {
    const next = pages.map((p) => (p.id === id ? { ...p, name: name || p.name } : p));
    updatePages(next);
    setRenamingId(null);
  };

  const cycleSize = (entityId: string) => {
    updateActivePage((p) => {
      const cur = (p.sizes ?? {})[entityId] ?? '1x1';
      const idx = SIZE_CYCLE.indexOf(cur);
      const next = SIZE_CYCLE[(idx + 1) % SIZE_CYCLE.length];
      return { ...p, sizes: { ...(p.sizes ?? {}), [entityId]: next } };
    });
  };

  const ids = activePage.entityIds;
  const sizes = activePage.sizes ?? {};

  if (mode === 'picker') {
    return (
      <Picker
        ids={ids}
        pageName={activePage.name}
        allEntities={entities}
        onChange={(next) => updateActivePage((p) => ({ ...p, entityIds: next }))}
        onClose={() => setMode(ids.length === 0 ? 'picker' : 'dashboard')}
        oskEnabled={!!settings?.ui?.onScreenKeyboard}
      />
    );
  }

  const tiles = ids
    .map((id) => entities.get(id))
    .filter(Boolean) as Array<NonNullable<ReturnType<typeof entities.get>>>;

  const removeOne = (entityId: string) => {
    updateActivePage((p) => ({
      ...p,
      entityIds: p.entityIds.filter((x) => x !== entityId),
      sizes: Object.fromEntries(Object.entries(p.sizes ?? {}).filter(([k]) => k !== entityId))
    }));
  };

  const detailEntity = detailId ? entities.get(detailId) : null;

  return (
    <div className="ha-dashboard">
      <div className="ha-tabs no-drag">
        {pages.map((p) =>
          renamingId === p.id ? (
            <PageNameEditor
              key={p.id}
              page={p}
              onCommit={(name) => renamePage(p.id, name)}
              onCancel={() => setRenamingId(null)}
            />
          ) : (
            <button
              key={p.id}
              className={`ha-tab ${p.id === activePageId ? 'active' : ''}`}
              onClick={() => setActive(p.id)}
              onDoubleClick={() => setRenamingId(p.id)}
            >
              {p.name}
              <span className="ha-tab-count">{p.entityIds.length}</span>
            </button>
          )
        )}
        <button className="ha-tab ha-tab-add" onClick={addPage} title="Add pane">+</button>
      </div>

      <div className="ha-toolbar no-drag">
        <button className="chip primary" onClick={() => setMode('picker')}>+ ADD / SEARCH</button>
        <button className={`chip ${editing ? 'active' : ''}`} onClick={() => setEditing((v) => !v)}>
          {editing ? 'DONE' : 'EDIT'}
        </button>
        {editing && pages.length > 1 && (
          <button className="chip danger" onClick={() => deletePage(activePageId)}>
            🗑 DELETE PANE
          </button>
        )}
        {editing && (
          <button className="chip" onClick={() => setRenamingId(activePageId)}>
            ✎ RENAME
          </button>
        )}
        <span className="ha-toolbar-count mono">{tiles.length} / {ids.length} loaded · double-tap to control</span>
      </div>

      <div className="ha-grid no-drag">
        {tiles.map((e) => {
          const domain = e.entityId.split('.')[0];
          const name = entityFriendlyName(e.entityId, e.attributes);
          const icon = entityIcon(e.entityId, e.attributes, 24);
          const onRemove = editing ? () => removeOne(e.entityId) : undefined;
          const size = sizes[e.entityId] ?? '1x1';

          let inner: React.ReactNode;
          if (domain === 'camera') {
            inner = <CameraTile entityId={e.entityId} name={name} onRemove={onRemove} />;
          } else if (domain === 'sensor' || domain === 'binary_sensor') {
            const unit = entityUnit(e.attributes);
            inner = <SensorReadout value={e.state} unit={unit} name={name} icon={icon} onRemove={onRemove} />;
          } else if (domain === 'climate') {
            inner = <ClimateTile entityId={e.entityId} attrs={e.attributes} state={e.state} name={name} icon={icon} onRemove={onRemove} />;
          } else if (domain === 'media_player') {
            inner = <MediaTile entityId={e.entityId} attrs={e.attributes} state={e.state} name={name} icon={icon} onRemove={onRemove} />;
          } else {
            inner = <ToggleTile entityId={e.entityId} state={e.state} name={name} icon={icon} onRemove={onRemove} />;
          }

          return (
            <div
              key={e.entityId}
              className={`ha-cell size-${size}`}
              onDoubleClick={() => setDetailId(e.entityId)}
              onPointerDown={(ev) => {
                if ((ev.target as HTMLElement).closest('.tile-detail-btn, .size-cycle, .tile-remove')) return;
                const start = Date.now();
                const id = window.setTimeout(() => {
                  setDetailId(e.entityId);
                }, 500);
                const cancel = () => {
                  if (Date.now() - start < 500) window.clearTimeout(id);
                  window.removeEventListener('pointerup', cancel);
                  window.removeEventListener('pointercancel', cancel);
                  window.removeEventListener('pointermove', cancelOnMove);
                };
                const cancelOnMove = (mv: PointerEvent) => {
                  if (Math.hypot(mv.clientX - ev.clientX, mv.clientY - ev.clientY) > 10) {
                    window.clearTimeout(id);
                    cancel();
                  }
                };
                window.addEventListener('pointerup', cancel);
                window.addEventListener('pointercancel', cancel);
                window.addEventListener('pointermove', cancelOnMove);
              }}
            >
              {inner}
              <button
                className="tile-detail-btn"
                onClick={(ev) => { ev.stopPropagation(); setDetailId(e.entityId); }}
                onPointerDown={(ev) => ev.stopPropagation()}
                title="Open controls"
                aria-label="Open controls"
              >
                ⋯
              </button>
              {editing && (
                <button
                  className="size-cycle"
                  onClick={(ev) => { ev.stopPropagation(); cycleSize(e.entityId); }}
                  onPointerDown={(ev) => ev.stopPropagation()}
                  title="Cycle size"
                >
                  ⤢ {SIZE_LABEL[size]}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {detailEntity && <HaEntityDetail entity={detailEntity} onClose={() => setDetailId(null)} />}
    </div>
  );
};

export const HaTilesWidget: WidgetPlugin<Config> = {
  id: 'ha-tiles',
  title: 'Home Assistant',
  description: 'Multi-pane HA dashboard with sensors, switches, climate, cameras',
  category: 'home',
  defaultSize: { w: 8, h: 2 },
  themeable: true,
  defaultConfig: { pages: [{ id: 'main', name: 'Home', entityIds: [] }], activePageId: 'main' },
  component: HaDashboard
};
