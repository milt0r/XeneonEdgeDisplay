import { BrowserWindow } from 'electron';
import http from 'node:http';
import crypto from 'node:crypto';
import type { AppSettings, SpotifyPlayback } from '../../shared/types';
import type { SecretsStore } from '../secrets';

const REDIRECT_PORT = 53145;
const REDIRECT_URI = `http://127.0.0.1:${REDIRECT_PORT}/callback`;
const SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming'
].join(' ');

interface Tokens {
  access: string;
  refresh: string;
  expiresAt: number;
}

export class SpotifyProvider {
  private settings: AppSettings;
  private secrets: SecretsStore;
  private snapshot: SpotifyPlayback | null = null;
  private timer: NodeJS.Timeout | null = null;
  private tokens: Tokens | null = null;
  private onUpdate: (s: SpotifyPlayback) => void;

  constructor(settings: AppSettings, secrets: SecretsStore, onUpdate: (s: SpotifyPlayback) => void) {
    this.settings = settings;
    this.secrets = secrets;
    this.onUpdate = onUpdate;
  }

  applySettings(s: AppSettings) {
    this.settings = s;
  }

  start() {
    this.timer = setInterval(() => this.poll().catch(() => {}), 3000);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  last(): SpotifyPlayback | null {
    return this.snapshot;
  }

  async isAuthorized(): Promise<boolean> {
    return this.secrets.has('spotifyRefresh');
  }

  async logout() {
    this.tokens = null;
    this.secrets.clear('spotifyRefresh');
  }

  async beginAuth(): Promise<{ ok: boolean; error?: string }> {
    const clientId = this.settings.spotify.clientId;
    if (!clientId) return { ok: false, error: 'Spotify client ID not set' };

    const verifier = crypto.randomBytes(32).toString('base64url');
    const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
    const state = crypto.randomBytes(16).toString('hex');

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('scope', SCOPES);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('code_challenge_method', 'S256');
    authUrl.searchParams.set('code_challenge', challenge);

    return new Promise((resolve) => {
      const server = http.createServer(async (req, res) => {
        try {
          const url = new URL(req.url ?? '/', `http://127.0.0.1:${REDIRECT_PORT}`);
          if (url.pathname !== '/callback') {
            res.writeHead(404).end();
            return;
          }
          const code = url.searchParams.get('code');
          const returnedState = url.searchParams.get('state');
          if (!code || returnedState !== state) {
            res.writeHead(400).end('State mismatch');
            server.close();
            authWin.close();
            resolve({ ok: false, error: 'State mismatch' });
            return;
          }
          const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: clientId,
              grant_type: 'authorization_code',
              code,
              redirect_uri: REDIRECT_URI,
              code_verifier: verifier
            })
          });
          if (!tokenRes.ok) {
            res.writeHead(500).end('Token exchange failed');
            server.close();
            authWin.close();
            resolve({ ok: false, error: `Token exchange failed: ${tokenRes.status}` });
            return;
          }
          const tok: any = await tokenRes.json();
          this.tokens = {
            access: tok.access_token,
            refresh: tok.refresh_token,
            expiresAt: Date.now() + (tok.expires_in - 60) * 1000
          };
          this.secrets.set('spotifyRefresh', tok.refresh_token);

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<html><body style="background:#000;color:#0f0;font-family:monospace;padding:32px">Authorized. You can close this window.</body></html>');
          server.close();
          authWin.close();
          resolve({ ok: true });
        } catch (e: any) {
          res.writeHead(500).end();
          server.close();
          try { authWin.close(); } catch {}
          resolve({ ok: false, error: String(e?.message ?? e) });
        }
      });
      server.listen(REDIRECT_PORT);

      const authWin = new BrowserWindow({
        width: 520,
        height: 720,
        webPreferences: { contextIsolation: true, nodeIntegration: false }
      });
      authWin.on('closed', () => {
        try { server.close(); } catch {}
      });
      authWin.loadURL(authUrl.toString());
    });
  }

  private async ensureAccessToken(): Promise<string | null> {
    if (this.tokens && Date.now() < this.tokens.expiresAt) return this.tokens.access;
    const refresh = this.secrets.get('spotifyRefresh');
    if (!refresh || !this.settings.spotify.clientId) return null;
    try {
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: this.settings.spotify.clientId,
          grant_type: 'refresh_token',
          refresh_token: refresh
        })
      });
      if (!res.ok) return null;
      const tok: any = await res.json();
      this.tokens = {
        access: tok.access_token,
        refresh: tok.refresh_token ?? refresh,
        expiresAt: Date.now() + (tok.expires_in - 60) * 1000
      };
      if (tok.refresh_token) this.secrets.set('spotifyRefresh', tok.refresh_token);
      return this.tokens.access;
    } catch {
      return null;
    }
  }

  private async api<T = any>(path: string, init?: RequestInit): Promise<T | null> {
    const token = await this.ensureAccessToken();
    if (!token) return null;
    try {
      const res = await fetch(`https://api.spotify.com/v1${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...(init?.headers ?? {})
        }
      });
      if (res.status === 204) return null;
      if (!res.ok) return null;
      const text = await res.text();
      return text ? (JSON.parse(text) as T) : null;
    } catch {
      return null;
    }
  }

  private async poll() {
    const data = await this.api<any>('/me/player');
    if (!data) {
      if (this.snapshot && this.snapshot.isPlaying) {
        const next = { ...this.snapshot, isPlaying: false };
        this.snapshot = next;
        this.onUpdate(next);
      }
      return;
    }
    const t = data.item;
    const snap: SpotifyPlayback = {
      isPlaying: !!data.is_playing,
      progressMs: data.progress_ms ?? 0,
      shuffle: !!data.shuffle_state,
      repeat: data.repeat_state ?? 'off',
      volumePct: data.device?.volume_percent ?? 0,
      device: data.device?.name ?? null,
      track: t
        ? {
            id: t.id,
            name: t.name,
            artists: (t.artists ?? []).map((a: any) => a.name),
            album: t.album?.name ?? '',
            artUrl: t.album?.images?.[0]?.url ?? null,
            durationMs: t.duration_ms ?? 0
          }
        : null
    };
    this.snapshot = snap;
    this.onUpdate(snap);
  }

  play() { return this.api('/me/player/play', { method: 'PUT' }); }
  pause() { return this.api('/me/player/pause', { method: 'PUT' }); }
  next() { return this.api('/me/player/next', { method: 'POST' }); }
  previous() { return this.api('/me/player/previous', { method: 'POST' }); }
  setVolume(pct: number) {
    const v = Math.max(0, Math.min(100, Math.round(pct)));
    return this.api(`/me/player/volume?volume_percent=${v}`, { method: 'PUT' });
  }
  transferTo(deviceId: string) {
    return this.api('/me/player', { method: 'PUT', body: JSON.stringify({ device_ids: [deviceId], play: true }) });
  }
  async listDevices(): Promise<Array<{ id: string; name: string; isActive: boolean }>> {
    const data = await this.api<any>('/me/player/devices');
    return (data?.devices ?? []).map((d: any) => ({ id: d.id, name: d.name, isActive: d.is_active }));
  }
}
