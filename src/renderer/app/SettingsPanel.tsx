import React, { useState } from 'react';
import { useApp } from '../store/app';
import { THEMES } from '../themes';
import { teamsForSport, SPORT_LABEL, type Sport } from '../themes/sports';
import { OnScreenKeyboard } from '../components/OnScreenKeyboard';
import { CommitSlider } from '../components/CommitSlider';
import { PluginRegistry } from '../plugins/registry';
import { findOpenSlot } from '../app/layout-utils';

type OskField =
  | { kind: 'lhmUrl' }
  | { kind: 'haUrl' }
  | { kind: 'haToken' }
  | { kind: 'spotifyClientId' }
  | { kind: 'discordClientId' }
  | { kind: 'discordSecret' };

export function SettingsPanel() {
  const settings = useApp((s) => s.settings)!;
  const setSettings = useApp((s) => s.setSettings);
  const setShowSettings = useApp((s) => s.setShowSettings);
  const addWidget = useApp((s) => s.addWidget);
  const removeWidget = useApp((s) => s.removeWidget);
  const layout = useApp((s) => s.layout);

  const [haUrl, setHaUrl] = useState(settings.homeAssistant.baseUrl || 'http://homeassistant.local:8123');
  const [haToken, setHaToken] = useState('');
  const [haStatus, setHaStatus] = useState<'idle' | 'ok' | 'bad'>('idle');
  const [haError, setHaError] = useState<string | null>(null);

  const [spotifyClientId, setSpotifyClientId] = useState(settings.spotify.clientId);
  const [spotifyAuthed, setSpotifyAuthed] = useState(false);
  const [discordClientId, setDiscordClientId] = useState(settings.discord?.clientId ?? '');
  const [discordSecret, setDiscordSecret] = useState('');
  const [discordHasSecret, setDiscordHasSecret] = useState(false);
  const [discordHasRefresh, setDiscordHasRefresh] = useState(false);
  const [discordAuthMsg, setDiscordAuthMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [discordAuthing, setDiscordAuthing] = useState(false);
  React.useEffect(() => {
    window.api.hasSecret('discordSecret').then(setDiscordHasSecret);
    window.api.hasSecret('discordRefresh').then(setDiscordHasRefresh);
  }, []);
  React.useEffect(() => {
    window.api.spotify.isAuthorized().then(setSpotifyAuthed);
  }, []);

  const [oskField, setOskField] = useState<OskField | null>(null);
  const oskEnabled = !!settings?.ui?.onScreenKeyboard;
  const [tab, setTab] = useState<'themes' | 'widgets' | 'providers' | 'interface' | 'window'>('themes');

  const update = async (patch: any) => {
    const next = await window.api.updateSettings(patch);
    setSettings(next);
  };

  const setTheme = (id: string) => update({ themeId: id });

  const testHa = async () => {
    setHaStatus('idle');
    const res = await window.api.ha.test(haUrl, haToken);
    if (res.ok) {
      setHaStatus('ok');
      setHaError(null);
      await window.api.setSecret('haToken', haToken);
      await update({ homeAssistant: { baseUrl: haUrl, enabled: true } });
    } else {
      setHaStatus('bad');
      setHaError(res.error ?? 'Failed');
    }
  };

  const beginSpotify = async () => {
    if (spotifyClientId !== settings.spotify.clientId) {
      await update({ spotify: { ...settings.spotify, clientId: spotifyClientId, enabled: true } });
    }
    const res = await window.api.spotify.beginAuth();
    if (res.ok) setSpotifyAuthed(true);
  };

  const addPlugin = (pluginId: string) => {
    const plugin = PluginRegistry.get(pluginId);
    if (!plugin) return;
    const id = `${pluginId}-${Date.now()}`;
    const layout = useApp.getState().layout;
    const slot = findOpenSlot(layout, plugin.defaultSize.w, plugin.defaultSize.h, 12);
    addWidget({
      i: id,
      instanceId: id,
      pluginId,
      x: slot.x,
      y: slot.y,
      w: plugin.defaultSize.w,
      h: plugin.defaultSize.h
    });
    setShowSettings(false);
  };

  // Resolve current OSK value + setter from the active field
  const oskBinding = (() => {
    if (!oskEnabled || !oskField) return null;
    switch (oskField.kind) {
      case 'lhmUrl':
        return {
          value: settings.sensors.lhmUrl,
          onChange: (v: string) => update({ sensors: { ...settings.sensors, lhmUrl: v } }),
          passwordMode: false
        };
      case 'haUrl':
        return { value: haUrl, onChange: setHaUrl, passwordMode: false };
      case 'haToken':
        return { value: haToken, onChange: setHaToken, passwordMode: true };
      case 'spotifyClientId':
        return { value: spotifyClientId, onChange: setSpotifyClientId, passwordMode: false };
      case 'discordClientId':
        return { value: discordClientId, onChange: setDiscordClientId, passwordMode: false };
      case 'discordSecret':
        return { value: discordSecret, onChange: setDiscordSecret, passwordMode: true };
    }
  })();

  return (
    <div
      className="settings-overlay"
      onClick={(e) => e.target === e.currentTarget && setShowSettings(false)}
    >
      <div className="settings-panel">
        <div className="settings-header">
          <h2>SETTINGS</h2>
          <button className="btn" onClick={() => setShowSettings(false)}>
            CLOSE
          </button>
        </div>
        <div className="settings-shell">
          <nav className="settings-sidebar">
            {([
              ['themes', '🎨', 'Themes'],
              ['widgets', '▦', 'Widgets'],
              ['providers', '🔌', 'Providers'],
              ['interface', '⚙', 'Interface'],
              ['window', '⛶', 'Window']
            ] as const).map(([id, icon, label]) => (
              <button
                key={id}
                className={`settings-tab ${tab === id ? 'active' : ''}`}
                onClick={() => setTab(id)}
              >
                <span className="settings-tab-icon">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="settings-body">
          {tab === 'interface' && (
          <section className="settings-section">
            <h3>Interface</h3>
            <label className="toggle-row">
              <span>On-screen keyboard</span>
              <input
                type="checkbox"
                checked={oskEnabled}
                onChange={(e) => update({ ui: { ...settings.ui, onScreenKeyboard: e.target.checked } })}
              />
            </label>
            <div className="muted mono" style={{ fontSize: 11, marginBottom: 12 }}>
              When on, tapping a text field opens a touch keyboard at the bottom of the screen.
            </div>

            <div className="field-row">
              <label>UI scale ({Math.round((settings.ui?.fontScale ?? 1.0) * 100)}%)</label>
              <CommitSlider
                min={0.85} max={1.5} step={0.05}
                value={settings.ui?.fontScale ?? 1.0}
                onCommit={(v) => update({ ui: { ...settings.ui, fontScale: v } })}
              />
              <div className="btn-row" style={{ marginTop: 6 }}>
                {[0.9, 1.0, 1.1, 1.25, 1.5].map((v) => (
                  <button
                    key={v}
                    className={`chip ${Math.abs((settings.ui?.fontScale ?? 1) - v) < 0.01 ? 'active' : ''}`}
                    onClick={() => update({ ui: { ...settings.ui, fontScale: v } })}
                  >
                    {Math.round(v * 100)}%
                  </button>
                ))}
              </div>
            </div>

            <div className="field-row">
              <label>Font family</label>
              <select
                value={settings.ui?.fontFamily ?? 'theme'}
                onChange={(e) => update({ ui: { ...settings.ui, fontFamily: e.target.value as any } })}
              >
                <option value="theme">Theme default</option>
                <option value="inter">Inter (clean sans)</option>
                <option value="system">System UI</option>
                <option value="rounded">Nunito (rounded sans)</option>
                <option value="serif">Serif</option>
                <option value="mono">JetBrains Mono</option>
              </select>
              <div className="muted mono" style={{ fontSize: 11 }}>
                Override the theme's fonts. Pip-Boy/Cyberpunk/Dragon are dramatic but harder to read — pick Inter or System for max readability.
              </div>
            </div>

            <div className="field-row">
              <label>Widget transparency ({Math.round((settings.ui?.widgetOpacity ?? 1.0) * 100)}%)</label>
              <CommitSlider
                min={0.4} max={1.0} step={0.05}
                value={settings.ui?.widgetOpacity ?? 1.0}
                onCommit={(v) => update({ ui: { ...settings.ui, widgetOpacity: v } })}
              />
              <div className="muted mono" style={{ fontSize: 11 }}>
                Lower values make widget panels see-through so the background shows.
              </div>
            </div>

            <div className="field-row">
              <label>Background for "{settings.themeId}" theme</label>
              <input
                placeholder="https://… or file:///… (blank = theme default)"
                value={settings.ui?.backgrounds?.[settings.themeId] ?? ''}
                onChange={(e) =>
                  update({
                    ui: {
                      ...settings.ui,
                      backgrounds: { ...(settings.ui?.backgrounds ?? {}), [settings.themeId]: e.target.value }
                    }
                  })
                }
              />
              <div className="btn-row" style={{ marginTop: 6 }}>
                <button
                  className="chip"
                  onClick={() =>
                    update({
                      ui: {
                        ...settings.ui,
                        backgrounds: { ...(settings.ui?.backgrounds ?? {}), [settings.themeId]: '' }
                      }
                    })
                  }
                >
                  Reset to theme default
                </button>
                <button
                  className="chip"
                  onClick={() =>
                    update({
                      ui: {
                        ...settings.ui,
                        backgrounds: { ...(settings.ui?.backgrounds ?? {}), [settings.themeId]: 'none' }
                      }
                    })
                  }
                >
                  No background
                </button>
                <a
                  className="chip"
                  href={`https://unsplash.com/s/photos/${encodeURIComponent(THEMES.find((t) => t.id === settings.themeId)?.name ?? settings.themeId)}`}
                  target="_blank"
                  rel="noopener"
                  style={{ textDecoration: 'none' }}
                >
                  🔍 Browse Unsplash
                </a>
              </div>
              <div className="muted mono" style={{ fontSize: 11, marginTop: 6 }}>
                Paste any image URL (https://, data:, or file:///C:/path/to/image.jpg).
                Tip: on Unsplash, right-click any photo → "Copy image address". Per-theme.
              </div>
            </div>
          </section>
          )}

          {tab === 'themes' && (
          <section className="settings-section">
            <h3>Theme</h3>
            {(() => {
              const favs = new Set(settings.ui?.favoriteThemes ?? []);
              const sorted = [...THEMES].sort((a, b) => {
                const fa = favs.has(a.id) ? 0 : 1;
                const fb = favs.has(b.id) ? 0 : 1;
                if (fa !== fb) return fa - fb;
                return a.name.localeCompare(b.name);
              });
              const toggleFav = (id: string) => {
                const cur = settings.ui?.favoriteThemes ?? [];
                const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
                update({ ui: { ...settings.ui, favoriteThemes: next } });
              };
              return (
                <div className="theme-grid">
                  {sorted.map((t) => {
                    const isFav = favs.has(t.id);
                    return (
                      <div
                        key={t.id}
                        className={`theme-card ${settings.themeId === t.id ? 'active' : ''}`}
                        onClick={() => setTheme(t.id)}
                      >
                        <button
                          className={`theme-fav ${isFav ? 'on' : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleFav(t.id); }}
                          aria-label={isFav ? 'Unfavorite' : 'Favorite'}
                          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {isFav ? '★' : '☆'}
                        </button>
                        <div className="theme-card-name">{t.name}</div>
                        <div className="theme-card-desc">{t.description}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            {(['nhl','nfl','nba','mlb','f1','nascar'] as Sport[]).includes(settings.themeId as Sport) && (() => {
              const sport = settings.themeId as Sport;
              const teams = teamsForSport(sport);
              return (
                <div className="field-row" style={{ marginTop: 12 }}>
                  <label>{SPORT_LABEL[sport]} team</label>
                  <select
                    value={settings.ui?.sportTeams?.[sport] ?? teams[0]?.id ?? ''}
                    onChange={(e) =>
                      update({
                        ui: {
                          ...settings.ui,
                          sportTeams: { ...(settings.ui?.sportTeams ?? {}), [sport]: e.target.value }
                        }
                      })
                    }
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.abbr})</option>
                    ))}
                  </select>
                  <div className="muted mono" style={{ fontSize: 11 }}>
                    Colors and a team-tinted field background apply automatically.
                    Logos are loaded from public CDNs (NHL.com, ESPN, Wikimedia).
                  </div>
                </div>
              );
            })()}
          </section>
          )}

          {tab === 'providers' && (<>
          <section className="settings-section">
            <h3>Weather</h3>
            <div className="row">
              <div className="field-row fill">
                <label>Latitude</label>
                <input
                  type="number"
                  value={settings.weather.latitude ?? ''}
                  onChange={(e) =>
                    update({
                      weather: {
                        ...settings.weather,
                        latitude: e.target.value === '' ? null : Number(e.target.value)
                      }
                    })
                  }
                />
              </div>
              <div className="field-row fill">
                <label>Longitude</label>
                <input
                  type="number"
                  value={settings.weather.longitude ?? ''}
                  onChange={(e) =>
                    update({
                      weather: {
                        ...settings.weather,
                        longitude: e.target.value === '' ? null : Number(e.target.value)
                      }
                    })
                  }
                />
              </div>
              <div className="field-row fill">
                <label>Units</label>
                <select
                  value={settings.weather.units}
                  onChange={(e) =>
                    update({
                      weather: { ...settings.weather, units: e.target.value as 'metric' | 'imperial' }
                    })
                  }
                >
                  <option value="metric">Metric (°C)</option>
                  <option value="imperial">Imperial (°F)</option>
                </select>
              </div>
            </div>
            <button className="btn" onClick={() => window.api.weather.refresh()}>
              Refresh now
            </button>
          </section>

          <section className="settings-section">
            <h3>Sensors</h3>
            <div className="field-row">
              <label>Source</label>
              <select
                value={settings.sensors.preferred}
                onChange={(e) =>
                  update({ sensors: { ...settings.sensors, preferred: e.target.value as any } })
                }
              >
                <option value="auto">Auto (SignalRGB → LHM → Mock)</option>
                <option value="signalrgb">SignalRGB</option>
                <option value="lhm">LibreHardwareMonitor</option>
                <option value="mock">Mock (demo)</option>
              </select>
            </div>
            <div className="field-row">
              <label>LibreHardwareMonitor URL</label>
              <input
                value={settings.sensors.lhmUrl}
                onFocus={() => setOskField({ kind: 'lhmUrl' })}
                onChange={(e) =>
                  update({ sensors: { ...settings.sensors, lhmUrl: e.target.value } })
                }
              />
            </div>
          </section>

          <section className="settings-section">
            <h3>
              Home Assistant
              {haStatus === 'ok' && <span className="status-pill ok">OK</span>}
              {haStatus === 'bad' && <span className="status-pill bad">{haError}</span>}
            </h3>
            <div className="field-row">
              <label>Base URL (e.g. http://homeassistant.local:8123)</label>
              <input
                value={haUrl}
                onFocus={() => setOskField({ kind: 'haUrl' })}
                onChange={(e) => setHaUrl(e.target.value)}
              />
            </div>
            <div className="field-row">
              <label>Long-lived access token</label>
              <input
                type="password"
                value={haToken}
                onFocus={() => setOskField({ kind: 'haToken' })}
                onChange={(e) => setHaToken(e.target.value)}
              />
            </div>
            <div className="btn-row">
              <button className="btn" onClick={testHa}>
                Save & Test
              </button>
            </div>
          </section>

          <section className="settings-section">
            <h3>
              Spotify
              {spotifyAuthed && <span className="status-pill ok">CONNECTED</span>}
            </h3>
            <div className="field-row">
              <label>Client ID (PKCE — no secret needed)</label>
              <input
                value={spotifyClientId}
                onFocus={() => setOskField({ kind: 'spotifyClientId' })}
                onChange={(e) => setSpotifyClientId(e.target.value)}
              />
            </div>
            <div className="muted mono" style={{ fontSize: 11, marginBottom: 8 }}>
              Add redirect URI: <code>http://127.0.0.1:53145/callback</code> in your Spotify app.
            </div>
            <div className="btn-row">
              <button className="btn" onClick={beginSpotify}>
                Connect
              </button>
              {spotifyAuthed && (
                <button
                  className="btn"
                  onClick={async () => {
                    await window.api.spotify.logout();
                    setSpotifyAuthed(false);
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          </section>

          <section className="settings-section">
            <h3>
              Discord
              {discordHasRefresh && settings.discord?.enabled && <span className="status-pill ok">CONNECTED</span>}
            </h3>
            <div className="muted mono" style={{ fontSize: 11, marginBottom: 8 }}>
              Reads your voice channel from the local Discord client (no bot needed).
              <br />1) Create an app at
              {' '}<a href="https://discord.com/developers/applications" target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>developers.discord.com</a>.
              <br />2) Under <b>OAuth2</b>, add redirect URI <code>http://localhost</code>.
              <br />3) Copy the <b>Client ID</b> and <b>Client Secret</b> here, save, then click <b>Authorize</b> — Discord will pop up a confirmation in the desktop client.
            </div>
            <div className="field-row">
              <label>Client ID</label>
              <input
                value={discordClientId}
                onFocus={() => setOskField({ kind: 'discordClientId' })}
                onChange={(e) => setDiscordClientId(e.target.value)}
              />
            </div>
            <div className="field-row">
              <label>Client Secret</label>
              <input
                type="password"
                value={discordSecret}
                placeholder={discordHasSecret ? '••• stored •••' : ''}
                onFocus={() => setOskField({ kind: 'discordSecret' })}
                onChange={(e) => setDiscordSecret(e.target.value)}
              />
            </div>
            <div className="btn-row">
              <button className="btn" onClick={async () => {
                if (discordSecret) await window.api.setSecret('discordSecret', discordSecret);
                await update({ discord: { clientId: discordClientId, enabled: true } });
                setDiscordHasSecret((prev) => prev || !!discordSecret);
                setDiscordSecret('');
                setDiscordAuthMsg({ ok: true, text: 'Saved. Now click Authorize.' });
              }}>Save</button>
              <button className="btn btn-active" disabled={discordAuthing || !discordClientId || !(discordHasSecret || discordSecret)} onClick={async () => {
                setDiscordAuthing(true);
                setDiscordAuthMsg(null);
                if (discordSecret) await window.api.setSecret('discordSecret', discordSecret);
                if (discordClientId !== settings.discord?.clientId) {
                  await update({ discord: { clientId: discordClientId, enabled: true } });
                }
                const res = await window.api.discord.beginAuth();
                setDiscordAuthing(false);
                if (res.ok) {
                  setDiscordHasRefresh(true);
                  setDiscordHasSecret(true);
                  setDiscordSecret('');
                  setDiscordAuthMsg({ ok: true, text: 'Authorized! Discord widget should now show your voice channel.' });
                } else {
                  setDiscordAuthMsg({ ok: false, text: res.error ?? 'Authorize failed' });
                }
              }}>{discordAuthing ? '⏳ Waiting for Discord…' : '🔐 Authorize'}</button>
              {(discordHasSecret || discordHasRefresh || settings.discord?.enabled) && (
                <button className="btn" onClick={async () => {
                  await window.api.clearSecret('discordSecret');
                  await window.api.clearSecret('discordRefresh');
                  await update({ discord: { clientId: '', enabled: false } });
                  setDiscordHasSecret(false);
                  setDiscordHasRefresh(false);
                  setDiscordClientId('');
                  setDiscordAuthMsg({ ok: true, text: 'Disconnected.' });
                }}>Disconnect</button>
              )}
            </div>
            {discordAuthMsg && (
              <div className={`mono`} style={{ fontSize: 12, marginTop: 8, color: discordAuthMsg.ok ? 'var(--good)' : 'var(--warn)' }}>
                {discordAuthMsg.text}
              </div>
            )}
          </section>
          </>)}

          {tab === 'widgets' && (
          <section className="settings-section">
            <h3>Add widget</h3>
            <div className="ql-grid">
              {PluginRegistry.list().map((p) => (
                <button
                  key={p.id}
                  className="btn"
                  disabled={p.external}
                  title={p.external ? 'External plugin (mocked)' : p.description}
                  onClick={() => addPlugin(p.id)}
                >
                  + {p.title}
                  {p.external ? ' (stub)' : ''}
                </button>
              ))}
            </div>
            <h3 style={{ marginTop: 16 }}>Currently on dashboard</h3>
            <div className="widget-list">
              {layout.length === 0 && <div className="muted mono">No widgets yet</div>}
              {layout.map((it) => {
                const plugin = PluginRegistry.get(it.pluginId);
                return (
                  <div key={it.instanceId} className="widget-list-row">
                    <span className="widget-list-name">{plugin?.title ?? it.pluginId}</span>
                    <span className="muted mono" style={{ fontSize: 11 }}>{it.w}×{it.h}</span>
                    <button className="chip danger" onClick={() => removeWidget(it.instanceId)}>Remove</button>
                  </div>
                );
              })}
            </div>
          </section>
          )}

          {tab === 'window' && (
          <section className="settings-section">
            <h3>Window</h3>
            <div className="btn-row">
              <button className="btn" onClick={() => window.api.window.toggleFullscreen()}>
                Toggle Fullscreen
              </button>
              <button className="btn" onClick={() => window.api.window.quit()}>
                Quit
              </button>
            </div>
          </section>
          )}
        </div>
      </div>

        {oskBinding && (
          <OnScreenKeyboard
            value={oskBinding.value}
            onChange={oskBinding.onChange}
            passwordMode={oskBinding.passwordMode}
            onClose={() => setOskField(null)}
          />
        )}
      </div>
    </div>
  );
}
