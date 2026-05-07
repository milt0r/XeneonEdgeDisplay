import net from 'node:net';
import { randomUUID } from 'node:crypto';
import type { DiscordVoiceState, DiscordVoiceUser } from '../../shared/discord';

/**
 * Minimal Discord local-RPC client. Connects to the running Discord
 * desktop client over a named pipe (Windows) or unix socket. Used to
 * read the user's current voice-channel state and subscribe to who's
 * speaking. Requires:
 *   - a Discord application (Developer Portal) with redirect URI set,
 *   - an OAuth access token with `rpc rpc.voice.read identify` scopes,
 *   - the Discord desktop client running and signed in.
 */

const OP_HANDSHAKE = 0;
const OP_FRAME = 1;
const OP_CLOSE = 2;
// const OP_PING = 3;
// const OP_PONG = 4;

type Listener = (state: DiscordVoiceState) => void;

export class DiscordProvider {
  private sock: net.Socket | null = null;
  private buf = Buffer.alloc(0);
  private pending = new Map<string, { resolve: (v: any) => void; reject: (e: any) => void }>();
  private listeners = new Set<Listener>();
  private state: DiscordVoiceState = emptyState();
  private currentChannelId: string | null = null;
  private settings: { clientId: string; accessToken: string } = { clientId: '', accessToken: '' };
  private reconnectTimer: NodeJS.Timeout | null = null;

  applySettings(clientId: string, accessToken: string) {
    const changed = clientId !== this.settings.clientId || accessToken !== this.settings.accessToken;
    this.settings = { clientId, accessToken };
    if (changed) {
      this.disconnect();
      if (clientId && accessToken) this.connect().catch(() => {});
    }
  }

  start() {
    if (this.settings.clientId && this.settings.accessToken) this.connect().catch(() => {});
  }

  stop() { this.disconnect(); }

  snapshot(): DiscordVoiceState { return this.state; }

  on(l: Listener): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  private emit() { for (const l of this.listeners) l(this.state); }

  private async connect(): Promise<void> {
    if (this.sock) return;
    let sock: net.Socket | null = null;
    let lastErr: any = null;
    for (let i = 0; i < 10; i++) {
      try {
        sock = await connectPipe(i);
        break;
      } catch (e) { lastErr = e; }
    }
    if (!sock) {
      this.state = { ...emptyState(), error: 'Discord client not running' };
      this.emit();
      this.scheduleReconnect();
      return;
    }
    this.sock = sock;
    sock.on('data', (chunk: Buffer) => this.onData(chunk));
    sock.on('error', () => this.handleClose());
    sock.on('close', () => this.handleClose());

    try {
      await this.handshake();
      await this.authenticate();
      await this.subscribe('VOICE_CHANNEL_SELECT');
      const cur = await this.send('GET_SELECTED_VOICE_CHANNEL', {});
      if (cur && cur.id) await this.enterChannel(cur);
      this.state = { ...this.state, connected: true, error: undefined };
      this.emit();
    } catch (e: any) {
      this.state = { ...emptyState(), error: String(e?.message ?? e) };
      this.emit();
      this.disconnect();
      this.scheduleReconnect();
    }
  }

