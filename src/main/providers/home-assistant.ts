import type { AppSettings, HAEntityState } from '../../shared/types';
import type { SecretsStore } from '../secrets';
import WebSocket from 'ws';
import { app } from 'electron';
import fs from 'node:fs';
import path from 'node:path';

const LOG_PATH = (() => {
  try {
    const dir = app.getPath('userData');
    return path.join(dir, 'ha-debug.log');
  } catch {
    return path.join(process.cwd(), 'ha-debug.log');
  }
})();

function log(...args: any[]) {
  const line = '[' + new Date().toISOString() + '] ' + args.map((a) => typeof a === 'string' ? a : JSON.stringify(a)).join(' ') + '\n';
  try { fs.appendFileSync(LOG_PATH, line); } catch {}
  process.stderr.write(line);
}

interface Hooks {
  onState(s: HAEntityState): void;
  onBulk(s: HAEntityState[]): void;
}

interface AreaInfo { name: string; }
interface DeviceInfo { name: string | null; areaId: string | null; manufacturer: string | null; model: string | null; }
interface EntityRegInfo {
  areaId: string | null;
  deviceId: string | null;
  entityCategory: string | null;
  hidden: boolean;
  disabled: boolean;
  deviceClass: string | null;
}

// Reserve the first three IDs of the connection for the initial registry
// fetches. HA requires monotonically increasing ids on a single connection,
// so we then bump msgId past these. For later refetches (triggered by
// *_registry_updated events) we use auto-incremented ids and remember which
// one belongs to which registry via refetchKind.
const REQ_AREAS = 1;
const REQ_DEVICES = 2;
const REQ_ENTITIES = 3;

export class HomeAssistantProvider {
  private settings: AppSettings;
  private secrets: SecretsStore;
  private hooks: Hooks;
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private msgId = 1;
  private cache = new Map<string, HAEntityState>();
  private connected = false;

  private areas = new Map<string, AreaInfo>();
  private devices = new Map<string, DeviceInfo>();
  private entityReg = new Map<string, EntityRegInfo>();
  private pendingReg = new Set<number>();
  /** For refetches that use auto-incremented ids, remember which kind. */
  private refetchKind = new Map<number, 'areas' | 'devices' | 'entities'>();

  constructor(settings: AppSettings, secrets: SecretsStore, hooks: Hooks) {
    this.settings = settings;
    this.secrets = secrets;
    this.hooks = hooks;
  }

  applySettings(s: AppSettings) {
    const baseChanged = s.homeAssistant.baseUrl !== this.settings?.homeAssistant.baseUrl;
    const enabledChanged = s.homeAssistant.enabled !== this.settings?.homeAssistant.enabled;
    log('[ha] applySettings baseChanged=' + baseChanged + ' enabledChanged=' + enabledChanged + ' enabled=' + s.homeAssistant.enabled + ' url=' + s.homeAssistant.baseUrl);
    this.settings = s;
    if (!baseChanged && !enabledChanged) {
      log('[ha]   no relevant change, skipping disconnect/reconnect');
      return;
    }
    this.disconnect();
    if (s.homeAssistant.enabled && s.homeAssistant.baseUrl) this.connect();
  }

  start() {
    if (this.settings.homeAssistant.enabled && this.settings.homeAssistant.baseUrl) {
      this.connect();
    }
  }

  stop() {
    this.disconnect();
  }

  listEntities(): HAEntityState[] {
    return Array.from(this.cache.values());
  }

