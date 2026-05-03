import type { AppSettings, HAEntityState } from '../../shared/types';
import type { SecretsStore } from '../secrets';
import WebSocket from 'ws';

interface Hooks {
  onState(s: HAEntityState): void;
  onBulk(s: HAEntityState[]): void;
}

export class HomeAssistantProvider {
  private settings: AppSettings;
  private secrets: SecretsStore;
  private hooks: Hooks;
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private msgId = 1;
  private cache = new Map<string, HAEntityState>();
  private connected = false;

  constructor(settings: AppSettings, secrets: SecretsStore, hooks: Hooks) {
    this.settings = settings;
    this.secrets = secrets;
    this.hooks = hooks;
  }

  applySettings(s: AppSettings) {
    this.settings = s;
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
    if (!token || !base) return;
    const wsUrl = base.replace(/^http/, 'ws') + '/api/websocket';

    try {
      this.ws = new WebSocket(wsUrl);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws.on('open', () => {});
    this.ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === 'auth_required') {
          this.ws?.send(JSON.stringify({ type: 'auth', access_token: token }));
        } else if (msg.type === 'auth_ok') {
          this.connected = true;
          this.send({ type: 'get_states' });
          this.send({ type: 'subscribe_events', event_type: 'state_changed' });
        } else if (msg.type === 'result' && Array.isArray(msg.result)) {
          const states: HAEntityState[] = msg.result.map((s: any) => ({
            entityId: s.entity_id,
            state: s.state,
            attributes: s.attributes ?? {},
            lastChanged: s.last_changed
          }));
          for (const s of states) this.cache.set(s.entityId, s);
          this.hooks.onBulk(states);
        } else if (msg.type === 'event' && msg.event?.event_type === 'state_changed') {
          const ns = msg.event.data?.new_state;
          if (ns) {
            const e: HAEntityState = {
              entityId: ns.entity_id,
              state: ns.state,
              attributes: ns.attributes ?? {},
              lastChanged: ns.last_changed
            };
            this.cache.set(e.entityId, e);
            this.hooks.onState(e);
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