  private disconnect() {
    if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null; }
    if (this.sock) {
      const s = this.sock; this.sock = null;
      s.removeAllListeners(); try { s.destroy(); } catch {}
    }
    this.pending.clear();
    this.currentChannelId = null;
    this.buf = Buffer.alloc(0);
    if (this.state.connected) {
      this.state = { ...emptyState(), error: this.state.error };
      this.emit();
    }
  }

  private handleClose() {
    this.disconnect();
    this.scheduleReconnect();
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    if (!this.settings.clientId || !this.settings.accessToken) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect().catch(() => {});
    }, 5000);
  }

  private writeFrame(op: number, payload: any) {
    if (!this.sock) return;
    const json = Buffer.from(JSON.stringify(payload), 'utf8');
    const header = Buffer.alloc(8);
    header.writeUInt32LE(op, 0);
    header.writeUInt32LE(json.length, 4);
    this.sock.write(Buffer.concat([header, json]));
  }

  private onData(chunk: Buffer) {
    this.buf = Buffer.concat([this.buf, chunk]);
    while (this.buf.length >= 8) {
      const op = this.buf.readUInt32LE(0);
      const len = this.buf.readUInt32LE(4);
      if (this.buf.length < 8 + len) break;
      const body = this.buf.subarray(8, 8 + len).toString('utf8');
      this.buf = this.buf.subarray(8 + len);
      try {
        const msg = JSON.parse(body);
        this.dispatch(op, msg);
      } catch {}
    }
  }

  private dispatch(_op: number, msg: any) {
    if (msg.cmd === 'DISPATCH') {
      this.handleEvent(msg.evt, msg.data);
      return;
    }
    if (msg.nonce && this.pending.has(msg.nonce)) {
      const p = this.pending.get(msg.nonce)!;
      this.pending.delete(msg.nonce);
      if (msg.evt === 'ERROR') p.reject(new Error(msg.data?.message ?? 'RPC error'));
      else p.resolve(msg.data);
    }
  }

  private send(cmd: string, args: Record<string, any>): Promise<any> {
    const nonce = randomUUID();
    return new Promise((resolve, reject) => {
      this.pending.set(nonce, { resolve, reject });
      this.writeFrame(OP_FRAME, { cmd, args, nonce });
      setTimeout(() => {
        if (this.pending.has(nonce)) {
          this.pending.delete(nonce);
          reject(new Error(`RPC ${cmd} timeout`));
        }
      }, 5000);
    });
  }

  private subscribe(evt: string, args?: Record<string, any>): Promise<any> {
    const nonce = randomUUID();
    return new Promise((resolve, reject) => {
      this.pending.set(nonce, { resolve, reject });
      this.writeFrame(OP_FRAME, { cmd: 'SUBSCRIBE', evt, args: args ?? {}, nonce });
      setTimeout(() => {
        if (this.pending.has(nonce)) { this.pending.delete(nonce); reject(new Error('SUB timeout')); }
      }, 5000);
    });
  }

  private unsubscribe(evt: string, args?: Record<string, any>): Promise<any> {
    const nonce = randomUUID();
    return new Promise((resolve, reject) => {
      this.pending.set(nonce, { resolve, reject });
      this.writeFrame(OP_FRAME, { cmd: 'UNSUBSCRIBE', evt, args: args ?? {}, nonce });
      setTimeout(() => {
        if (this.pending.has(nonce)) { this.pending.delete(nonce); reject(new Error('UNSUB timeout')); }
      }, 5000);
    });
  }

  private handshake(): Promise<void> {
    return new Promise((resolve, reject) => {
      const onReady = (msg: any) => { if (msg.cmd === 'DISPATCH' && msg.evt === 'READY') { off(); resolve(); } };
      const onErr = () => { off(); reject(new Error('handshake failed')); };
      const off = () => { this.sock?.off('data', wrap); this.sock?.off('error', onErr); };
      const wrap = (chunk: Buffer) => {
        this.buf = Buffer.concat([this.buf, chunk]);
        while (this.buf.length >= 8) {
          const op = this.buf.readUInt32LE(0);
          const len = this.buf.readUInt32LE(4);
          if (this.buf.length < 8 + len) break;
          const body = this.buf.subarray(8, 8 + len).toString('utf8');
          this.buf = this.buf.subarray(8 + len);
          try {
            const msg = JSON.parse(body);
            if (op === OP_FRAME) { onReady(msg); return; }
            if (op === OP_CLOSE) { reject(new Error(msg.message ?? 'closed')); return; }
          } catch {}
        }
      };
      this.sock?.on('data', wrap);
      this.sock?.on('error', onErr);
      this.writeFrame(OP_HANDSHAKE, { v: 1, client_id: this.settings.clientId });
      setTimeout(() => { off(); reject(new Error('handshake timeout')); }, 5000);
    });
  }

  private async authenticate(): Promise<void> {
    const data = await this.send('AUTHENTICATE', { access_token: this.settings.accessToken });
    if (data?.user?.id) this.state = { ...this.state, selfUserId: data.user.id };
  }

  private async handleEvent(evt: string, data: any) {
    if (evt === 'VOICE_CHANNEL_SELECT') {
      const channelId = data?.channel_id ?? null;
      if (this.currentChannelId) await this.leaveChannel(this.currentChannelId);
      if (channelId) await this.enterChannel({ id: channelId, guild_id: data?.guild_id });
      else {
        this.state = { ...this.state, channelId: null, channelName: null, guildId: null, guildName: null, users: [] };
        this.emit();
      }
    } else if (evt === 'VOICE_STATE_CREATE' || evt === 'VOICE_STATE_UPDATE') {
      const u = stateToUser(data);
      this.upsertUser(u);
    } else if (evt === 'VOICE_STATE_DELETE') {
      const id = data?.user?.id;
      if (id) {
        this.state = { ...this.state, users: this.state.users.filter((x) => x.userId !== id) };
        this.emit();
      }
    } else if (evt === 'SPEAKING_START') {
      this.setSpeaking(data?.user_id, true);
    } else if (evt === 'SPEAKING_STOP') {
      this.setSpeaking(data?.user_id, false);
    }
  }

  private upsertUser(u: DiscordVoiceUser) {
    const idx = this.state.users.findIndex((x) => x.userId === u.userId);
    const next = [...this.state.users];
    if (idx >= 0) next[idx] = { ...next[idx], ...u, speaking: next[idx].speaking };
    else next.push(u);
    next.sort((a, b) => (a.nick || a.username).localeCompare(b.nick || b.username));
    this.state = { ...this.state, users: next };
    this.emit();
  }

  private setSpeaking(userId: string | undefined, speaking: boolean) {
    if (!userId) return;
    const next = this.state.users.map((u) => (u.userId === userId ? { ...u, speaking } : u));
    this.state = { ...this.state, users: next };
    this.emit();
  }

  private async enterChannel(info: { id: string; guild_id?: string | null }) {
    this.currentChannelId = info.id;
    try {
      const ch = await this.send('GET_CHANNEL', { channel_id: info.id });
      const users: DiscordVoiceUser[] = (ch?.voice_states ?? []).map(stateToUser);
      this.state = {
        ...this.state,
        channelId: ch?.id ?? info.id,
        channelName: ch?.name ?? null,
        guildId: ch?.guild_id ?? info.guild_id ?? null,
        guildName: null,
        users
      };
      this.emit();
      await this.subscribe('VOICE_STATE_CREATE', { channel_id: info.id });
      await this.subscribe('VOICE_STATE_UPDATE', { channel_id: info.id });
      await this.subscribe('VOICE_STATE_DELETE', { channel_id: info.id });
      await this.subscribe('SPEAKING_START', { channel_id: info.id });
      await this.subscribe('SPEAKING_STOP', { channel_id: info.id });
    } catch {
      // ignore
    }
  }

  private async leaveChannel(channelId: string) {
    try {
      await this.unsubscribe('VOICE_STATE_CREATE', { channel_id: channelId });
      await this.unsubscribe('VOICE_STATE_UPDATE', { channel_id: channelId });
      await this.unsubscribe('VOICE_STATE_DELETE', { channel_id: channelId });
      await this.unsubscribe('SPEAKING_START', { channel_id: channelId });
      await this.unsubscribe('SPEAKING_STOP', { channel_id: channelId });
    } catch {}
    this.currentChannelId = null;
  }
}