  async callService(domain: string, service: string, data?: Record<string, unknown>) {
    const token = this.secrets.get('haToken');
    if (!token || !this.settings.homeAssistant.baseUrl) return;
    await fetch(`${this.settings.homeAssistant.baseUrl.replace(/\/$/, '')}/api/services/${domain}/${service}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data ?? {})
    }).catch(() => {});
  }

  async test(baseUrl: string, token: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: String(e?.message ?? e) };
    }
  }

  async cameraSnapshot(entityId: string): Promise<string | null> {
    const token = this.secrets.get('haToken');
    const base = this.settings.homeAssistant.baseUrl.replace(/\/$/, '');
    if (!token || !base) return null;
    try {
      const res = await fetch(`${base}/api/camera_proxy/${encodeURIComponent(entityId)}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(5000)
      });
      if (!res.ok) return null;
      const buf = Buffer.from(await res.arrayBuffer());
      const ct = res.headers.get('content-type') || 'image/jpeg';
      return `data:${ct};base64,${buf.toString('base64')}`;
    } catch {
      return null;
    }
  }

  private connect() {
    const token = this.secrets.get('haToken');
    const base = this.settings.homeAssistant.baseUrl.replace(/\/$/, '');
    if (!token || !base) { log('[ha] connect skipped (no token or baseUrl)'); return; }
    const wsUrl = base.replace(/^http/, 'ws') + '/api/websocket';
    log('[ha] connecting to ' + wsUrl);

    try {
      this.ws = new WebSocket(wsUrl);
    } catch (e) {
      log('[ha] ws constructor threw', e);
      this.scheduleReconnect();
      return;
    }

    this.ws.on('open', () => {});
    this.ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === 'result' && (msg.id === REQ_AREAS || msg.id === REQ_DEVICES || msg.id === REQ_ENTITIES)) {
          log('[ha] result id=' + msg.id + ' success=' + msg.success + ' rows=' + (Array.isArray(msg.result) ? msg.result.length : 'n/a') + (msg.error ? ' err=' + JSON.stringify(msg.error) : ''));
        }
        if (msg.type === 'auth_required') {
          this.ws?.send(JSON.stringify({ type: 'auth', access_token: token }));
        } else if (msg.type === 'auth_ok') {
          this.connected = true;
          // Fetch registries first, then states. The result handler below will
          // run get_states once all three registries have come back.
          this.sendId({ type: 'config/area_registry/list' }, REQ_AREAS);
          this.sendId({ type: 'config/device_registry/list' }, REQ_DEVICES);
          this.sendId({ type: 'config/entity_registry/list' }, REQ_ENTITIES);
          this.pendingReg = new Set([REQ_AREAS, REQ_DEVICES, REQ_ENTITIES]);
          this.send({ type: 'subscribe_events', event_type: 'state_changed' });
          this.send({ type: 'subscribe_events', event_type: 'area_registry_updated' });
          this.send({ type: 'subscribe_events', event_type: 'device_registry_updated' });
          this.send({ type: 'subscribe_events', event_type: 'entity_registry_updated' });
          // Safety net: if registries are slow / blocked / erroring, still
          // fetch states after 3s so the picker isn't empty forever.
          setTimeout(() => {
            if (this.cache.size === 0) {
              this.pendingReg.clear();
              this.send({ type: 'get_states' });
            }
          }, 3000);
        } else if (msg.type === 'result') {
          this.handleResult(msg);
        } else if (msg.type === 'event' && msg.event?.event_type === 'state_changed') {
          const ns = msg.event.data?.new_state;
          if (ns) {
            const e = this.enrich({
              entityId: ns.entity_id,
              state: ns.state,
              attributes: ns.attributes ?? {},
              lastChanged: ns.last_changed
            });
            this.cache.set(e.entityId, e);
            this.hooks.onState(e);
          }
        } else if (msg.type === 'event' && (
          msg.event?.event_type === 'area_registry_updated' ||
          msg.event?.event_type === 'device_registry_updated' ||
          msg.event?.event_type === 'entity_registry_updated'
        )) {
          // Refetch with auto-incremented id (HA requires monotonic ids);
          // remember which registry the response is for via refetchKind.
          const id = this.msgId++;
          if (msg.event.event_type === 'area_registry_updated') {
            this.refetchKind.set(id, 'areas');
            this.sendId({ type: 'config/area_registry/list' }, id);
          } else if (msg.event.event_type === 'device_registry_updated') {
            this.refetchKind.set(id, 'devices');
            this.sendId({ type: 'config/device_registry/list' }, id);
          } else {
            this.refetchKind.set(id, 'entities');
            this.sendId({ type: 'config/entity_registry/list' }, id);
          }
        }
      } catch {}
    });
    this.ws.on('close', () => {
      this.connected = false;
      this.scheduleReconnect();
    });
    this.ws.on('error', () => {
      this.connected = false;
    });
  }

  private send(payload: Record<string, unknown>) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    if (payload.type !== 'auth') (payload as any).id = this.msgId++;
    this.ws.send(JSON.stringify(payload));
  }

  /** Send with a caller-supplied id (used to correlate registry responses). */
  private sendId(payload: Record<string, unknown>, id: number) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    (payload as any).id = id;
    this.ws.send(JSON.stringify(payload));
  }

  private handleResult(msg: any) {
    if (msg && msg.success === false) {
      log('[ha] result error id=' + msg.id + ' err=' + JSON.stringify(msg.error));
      if (msg.id === REQ_AREAS) this.pendingReg.delete(REQ_AREAS);
      else if (msg.id === REQ_DEVICES) this.pendingReg.delete(REQ_DEVICES);
      else if (msg.id === REQ_ENTITIES) this.pendingReg.delete(REQ_ENTITIES);
      this.refetchKind.delete(msg.id);
      this.maybeFetchStates();
      return;
    }
    const refetch = this.refetchKind.get(msg.id);
    if (refetch) this.refetchKind.delete(msg.id);
    if ((msg.id === REQ_AREAS || refetch === 'areas') && Array.isArray(msg.result)) {
      log('[ha] processing AREAS, count=' + msg.result.length);
      this.areas.clear();
      for (const a of msg.result) {
        if (a?.area_id) this.areas.set(a.area_id, { name: a.name ?? a.area_id });
      }
      this.pendingReg.delete(REQ_AREAS);
      this.maybeFetchStates();
      this.refreshAllEnrichments();
    } else if ((msg.id === REQ_DEVICES || refetch === 'devices') && Array.isArray(msg.result)) {
      log('[ha] processing DEVICES, count=' + msg.result.length);
      this.devices.clear();
      for (const d of msg.result) {
        if (d?.id) this.devices.set(d.id, {
          name: d.name_by_user ?? d.name ?? null,
          areaId: d.area_id ?? null,
          manufacturer: d.manufacturer ?? null,
          model: d.model ?? null
        });
      }
      this.pendingReg.delete(REQ_DEVICES);
      this.maybeFetchStates();
      this.refreshAllEnrichments();
    } else if ((msg.id === REQ_ENTITIES || refetch === 'entities') && Array.isArray(msg.result)) {
      log('[ha] processing ENTITIES reg, count=' + msg.result.length);
      this.entityReg.clear();
      for (const e of msg.result) {
        if (!e?.entity_id) continue;
        this.entityReg.set(e.entity_id, {
          areaId: e.area_id ?? null,
          deviceId: e.device_id ?? null,
          entityCategory: e.entity_category ?? null,
          hidden: !!e.hidden_by,
          disabled: !!e.disabled_by,
          deviceClass: e.device_class ?? e.original_device_class ?? null
        });
      }
      this.pendingReg.delete(REQ_ENTITIES);
      this.maybeFetchStates();
      this.refreshAllEnrichments();
    } else if (Array.isArray(msg.result) && msg.result[0]?.entity_id) {
      log('[ha] processing get_states, count=' + msg.result.length + ' areas=' + this.areas.size + ' devices=' + this.devices.size + ' entityReg=' + this.entityReg.size);
      const states: HAEntityState[] = msg.result.map((s: any) => this.enrich({
        entityId: s.entity_id,
        state: s.state,
        attributes: s.attributes ?? {},
        lastChanged: s.last_changed
      }));
      const withArea = states.filter(s => s.area).length;
      log('[ha]   ' + withArea + ' / ' + states.length + ' have area populated');
      for (const s of states) this.cache.set(s.entityId, s);
      this.hooks.onBulk(states);
    }
  }

  private maybeFetchStates() {
    if (this.pendingReg.size === 0 && this.cache.size === 0) {
      this.send({ type: 'get_states' });
    }
  }

  private refreshAllEnrichments() {
    if (this.cache.size === 0) return;
    const updated: HAEntityState[] = [];
    for (const [id, e] of this.cache) {
      const en = this.enrich(e);
      this.cache.set(id, en);
      updated.push(en);
    }
    this.hooks.onBulk(updated);
  }

  private enrich(e: HAEntityState): HAEntityState {
    const reg = this.entityReg.get(e.entityId);
    const dev = reg?.deviceId ? this.devices.get(reg.deviceId) : null;
    const areaId = reg?.areaId ?? dev?.areaId ?? null;
    const area = areaId ? this.areas.get(areaId)?.name ?? null : null;
    const attrDevClass = (e.attributes as any)?.device_class as string | undefined;
    return {
      ...e,
      area,
      device: dev?.name ?? null,
      manufacturer: dev?.manufacturer ?? null,
      deviceClass: reg?.deviceClass ?? attrDevClass ?? null,
      entityCategory: reg?.entityCategory ?? null,
      disabled: reg?.disabled ?? false,
      hidden: reg?.hidden ?? false
    };
  }

  private disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      const ws = this.ws;
      this.ws = null;
      // Swallow any errors from closing a CONNECTING socket.
      ws.on('error', () => {});
      try {
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.terminate();
        } else if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CLOSING) {
          ws.close();
        }
      } catch {
        try { ws.terminate(); } catch {}
      }
      // Defer listener removal so any pending close/error events flush first.
      setImmediate(() => {
        try { ws.removeAllListeners(); } catch {}
      });
    }
    this.cache.clear();
    this.areas.clear();
    this.devices.clear();
    this.entityReg.clear();
    this.pendingReg.clear();
    this.refetchKind.clear();
    this.msgId = 1;
    this.connected = false;
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 5000);
  }
}
