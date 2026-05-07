import React, { useEffect, useRef, useState } from 'react';
import type { WidgetPlugin, WidgetComponentProps } from '@shared/widget-plugin';
import { useApp } from '../store/app';

interface SoundClip {
  id: string;
  label: string;
  /** Local file path or http(s) URL. */
  src: string;
}

interface Config {
  clips: SoundClip[];
  volume: number; // 0..1
}

const DEFAULTS: Config = { clips: [], volume: 0.8 };

function srcToPlayable(p: string): string {
  if (/^https?:\/\//i.test(p) || p.startsWith('file://')) return p;
  // Local Windows / Unix path → file:// URL
  return 'file:///' + p.replace(/\\/g, '/').replace(/^\//, '');
}

function shortName(p: string): string {
  const base = p.split(/[\\/]/).pop() ?? p;
  return base.replace(/\.[^.]+$/, '');
}

const Discord: React.FC<WidgetComponentProps<Config>> = ({ config, updateConfig, configOpen }) => {
  const cfg = { ...DEFAULTS, ...(config as Partial<Config>) };
  const settings = useApp((s) => s.settings);
  const dState = useApp((s) => s.discord);
  const audioPool = useRef<HTMLAudioElement[]>([]);
  const [playing, setPlaying] = useState<string | null>(null);

  const play = (clip: SoundClip) => {
    try {
      const a = new Audio(srcToPlayable(clip.src));
      a.volume = cfg.volume;
      a.addEventListener('ended', () => setPlaying((p) => (p === clip.id ? null : p)));
      a.addEventListener('error', () => setPlaying((p) => (p === clip.id ? null : p)));
      audioPool.current.push(a);
      a.play().catch(() => {});
      setPlaying(clip.id);
    } catch {}
  };

  const stopAll = () => {
    for (const a of audioPool.current) { try { a.pause(); } catch {} }
    audioPool.current = [];
    setPlaying(null);
  };

  useEffect(() => () => stopAll(), []);

  const addClips = async () => {
    const paths = await window.api.discord.pickAudioFiles();
    const next = [...cfg.clips];
    for (const p of paths) {
      next.push({ id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, label: shortName(p), src: p });
    }
    updateConfig({ clips: next });
  };

  const updateClip = (i: number, patch: Partial<SoundClip>) =>
    updateConfig({ clips: cfg.clips.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) });
  const removeClip = (i: number) =>
    updateConfig({ clips: cfg.clips.filter((_, idx) => idx !== i) });

  return (
    <div className="col fill" style={{ gap: 8, minHeight: 0 }}>
      {configOpen && (
        <div className="widget-config no-drag" style={{ flexDirection: 'column' }}>
          <div className="muted mono" style={{ fontSize: 11 }}>
            Discord widget reads your voice channel via the local Discord client (RPC).
            Set Client ID + Access Token in Settings → Providers → Discord.
          </div>
          <div className="muted mono" style={{ fontSize: 11, color: 'var(--warn)' }}>
            Soundboard plays clips through your default audio output. To pipe them into your
            Discord mic you need a virtual cable (VB-CABLE / Voicemeeter) routed to Discord input.
          </div>
          <label className="cfg-toggle" style={{ width: '100%' }}>
            Volume
            <input type="range" min={0} max={1} step={0.05}
              value={cfg.volume}
              onChange={(e) => updateConfig({ volume: Number(e.target.value) })}
              style={{ flex: 1 }} />
            <span className="mono" style={{ fontSize: 11 }}>{Math.round(cfg.volume * 100)}%</span>
          </label>
          {cfg.clips.map((c, i) => (
            <div key={c.id} className="row" style={{ gap: 4, width: '100%', alignItems: 'center' }}>
              <input className="ha-search" style={{ minHeight: 32, fontSize: 12, padding: '4px 8px', maxWidth: 140 }}
                value={c.label} onChange={(e) => updateClip(i, { label: e.target.value })} />
              <input className="ha-search" style={{ flex: 1, minHeight: 32, fontSize: 11, padding: '4px 8px' }}
                value={c.src} onChange={(e) => updateClip(i, { src: e.target.value })} />
              <button className="btn" onClick={() => removeClip(i)}>✕</button>
            </div>
          ))}
          <div className="btn-row">
            <button className="chip primary" onClick={addClips}>+ Pick audio files…</button>
            <button className="chip" onClick={() => updateConfig({ clips: [...cfg.clips, { id: `c-${Date.now()}`, label: 'New', src: '' }] })}>+ URL</button>
          </div>
        </div>
      )}

      {/* Voice channel section */}
      {!settings?.discord?.enabled ? (
        <div className="muted mono" style={{ fontSize: 12 }}>
          Discord not configured. Open Settings → Providers → Discord.
        </div>
      ) : !dState?.connected ? (
        <div className="discord-status">
          <span className="discord-dot off" />
          <span className="mono" style={{ fontSize: 12 }}>
            {dState?.error ? `Discord: ${dState.error}` : 'Connecting to Discord…'}
          </span>
        </div>
      ) : (
        <div className="discord-channel">
          <span className="discord-dot on" />
          <span className="mono" style={{ fontSize: 13, color: 'var(--accent)' }}>
            {dState.channelName ? `# ${dState.channelName}` : '— not in voice —'}
          </span>
          <span className="muted mono" style={{ fontSize: 11, marginLeft: 'auto' }}>
            {dState.users.length} in channel
          </span>
        </div>
      )}

      {dState?.connected && dState.channelId && (
        <div className="discord-users no-drag">
          {dState.users.length === 0 && <div className="muted mono" style={{ fontSize: 12 }}>—</div>}
          {dState.users.map((u) => (
            <div key={u.userId} className={`discord-user ${u.speaking ? 'speaking' : ''} ${u.userId === dState.selfUserId ? 'me' : ''}`}>
              <div className="discord-avatar">
                {u.avatarUrl
                  ? <img src={u.avatarUrl} alt={u.username} />
                  : <span>{(u.nick || u.username).slice(0, 1).toUpperCase()}</span>
                }
                {u.speaking && <span className="discord-ring" />}
              </div>
              <span className="discord-name">{u.nick || u.username}</span>
              <span className="discord-flags mono">
                {u.selfMuted && '🎙'}
                {u.selfDeaf && '🎧'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Soundboard section */}
      {cfg.clips.length > 0 && (
        <div className="soundboard no-drag">
          <div className="row" style={{ alignItems: 'center', marginBottom: 4 }}>
            <span className="metric-label">SOUNDBOARD</span>
            <button className="chip" onClick={stopAll} style={{ marginLeft: 'auto' }}>■ STOP</button>
          </div>
          <div className="soundboard-grid">
            {cfg.clips.map((c) => (
              <button
                key={c.id}
                className={`btn soundboard-btn ${playing === c.id ? 'btn-active' : ''}`}
                onClick={() => play(c)}
              >
                {playing === c.id ? '🔊 ' : '▶ '}{c.label || shortName(c.src)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const DiscordWidget: WidgetPlugin<Config> = {
  id: 'discord',
  title: 'Discord',
  description: 'Live voice channel + speaking indicator + soundboard',
  category: 'media',
  defaultSize: { w: 4, h: 2 },
  themeable: true,
  defaultConfig: DEFAULTS,
  component: Discord
};