function emptyState(): DiscordVoiceState {
  return {
    connected: false,
    channelId: null,
    channelName: null,
    guildId: null,
    guildName: null,
    users: [],
    selfUserId: null
  };
}

function stateToUser(d: any): DiscordVoiceUser {
  const u = d?.user ?? d?.member?.user ?? {};
  return {
    userId: u.id ?? d?.user_id ?? '',
    nick: d?.nick ?? '',
    username: u.global_name ?? u.username ?? 'Unknown',
    avatarUrl: u.avatar
      ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128`
      : null,
    speaking: false,
    muted: !!d?.voice_state?.mute,
    deaf: !!d?.voice_state?.deaf,
    selfMuted: !!d?.voice_state?.self_mute,
    selfDeaf: !!d?.voice_state?.self_deaf
  };
}

function connectPipe(i: number): Promise<net.Socket> {
  return new Promise((resolve, reject) => {
    const path = process.platform === 'win32'
      ? `\\\\?\\pipe\\discord-ipc-${i}`
      : `${process.env.XDG_RUNTIME_DIR ?? process.env.TMPDIR ?? '/tmp'}/discord-ipc-${i}`;
    const sock = net.createConnection(path);
    const cleanup = () => { sock.removeListener('connect', onConn); sock.removeListener('error', onErr); };
    const onConn = () => { cleanup(); resolve(sock); };
    const onErr = (e: any) => { cleanup(); try { sock.destroy(); } catch {}; reject(e); };
    sock.once('connect', onConn);
    sock.once('error', onErr);
  });
}
